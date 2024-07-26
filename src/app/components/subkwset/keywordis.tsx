'use client'

import React, { useState, useEffect } from 'react';

interface KeyWordShowProps {
    label: string;
    onKeywordChange: (newKeyword: string) => void;
}

const KeyWordShow: React.FC<KeyWordShowProps> = ({ label, onKeywordChange }) => {
    const [editMode, setEditMode] = useState(false);
    const [keyword, setKeyword] = useState(label);

    useEffect(() => {
        setKeyword(label);
    }, [label]);

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    };

    const handleBlur = () => {
        setEditMode(false);
        onKeywordChange(keyword);
    };

    return (
        <div className="text-[#3C4257]">
            <p className="text-[14px] mb-3 font-medium">メインキーワード</p>
            {editMode ? (
                <input
                    type="text"
                    value={keyword}
                    onChange={handleKeywordChange}
                    onBlur={handleBlur}
                    className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                    autoFocus
                />
            ) : (
                <div
                    className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg cursor-pointer"
                    onClick={() => setEditMode(true)}
                >
                    {keyword}
                </div>
            )}
        </div>
    );
};

export default KeyWordShow;
