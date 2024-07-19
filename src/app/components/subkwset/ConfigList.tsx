'use client'

import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import ConfigEdit from './ConfigEdit';

interface Subtitle {
    id: string;
    tag: string;
    text: string;
}

interface Config {
    id: string;
    tag: string;
    text: string;
    subtitles: Subtitle[];
}

interface ConfigListProps {
    configs: Config[];
}

const ConfigList: React.FC<ConfigListProps> = ({ configs }) => {
    return (
        <Droppable droppableId="configs" type="h2">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {configs.map((config, index) => (
                        <Draggable key={config.id} draggableId={config.id} index={index}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <ConfigEdit configcontent={config.text} />
                                    <Droppable droppableId={`h2-${index}`} type="h3">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {config.subtitles.map((subtitle, subIndex) => (
                                                    <Draggable
                                                        key={subtitle.id}
                                                        draggableId={subtitle.id}
                                                        index={subIndex}
                                                    >
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className='ml-6 text-[14px]'
                                                            >
                                                                <ConfigEdit configcontent={subtitle.text} />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default ConfigList;