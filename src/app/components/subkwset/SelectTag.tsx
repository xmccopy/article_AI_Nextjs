'use client'

import React from 'react';

interface SelectTagProps {
    setSelectKeywordsPerPage: (num: number) => void;
}

const SelectTag: React.FC<SelectTagProps> = ({ setSelectKeywordsPerPage }) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectKeywordsPerPage(Number(event.target.value));
    };

    return (
        <form className="max-w-sm mx-auto ml-4">
            <select
                id="countries"
                className="bg-gray-50 rounded-md text-gray-900 border py-2 text-base block w-[50px] cursor-pointer"
                onChange={handleChange}
            >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
            </select>
        </form>
    );
}

export default SelectTag;
