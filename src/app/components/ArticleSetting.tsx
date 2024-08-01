'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { IoFilter } from "react-icons/io5";
import { useRouter } from "next/navigation";
import axios from 'axios';
import Button from "./Button";
import EditArticle from "./modals/EditArticle";
import { FaEllipsisVertical } from "react-icons/fa6";

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
    volume: number;
}

interface DropdownPosition {
    top: number;
    right: number;
}

const ArticleSetting = () => {
    const router = useRouter();
    const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, right: 0 });
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
    const [filter, setFilter] = useState('');
    const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(null); // Close the dropdown
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allArticleIds = filteredArticles.map(article => article.id);
            setSelectedArticles(allArticleIds);
        } else {
            setSelectedArticles([]);
        }
    };

    const handleArticleSelect = (articleId: number, isSelected: boolean) => {
        if (isSelected) {
            setSelectedArticles(prevSelected => [...prevSelected, articleId]);
        } else {
            setSelectedArticles(prevSelected => prevSelected.filter(id => id !== articleId));
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Completed':
                return '完 成';
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
        setSelectedArticleId(article.id);
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

    const handleEllipsisClick = (articleId: number, event: React.MouseEvent<HTMLElement>) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const dropdownWidth = 200; // Example width
        const dropdownHeight = 150; // Example height
        const offset = 5; // Offset from the element

        let top = rect.bottom + window.scrollY + offset - 10;
        let right = window.innerWidth - rect.right - dropdownWidth - offset;

        // Adjust position if the dropdown goes beyond the viewport
        if (right < 0) {
            right = offset + 80; // Align to the left of the viewport
        }
        if (top + dropdownHeight > window.innerHeight + window.scrollY) {
            top = rect.top + window.scrollY - dropdownHeight - offset; // Position above if below viewport
        }

        // Update state with the calculated position
        setDropdownPosition({
            top,
            right
        });

        // Toggle dropdown visibility
        setShowDropdown(prevState => prevState === articleId ? null : articleId);
    };
    
    const wordPressPost = async (articleId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found!');
            }

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL!}/article/post/wordpress/${articleId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Failed to post article:", error.response?.data || error.message);
            } else {
                console.log("Failed to post article:", error);
            }
        }
    }

    const shopifyPost = (articleId: number) => {
        // Implement Shopify post logic here
    }

    const handleDeleteArticle = async (articleId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found!');
            }

            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL!}/article/${articleId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Remove the deleted article from the state
            setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Failed to delete article:", error.response?.data || error.message);
            } else {
                console.log("Failed to delete article:", error);
            }
        }
    }

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

    useEffect(() => {
        fetchArticles();
    }, []);

    useEffect(() => {
        // Apply filters
        setFilteredArticles(
            articles.filter(article => {
                return (
                    (filter === '' || article.title.includes(filter)) ||
                    (filter === '' || article.keyword.includes(filter)) ||
                    (filter === '' || article.subKeywords.some(subKeyword => subKeyword.text.includes(filter)))
                );
            })
        );
    }, [articles, filter]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFilter(value);
    }

    const handleVolumeSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        setFilteredArticles(prevArticles => {
            return [...prevArticles].sort((a, b) => {
                if (newSortOrder === 'asc') {
                    return a.volume - b.volume;
                } else {
                    return b.volume - a.volume;
                }
            });
        });
    };

    const handleArticleTitleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        setFilteredArticles(prevArticles => {
            return [...prevArticles].sort((a, b) => {
                if (newSortOrder === 'asc') {
                    return a.title.localeCompare(b.title);
                } else {
                    return b.title.localeCompare(a.title);
                }
            });
        });
    }

    const handleMainKWSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        setFilteredArticles(prevArticles => {
            return [...prevArticles].sort((a, b) => {
                if (newSortOrder === 'asc') {
                    return a.keyword.localeCompare(b.keyword);
                } else {
                    return b.keyword.localeCompare(a.keyword);
                }
            });
        });
    }

    return (
        <>
            <EditArticle
                show={showCreditModal}
                onConfirm={handleArticleEditConfirm}
                onCancel={handleArticleEditCancel}
            />
            <div className="sm:w-[350px] p-1">
                <div className="flex flex-col">
                    <input
                        type="text"
                        name="filter"
                        value={filter}
                        onChange={handleFilterChange}
                        placeholder="Filter by title, main keyword, or sub keyword"
                        className="border rounded-lg p-2"
                    />
                </div>
            </div>
            <div className="overflow-y-scroll scrollbar-thin relative rounded-xl">
                <table className="min-w-full">
                    <thead className="bg-white text-left p-2">
                        <tr>
                            <th className="px-8 py-3 font-bold text-gray-900 text-xs text-left w-[5%]">
                                <input
                                    type="checkbox"
                                    id="SelectAll"
                                    className="size-5 rounded border-gray-300"
                                    onChange={handleSelectAll}
                                    checked={filteredArticles.length > 0 && selectedArticles.length === filteredArticles.length}
                                />
                            </th>
                            <th className="whitespace-nowrap w-[30%] px-8 py-2">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">記事タイトル</p>
                                    <IoFilter onClick={handleArticleTitleSort} className="cursor-pointer" />
                                </div>
                            </th>
                            <th className="whitespace-nowrap w-[10%] px-8 py-2">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">メインキーワード</p>
                                    <IoFilter onClick={handleMainKWSort} className="cursor-pointer" />
                                </div>
                            </th>
                            <th className="whitespace-nowrap w-[10%] px-8 py-2">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">サブキーワード</p>
                                </div>
                            </th>
                            <th className="whitespace-nowrap w-[10%] px-8 py-2">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">ボリューム</p>
                                    <IoFilter onClick={handleVolumeSort} className="cursor-pointer" />
                                </div>
                            </th>
                            <th className="whitespace-nowrap w-[10%] px-8 py-2 text-left">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">記事生成ステータス</p>
                                </div>
                            </th>
                            <th className="whitespace-nowrap py-2 w-[15%] font-bold text-gray-900 text-xs text-left"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-gray-100">
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map((article) => (
                                <tr key={article.id}>
                                    <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px]">
                                        <input
                                            type="checkbox"
                                            className="size-5 rounded border-gray-300"
                                            checked={selectedArticles.includes(article.id)}
                                            onChange={(e) => handleArticleSelect(article.id, e.target.checked)}
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px]">{article.title}</td>
                                    <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px]">{article.keyword}</td>
                                    <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px] w-[150px] overflow-x-auto">
                                        {article.subKeywords.map((subKeyword, index) => (
                                            <span key={index}>{subKeyword.text} ◦ </span>
                                        ))}
                                    </td>
                                    <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px]">{article.volume || "2003"}</td>
                                    <td className="whitespace-nowrap flex items-center justify-center py-2">
                                        <Button onClick={() => { }} outline roundBtn className={getStatusStyle(article.status)} label={getStatusLabel(article.status)} />
                                    </td>
                                    <td className="whitespace-nowrap py-2 ml-8">
                                        <div className="flex justify-around items-center relative gap-2">
                                            <Button
                                                className="custom-class"
                                                onClick={() => { handleButtonClick(article) }}
                                                common
                                                disabled={false}
                                                isLoading={false}
                                                label={getStatusLabelBtn(article.status)}
                                            />
                                            <FaEllipsisVertical
                                                className="cursor-pointer mr-4 relative z-50"
                                                size={20}
                                                onClick={(e) => handleEllipsisClick(article.id, e)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="whitespace-nowrap p-8 font-medium text-gray-500 text-xl text-center">
                                    該当する結果はありません。
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {showDropdown !== null && (
                <div
                    ref={dropdownRef}
                    className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-50"
                    style={{ top: dropdownPosition.top, right: dropdownPosition.right}}
                >
                    <ul>
                        <li
                            className="text-sm p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => wordPressPost(showDropdown)}
                        >
                            ◦  WordPress連携
                        </li>
                        <li
                            className="text-sm p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => shopifyPost(showDropdown)}
                        >
                            ◦  Shopify連携
                        </li>
                        <hr />
                        <li
                            className="text-sm p-2 hover:bg-gray-100 cursor-pointer ml-2"
                            onClick={() => handleDeleteArticle(showDropdown)}
                        >
                            削 除
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
}

export default ArticleSetting;
