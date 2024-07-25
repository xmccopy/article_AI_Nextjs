'use client';

import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import InputWindow from "./InputWindow";

interface ContentEditProps {
    configcontent: string;
    onContentChange: (newContent: string) => void;
}

const ContentEdit: React.FC<ContentEditProps> = ({ configcontent , onContentChange }) => {
    const [isActive, setIsActive] = useState(false);
    const [content, setContent] = useState(configcontent);

    const handleActivate = () => {
        setIsActive(true);
    };

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        onContentChange(newContent);///add content modify
        console.log("content updated:", newContent);
    }
    return (
        <tr className="cursor-pointer">
            <td className="w-full px-4 py-2 font-medium text-gray-900 text-[16px]">
                {isActive ? (
                    <InputWindow
                        isActive={isActive}
                        initialContent={content}
                        onContentChange={handleContentChange}
                    />
                ) : (
                    content
                )}
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-[14px]">
                <FaPencilAlt onClick={handleActivate} className="cursor-pointer" />
            </td>
        </tr>
    );
};

export default ContentEdit;
