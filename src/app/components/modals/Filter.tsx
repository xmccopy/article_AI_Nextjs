'use client'

import Button from "../Button";
import { useState } from "react";

interface Keyword {
    id: string;
    keyword: string;
    volume: string;
    status: string;
    selected: boolean;
}

interface FilterProps {
    onShow?: boolean;
    onApply: (selectedKeywords: Keyword[]) => void;
    onClear: () => void;
    onCancel: () => void;
    onSearch: (term: string) => void;
    handleCheckboxChange: (id: string) => void;
    handleSort: (order: 'asc' | 'desc') => void;
}

const Filter: React.FC<FilterProps> = ({
    onShow,
    onApply,
    onClear,
    onCancel,
    onSearch,
    handleCheckboxChange,
    handleSort
}) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedKeywords, setSelectedKeywords] = useState<Keyword[]>([]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value);
    };

    const handleSelectAll = () => {
        const newSelectedKeywords = selectedKeywords.map(keyword => ({ ...keyword, selected: true }));
        setSelectedKeywords(newSelectedKeywords);
    };

    const handleClear = () => {
        setSelectedKeywords([]);
        onClear();
    };

    const handleApply = () => {
        onApply(selectedKeywords);
    };

    return (
        <>
            {onShow && (
                <div className="absolute rounded-md border-[1px] shadow-lg p-5 w-[270px] flex flex-col gap-4 z-50 bg-[#F7FAFC] top-2 left-0">
                    <button className="disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 rounded-lg hover:bg-black/10 active:bg-black/30 w-full flex items-center gap-4 px-4 capitalize" type="button" onClick={() => handleSort('asc')}>
                        <p className="text-[14px]">A→Zで並び替え</p>
                    </button>
                    <button className="disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 rounded-lg hover:bg-black/10 active:bg-black/30 w-full flex items-center gap-4 px-4 capitalize" type="button" onClick={() => handleSort('desc')}>
                        <p className="text-[14px]">Z→Aで並び替え</p>
                    </button>
                    <hr />
                    <form action="" className="flex flex-col items-center justify-between gap-4">
                        <div className="relative flex items-center justify-between">
                            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3">
                                <svg className="flex-shrink-0 size-4 text-gray-400 dark:text-white/60" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </svg>
                            </div>
                            <input
                                className="py-2 ps-10 pe-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-600 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-100"
                                type="text"
                                placeholder="Input keyword."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row gap-12">
                                <p className="text-[14px]">絞り込み</p>
                                <div className="flex flex-row gap-[10px]">
                                    <div className="text-xs underline text-[#2400FF] cursor-pointer" onClick={handleSelectAll}>
                                        すべて選択
                                    </div>
                                    <div className="text-xs underline text-[#2400FF] cursor-pointer" onClick={handleClear}>
                                        クリア
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-[13px] ovoverflow-y-scroll scrollbar-thin h-[100px]">
                                {selectedKeywords.map((keyword) => (
                                    <div className="flex flex-row gap-[9px]" key={keyword.id}>
                                        <input type="checkbox" checked={keyword.selected} onChange={() => handleCheckboxChange(keyword.id)} />
                                        <p className="text-[14px]">{keyword.keyword}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-row gap-4 items-center justify-end">
                            <Button className="custom-class" onClick={onCancel} outline label="キャンセル" />
                            <Button className="custom-class" onClick={handleApply} common label="適用" />
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Filter;
