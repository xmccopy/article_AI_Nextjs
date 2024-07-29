'use client';

import React, { useState, useEffect } from "react";
import { SlPencil } from "react-icons/sl";
import { RiDeleteBinLine } from "react-icons/ri";
import InputWindow from "./InputWindow";
import { LiaSave } from "react-icons/lia";
interface ConfigEditProps {
    configcontent: string;
    onDelete: () => void;
    onSave: (newContent: string) => void;  // Add this prop to handle save
}

const ConfigEdit: React.FC<ConfigEditProps> = ({ configcontent, onDelete, onSave }) => {
    const [isActive, setIsActive] = useState(false);
    const [content, setContent] = useState(configcontent);

    useEffect(() => {
        setContent(configcontent);
    }, [configcontent]);

    const handleActivate = () => {
        setIsActive(true);
    };

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
    };

    const handleSave = () => {
        setIsActive(false);
        onSave(content);  // Save the updated content
    };

    return (
        <div className="cursor-pointer flex items-center justify-center gap-4">
            <div className="w-[500px] px-4 py-2 font-medium text-gray-900">
                {isActive ? (
                    <InputWindow
                        isActive={isActive}
                        initialContent={content}
                        onContentChange={handleContentChange}
                    />
                ) : (
                    content
                )}
            </div>
            <div className="flex items-center justify-center gap-2 font-medium text-gray-900 text-[14px]">
                {isActive ? (
                    <button onClick={handleSave} className="cursor-pointer"><LiaSave size={20}/></button>
                ) : (
                    <SlPencil onClick={handleActivate} className="cursor-pointer" size={15}/>
                )}
                <RiDeleteBinLine onClick={onDelete} size={18} />
            </div>
        </div>
    );
};

export default ConfigEdit;
