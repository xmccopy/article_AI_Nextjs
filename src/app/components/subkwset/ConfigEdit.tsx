'use client';

import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import InputWindow from "./InputWindow";

interface ConfigEditProps {
    configcontent: string;
}

const ConfigEdit: React.FC<ConfigEditProps> = ({ configcontent }) => {
    const [isActive, setIsActive] = useState(false);
    const [content, setContent] = useState(configcontent);

    const handleActivate = () => {
        setIsActive(true);
    };

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        console.log("content updated:", newContent);
    }
    return (
        <tr className="cursor-pointer">
            <td className="w-[500px] px-4 py-2 font-medium text-gray-900 text-[16px]">
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

export default ConfigEdit;
