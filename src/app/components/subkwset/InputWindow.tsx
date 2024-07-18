'use client'

import React, { useState, useEffect } from 'react';
import { IoIosSave } from "react-icons/io";

interface InputWindowProps {
    isActive: boolean;
    initialContent: string;
    onSave: (content: string) => void;
}

const InputWindow: React.FC<InputWindowProps> = ({ isActive, initialContent, onSave}) => {
    const [content, setContent] = useState(initialContent);

    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleSave = () => {
        onSave(content);
    };

    return (
        <div className={`flex items-center ${isActive ? 'border-blue-500' : 'border-gray-300'}`}>
            <textarea
                value={content}
                onChange={handleContentChange}
                disabled={!isActive}
                className={`w-full h-[30px] p-1 ${isActive ? 'bg-white border-[1px]' : 'bg-gray-100'} ${isActive ? 'text-black' : 'text-gray-500'}`}
            />
            {isActive && (
                <IoIosSave
                    onClick={handleSave}
                    size={25}
                    className="cursor-pointer ml-2"
                />
            )}
        </div>
    );
};

export default InputWindow;