'use client'

import React, { useState, useEffect } from "react";
import Button from "./Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

    useEffect(() => {
        setKeywords(initialKeywords);
    }, [initialKeywords]);

    // useEffect(() => {
    //     if (shouldNavigate) {
    //         router.push('/savedkw');
    //     }
    // }, [shouldNavigate, router])

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

            // Convert selected keywords to an array of strings
            const selectedKeywordsArray = Array.from(selectedKeywords).map(index => ({
                keyword: keywords[index].text,
                volume: keywords[index].volume,
            }));

            console.log("data:", selectedKeywordsArray);

            const response = await fetch('http://localhost:8000/keyword/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ data: selectedKeywordsArray }),
            });

            if (!response.ok) {
                throw new Error('Failed to store keywords');
            }

            const savedKeywords = await response.json();
            console.log("Saved keywords:", savedKeywords);

            // Update local state to reflect saved keywords
            setKeywords(prev => prev.map((kw, index) =>
                selectedKeywords.has(index) ? { ...kw, saved: 1 } : kw
            ));
            setSelectedKeywords(new Set());
        } catch (error) {
            console.error("Failed to generate keywords:", error);
            // Handle error (e.g., show error message to user)
        } finally {
            setIsLoading(false);
            router.push('/savedkw');
        }
    };

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="overflow-x-auto rounded-xl">
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
                            <th className="whitespace-nowrap px-8 py-3 w-[40%] font-bold text-gray-900 text-xs text-left">キーワード</th>
                            <th className="whitespace-nowrap px-8 py-3 w-[20%] font-bold text-gray-900 text-xs text-left">ボリューム</th>
                            <th className="whitespace-nowrap py-3 w-[36%] font-bold text-gray-900 text-xs text-left">ステータス</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-gray-100">
                        {keywords.map((keyword, index) => (
                            <tr key={index}>
                                <td className="whitespace-nowrap px-8 py-1 font-medium text-gray-900 text-[14px]">
                                    <input
                                        type="checkbox"
                                        disabled={keyword.saved === 1}
                                        checked={selectedKeywords.has(index)}
                                        onChange={() => toggleKeyword(index)}
                                        id={`Select${index}`}
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
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end">
                    <Button
                        className="custom-class"
                        onClick={handleGenerate}
                        common
                        label="生成する"
                        isLoading={isLoading}
                        disabled={isLoading || selectedKeywords.size === 0}
                    />
            </div>
        </div>
    );
};

export default KwTable;
