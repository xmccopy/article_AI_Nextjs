'use client'

import { useCallback, useEffect, useState } from "react";
import { IoFilter } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from 'axios';
import Button from "./Button";
import Credit from "./modals/Credit";
import EditArticle from "./modals/EditArticle";

interface SubKeyword {
    text: string;
    selected: boolean;
}

interface Article {
    id: number;
    title: string;
    keyword: string;
    subKeywords: SubKeyword[];
    status: string;
}

interface Keyword {
    keyword: string;
    status: string;
}

const ArticleSetting = () => {
    const router = useRouter();
    const [filterShow, setFilterShow] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);

    const toggleShow = useCallback(() => {
        setFilterShow(filterShow => !filterShow);
    }, []);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Completed':
                return '完 成';
            // case 'NotStarted':
            //     return '未作成';
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
            case 'Completed':
                return '編 集';
            case 'NotStarted':
                return '記事生成';
            default:
                return status;
        }
    }

    const handleButtonClick = (article: Article) => {
        setSelectedArticleId(article.id)
        setShowCreditModal(true);
    }

    const handleArticleEditConfirm = () => {
        if (selectedArticleId !== null) {
            router.push(`/setting/article-end?articleId=${selectedArticleId}`);
        }
    }

    const handleArticleEditCancel = () => {
        setShowCreditModal(false);
    }


    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL!}/article`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setArticles(response.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log("Failed to fetch articles:", error.response?.data || error.message);
                } else {
                    console.log("Failed to fetch articles:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, []);

    return (
        <>
            <EditArticle
                show={showCreditModal}
                onConfirm={handleArticleEditConfirm}
                onCancel={handleArticleEditCancel}
            />
            <div className="overflow-x-auto relative rounded-xl">
                <table className="min-w-full">
                    <thead className="bg-white text-left p-2">
                        <tr>
                            <th className="px-8 py-3 font-bold text-gray-900 text-xs text-left w-[5%]">
                                <input type="checkbox" id="SelectAll" className="size-5 rounded border-gray-300" />
                            </th>
                            <th className="whitespace-nowrap w-[25%] px-8 py-2">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">記事タイトル</p>
                                    <IoFilter onClick={toggleShow} className="cursor-pointer" />
                                </div>
                            </th>
                            <th className="whitespace-nowrap w-[10%] px-8 py-2">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">メインキーワード</p>
                                    <IoFilter />
                                </div>
                            </th>
                            <th className="whitespace-nowrap w-[10%] px-8 py-2">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">サブキーワード</p>
                                    <IoFilter />
                                </div>
                            </th>
                            <th className="whitespace-nowrap w-[10%] px-8 py-2">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">ボリューム</p>
                                    <IoFilter />
                                </div>
                            </th>
                            <th className="whitespace-nowrap w-[10%] px-8 py-2">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">ボリューム</p>
                                    <IoFilter />
                                </div>
                            </th>
                            <th className="whitespace-nowrap w-[10%] px-8 py-2 text-left">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">記事生成ステータス</p>
                                    <IoFilter />
                                </div>
                            </th>
                            <th className="whitespace-nowrap py-2 w-[15%] font-bold text-gray-900 text-xs text-left"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-gray-100">
                        {articles.map((article) => (
                            <tr key={article.id}>
                                <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px]">
                                    <input type="checkbox" className="size-5 rounded border-gray-300" />
                                </td>
                                <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px]">{article.title}</td>
                                <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px]">{article.keyword}</td>
                                <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px] w-[150px] overflow-x-auto">
                                    {article.subKeywords.map((subKeyword, index) => (
                                        <span key={index}>{subKeyword.text},</span>
                                    ))}
                                </td>
                                <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px]">12030</td>
                                <td className="whitespace-nowrap flex items-center justify-center py-2">
                                    <Button onClick={() => { }} outline roundBtn className={getStatusStyle(article.status)} label={getStatusLabel(article.status)} />
                                </td>
                                <td className="whitespace-nowrap py-2 ml-8">
                                    <div className="flex justify-around items-center">
                                        <Button
                                            className="custom-class"
                                            onClick={() => { handleButtonClick(article) }}
                                            common
                                            disabled={false}
                                            isLoading={false}
                                            label={getStatusLabelBtn(article.status)}
                                        // icon={FaStar}
                                        />
                                        {/* <FaEllipsisVertical size={20} /> */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ArticleSetting;
