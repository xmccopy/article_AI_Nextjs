'use client';

import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import ConfigList from "@/app/components/subkwset/ConfigList";
import { v4 as uuidv4 } from 'uuid';
import { BsPlusCircleDotted } from "react-icons/bs";
interface Subtitle {
    tag: string;
    text: string;
    id: string;
}

interface Config {
    tag: string;
    text: string;
    subtitles: Subtitle[];
    id: string;
}

interface ConfigManagerProps {
    initialConfigs: Config[];
    updateFinalConfig: (config: Config[]) => void;
}

const ConfigManager: React.FC<ConfigManagerProps> = ({ initialConfigs, updateFinalConfig }) => {
    const [configs, setConfigs] = useState<Config[]>(initialConfigs);

    useEffect(() => {
        setConfigs(initialConfigs);

    }, [initialConfigs]);

    useEffect(() => {
        updateFinalConfig(configs);
    }, [configs, updateFinalConfig])

    const addH2 = () => {
        const newH2: Config = {
            id: uuidv4(),
            tag: 'h2',
            text: 'Enter text',
            subtitles: [
                {
                    id: uuidv4(),
                    tag: 'h3',
                    text: 'Enter text'
                }
            ]
        };
        setConfigs([newH2, ...configs]);
    };

    const addH3 = (h2Index: number) => {
        const newH3: Subtitle = {
            id: uuidv4(),
            tag: 'h3',
            text: 'Enter text'
        };
        const newConfigs = [...configs];
        newConfigs[h2Index].subtitles = [newH3, ...newConfigs[h2Index].subtitles];
        setConfigs(newConfigs);
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination, type } = result;

        if (!destination) return;

        const newConfigs = Array.from(configs);

        if (type === 'h2') {
            const [reorderedItem] = newConfigs.splice(source.index, 1);
            newConfigs.splice(destination.index, 0, reorderedItem);
        } else if (type === 'h3') {
            const sourceH2Index = parseInt(source.droppableId.split('-')[1]);
            const destH2Index = parseInt(destination.droppableId.split('-')[1]);

            const sourceH2 = newConfigs[sourceH2Index];
            const destH2 = newConfigs[destH2Index];

            const [movedH3] = sourceH2.subtitles.splice(source.index, 1);
            destH2.subtitles.splice(destination.index, 0, movedH3);
        }

        setConfigs(newConfigs);
    };

    const handleDeleteConfig = (configId: string) => {
        setConfigs(prevConfigs => prevConfigs.filter(config => config.id !== configId));
    };

    const handleDeleteSubtitle = (configId: string, subtitleId: string) => {
        setConfigs(prevConfigs =>
            prevConfigs.map(config =>
                config.id === configId
                    ? { ...config, subtitles: config.subtitles.filter(sub => sub.id !== subtitleId) }
                    : config
            )
        );
    };

    const handleSubtitleChange = (configId: string, subtitleId: string, newText: string) => {
        setConfigs(prevConfigs =>
            prevConfigs.map(config =>
                config.id === configId
                    ? {
                        ...config,
                        subtitles: config.subtitles.map(sub =>
                            sub.id === subtitleId ? { ...sub, text: newText } : sub
                        )
                    }
                    : config
            )
        );
    };

    const handleConfigChange = (configId: string, newText: string) => {
        setConfigs(prevConfigs =>
            prevConfigs.map(config =>
                config.id === configId ? { ...config, text: newText } : config
            )
        );
    };

    return (
        <div>
            <div onClick={addH2} className="flex items-center justify-start gap-4 my-4 ml-5 hover:font-bold cursor-pointer">
                <BsPlusCircleDotted size={25}/>
                <p>h2 追加</p>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <ConfigList
                    addH3={addH3}
                    configs={configs}
                    onDeleteConfig={handleDeleteConfig}
                    onDeleteSubtitle={handleDeleteSubtitle}
                    onConfigChange={handleConfigChange}
                    onSubtitleChange={handleSubtitleChange}
                />
            </DragDropContext>
        </div>
    );
};

export default ConfigManager;
