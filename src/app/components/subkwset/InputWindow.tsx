'use client'

import React, { useState, useEffect, useRef } from 'react';

interface InputWindowProps {
    isActive: boolean;
    initialContent: string;
    onContentChange: (content: string) => void;
}

const InputWindow: React.FC<InputWindowProps> = ({ isActive, initialContent, onContentChange }) => {
    const [content, setContent] = useState(initialContent);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    useEffect(() => {
        adjustHeight();
    }, [content]);

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        onContentChange(newContent);
        adjustHeight();
    };

    return (
        <div className={`flex items-center min-h-[30px] ${isActive ? 'border-blue-500' : 'border-gray-300'}`}>
            <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange} 
                disabled={!isActive}
                style={{height:"36px"}}
                className={`w-full p-2 h-6 resize-none overflow-hidden rounded-md ${isActive ? 'bg-white text-black' : 'bg-gray-100 text-gray-500'} `}
            />
        </div>
    );
};

export default InputWindow;
