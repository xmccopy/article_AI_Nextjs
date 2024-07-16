'use client'

import React, { useEffect, useState } from "react";
import GptTitle from "./GptTitle";
import TitleEdit from "./TitleEdit";

interface TitleContainerProps {
    generateTitles: string[];
    setFinalTitle: (title: string) => void;
    finalTitle: string;
}

const TitleContainer: React.FC<TitleContainerProps> = ({
    generateTitles,
    setFinalTitle,
    finalTitle
}) => {
    const [displayedTitles, setDisplayedTitles] = useState<string[]>([]);

    useEffect(() => {
        if (generateTitles.length > 0) {
            setDisplayedTitles(generateTitles);
        }
    }, [generateTitles]);

    const handleTitleClick = (title: string) => {
        setFinalTitle(title);
    };

    return (
        <div>
            <div className="bg-[#F5F8F8] p-6 rounded-lg">
                <div className="flex flex-col gap-4">
                    {displayedTitles.length > 0 ? (
                        displayedTitles.map((title, index) => (
                            <GptTitle
                                key={index}
                                label={title}
                                onTitleClick={() => handleTitleClick(title)}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">
                            表示するタイトルがありません。
                        </p>
                    )}
                </div>
            </div>
            <TitleEdit inputValue={finalTitle} setInputValue={setFinalTitle} />
        </div>
    )
}

export default TitleContainer;