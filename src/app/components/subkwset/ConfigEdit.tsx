'use client';

import { useState, useEffect } from "react";
import { SlPencil } from "react-icons/sl";
import InputWindow from "./InputWindow";
import { RiDeleteBinLine } from "react-icons/ri";
interface ConfigEditProps {
    configcontent: string;
    onDelete: () => void;
}

const ConfigEdit: React.FC<ConfigEditProps> = ({ configcontent, onDelete }) => {
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
        console.log("content updated:", newContent);
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
                <SlPencil onClick={handleActivate} className="cursor-pointer" size={15}/>
                <RiDeleteBinLine onClick={onDelete} size={18} />
            </div>
        </div>
    );
};

export default ConfigEdit;
