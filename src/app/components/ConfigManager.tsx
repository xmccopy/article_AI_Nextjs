'use client'

import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import axios from 'axios';
import ConfigList from "@/app/components/subkwset/ConfigList";

interface Subtitle {
    tag: string;
    text: string;
    id: string; // Add an id field
}

interface Config {
    tag: string;
    text: string;
    subtitles: Subtitle[];
    id: string; // Add an id field
}

interface ConfigManagerProps {
    initialConfigs: Config[];
}

const ConfigManager: React.FC<ConfigManagerProps> = ({ initialConfigs }) => {
    const [configs, setConfigs] = useState<Config[]>(initialConfigs);

    useEffect(() => {
        setConfigs(initialConfigs);
    }, [initialConfigs]);

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

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <ConfigList configs={configs} />
            </DragDropContext>
        </div>
    );
};

export default ConfigManager;