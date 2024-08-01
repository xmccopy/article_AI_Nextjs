'use client'

import React, { useState, useEffect } from "react";
import Button from "./Button";
import { useRouter } from "next/navigation";
import axios from "axios";
import SelectTag from "./subkwset/SelectTag";

interface Keyword {
    text: string;
    volume: string;
    saved: number;
}

interface KwTableProps {
    keywords: Keyword[];
}

const KwTable: React.FC<KwTableProps> = ({ keywords: initialKeywords }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [keywords, setKeywords] = useState<Keyword[]>(initialKeywords);
    const [selectedKeywords, setSelectedKeywords] = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [selectKeywordsPerPage, setSelectKeywordsPerPage] = useState(10);
    const keywordsPerPage = selectKeywordsPerPage;

    useEffect(() => {
        setKeywords(initialKeywords);
    }, [initialKeywords]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectKeywordsPerPage])

    const toggleKeyword = (index: number) => {
        setSelectedKeywords(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const toggleAllKeywords = () => {
        if (selectedKeywords.size === keywords.length) {
            setSelectedKeywords(new Set());
        } else {
            setSelectedKeywords(new Set(keywords.map((_, index) => index)));
        }
    };

    const handleGenerate = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const selectedKeywordsArray = Array.from(selectedKeywords).map(index => ({
                keyword: keywords[index].text,
                volume: keywords[index].volume,
            }));

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL!}/keyword/create`,
                { data: selectedKeywordsArray },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setKeywords(prev => prev.map((kw, index) =>
                selectedKeywords.has(index) ? { ...kw, saved: 1 } : kw
            ));
            setSelectedKeywords(new Set());
            router.push('/savedkw');
        } catch (error) {
            console.error("Failed to store keywords:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const indexOfLastKeyword = currentPage * keywordsPerPage;
    const indexOfFirstKeyword = indexOfLastKeyword - keywordsPerPage;
    const currentKeywords = keywords.slice(indexOfFirstKeyword, indexOfLastKeyword);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="w-full flex flex-col gap-5 ">
            <div className="overflow-y-scroll rounded-xl">
                <table className="min-w-full">
                    <thead className="bg-white text-left p-2">
                        <tr>
                            <th className="whitespace-nowrap px-8 py-3 font-bold text-gray-900 text-xs text-left w-[4%]">
                                <input
                                    type="checkbox"
                                    id="SelectAll"
                                    className="size-5 rounded border-gray-300"
                                    checked={selectedKeywords.size === keywords.length && keywords.length > 0}
                                    onChange={toggleAllKeywords}
                                />
                            </th>
                            <th className=" whitespace-nowrap px-8 py-3 w-[40%] font-bold text-gray-900 text-xs text-left">キーワード</th>
                            <th className="whitespace-nowrap px-8 py-3 w-[20%] font-bold text-gray-900 text-xs text-left">ボリューム</th>
                            <th className="whitespace-nowrap py-3 w-[36%] font-bold text-gray-900 text-xs text-left">ステータス</th>
                        </tr>
                    </thead>
                    <tbody className="divide-gray-200 bg-gray-100">
                        {currentKeywords.length > 0 ? (
                            currentKeywords.map((keyword, index) => (
                                <tr key={index}>
                                    <td className="whitespace-nowrap px-8 py-1 font-medium text-gray-900 text-[14px]">
                                        <input
                                            type="checkbox"
                                            disabled={keyword.saved === 1}
                                            checked={selectedKeywords.has(indexOfFirstKeyword + index)}
                                            onChange={() => toggleKeyword(indexOfFirstKeyword + index)}
                                            id={`Select${indexOfFirstKeyword + index}`}
                                            className="size-5 rounded border-gray-300"
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-8 py-1 font-medium text-gray-900 text-[14px]">{keyword.text}</td>
                                    <td className="whitespace-nowrap px-8 py-1 font-medium text-gray-900 text-[14px]">{keyword.volume}</td>
                                    <td className="py-2">
                                        <Button
                                            className="custom-class"
                                            disabled={false}
                                            onClick={() => { }}
                                            outline
                                            label={keyword.saved === 1 ? "生成済み" : "未生成"}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">
                                    表示するデータがない。
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end">
                <div className="flex justify-center items-center sm:mr-20">
                    {Array.from({ length: Math.ceil(keywords.length / keywordsPerPage) }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`rounded-md px-4 py-2 mx-1 border ${currentPage === i + 1 ? 'bg-[#5469D4] text-white' : 'bg-white text-black'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    {currentKeywords.length > 0 ? (
                        <SelectTag setSelectKeywordsPerPage={setSelectKeywordsPerPage} />
                    ) : ''}
                </div>
                <Button
                    className="custom-class"
                    onClick={handleGenerate}
                    common
                    label="保存をする"
                    isLoading={isLoading}
                    disabled={isLoading || selectedKeywords.size === 0}
                />
            </div>
        </div>
    );
};

export default KwTable;
