'use client'

import Button from "./Button";
import { IoFilter } from "react-icons/io5";
import { FaEllipsisVertical } from "react-icons/fa6"
import { useCallback, useEffect, useState } from "react";
import Filter from "./modals/Filter";
import { useRouter } from "next/navigation";
import axios from 'axios';
import Credit from "./modals/Credit";
import SpinSetting from "./Spin";
import { FaStar } from "react-icons/fa";

interface Keyword {
    id: number;
    keyword: string;
    volume: string;
    status: string;
}

const statusKw = () => {
    const router = useRouter();
    const [filterShow, setFilterShow] = useState(false);
    const [keywords, setKeywords] = useState<Keyword[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);

    const toggleShow = useCallback(() => {
        setFilterShow(filterShow => !filterShow);
    }, []);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Created':
                return '生成済';
            case 'NotStarted':
                return '未作成';
            default:
                return status;
        }
    }

    const getStatusStyle = (status: string) => {
        if (status === 'Created') {
            return 'bg-[#FF854F] text-white';
        }
        return '';
    }

    const getStatusLabelBtn = (status: string) => {
        switch (status) {
            case 'Created':
                return '編 集';
            case 'NotStarted':
                return '記事生成';
            default:
                return status;
        }
    }

    const handleButtonClick = (keyword: Keyword) => {
        if (keyword.status === 'NotStarted') {
            setShowCreditModal(true);
            setSelectedKeyword(keyword);
        } else {
            articleGenerate(keyword);
        }
    }

    const handleGenerateConfirm = () => {
        if (selectedKeyword) {
            articleGenerate(selectedKeyword);
        }
    }

    const handleGenerateCancel = () => {
        setShowCreditModal(false);
    }

    const articleGenerate = (keyword: Keyword) => {
        router.push(`/setting?keyword=${encodeURIComponent(keyword.keyword)}`);
    };


    useEffect(() => {
        const fetchKeywords = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }
    
                const response = await axios.get('http://192.168.136.127:8000/keyword', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
    
                console.log("keyword", response.data);
                setKeywords(response.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log("Failed to fetch keywords:", error.response?.data || error.message);
                } else {
                    console.log("Failed to fetch keywords:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchKeywords();
    }, []);

    return (
        <>
            <Credit
                show={showCreditModal}
                onConfirm={handleGenerateConfirm}
                onCancel={handleGenerateCancel}
            />
            <Filter onShow={filterShow} />
            <div className="overflow-x-auto relative rounded-xl">
                <table className="min-w-full">
                    <thead className="bg-white text-left p-2">
                        <tr>
                            <th className=" px-8 py-3 font-bold text-gray-900 text-xs text-left w-[4%]">
                                <input type="checkbox" id="SelectAll" className="size-5 rounded border-gray-300" />
                            </th>
                            <th className="whitespace-nowrap px-8 py-2">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">キーワード</p>
                                    <IoFilter onClick={toggleShow} className="cursor-pointer" />

                                </div>
                            </th>
                            <th className="whitespace-nowrap px-8 py-2">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">ボリューム</p>
                                    <IoFilter />
                                </div>
                            </th>
                            <th className="whitespace-nowrap px-8 py-2  text-left">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">記事生成ステータス</p>
                                    <IoFilter />
                                </div>
                            </th>
                            <th className="whitespace-nowrap py-2 font-bold text-gray-900 text-xs text-left"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-gray-100">
                        {keywords.map((keyword) => (
                            <tr key={keyword.id}>
                                <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px]">
                                    <input type="checkbox" id={`Select${keyword.id}`} className="size-5 rounded border-gray-300" />
                                </td>
                                <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px]">{keyword.keyword}</td>
                                <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px]">{keyword.volume}</td>
                                <td className="whitespace-nowrap flex items-center justify-center py-2">
                                    <Button 
                                        onClick={() => { }} 
                                        outline 
                                        roundBtn 
                                        className={getStatusStyle(keyword.status)} 
                                        label={getStatusLabel(keyword.status)} 
                                    />
                                </td>
                                <td className="whitespace-nowrap py-2 ml-8">
                                    <div className="flex justify-around items-center">
                                        <Button 
                                            className="custom-class"
                                            onClick={() => {handleButtonClick(keyword)}} 
                                            common
                                            disabled={false}
                                            isLoading={false}
                                            label={getStatusLabelBtn(keyword.status)}
                                            icon={FaStar}
                                        />
                                        <FaEllipsisVertical size={20} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default statusKw;