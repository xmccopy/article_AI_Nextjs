'use client'

import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import axios from "axios";
import BgImage from "./BgImage";
import { useRouter } from "next/navigation";
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import DownloadBtn from "./DownloadBtn";
import Title from "./Title";

interface Subtitle {
    id: string; // Add an id field
    tag: string;
    text: string;
    content: string;
}

interface Config {
    id: string; // Add an id field
    tag: string;
    text: string;
    subtitles: Subtitle[];
}

const ArticleEnd = () => {
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isArticleGenerateLoading, setIsArticleEndLoading] = useState(false);
    const [isLoadiing, setIsLoading] = useState(false)
    const [articleConfig, setArticleConfig] = useState<Config[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const router = useRouter();
    const toast = useRef<Toast>(null);



    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            const articleId = localStorage.getItem('articleId');
            if (!articleId) {
                throw new Error('No article Id is missing');
            }
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL!}/article/${articleId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                if (response.data?.contentJson === "") {
                    setError('No content available for this article');
                } else {
                    setArticleConfig(response.data?.contentJson || '[hkhjkhjhklhlk]');
                }

                setImageUrl(response.data?.image);
                console.log("article--------------", response.data);

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

        fetchContent();
    }, []);

    const articleSaved = async () => {
        const articleId = localStorage.getItem('articleId');
        if (!articleId) {
            setError('Article ID is missing');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL!}/article/content/create/${articleId}`,
                {}, // You can add any data you need to send in the body here
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Login successful!', life: 2000 });
            }

            router.push('/savedarticle');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response?.data || 'An error occurred during registration', life: 1000 });
                console.log("Failed to save article:", error.response?.data || error.message);
            } else {
                console.log("Failed to save article:", error);
            }
        }
    };

    const handleDownloadImage = async () => {
        try {
            const imageUrlDL = `http://62.3.6.59:8000/downloads/${imageUrl}`;

            // Fetch the image as a blob
            const response = await fetch(imageUrlDL);
            const blob = await response.blob();

            // Create a blob URL
            const blobUrl = window.URL.createObjectURL(blob);

            // Create a temporary link element
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'image.jpg'; // You can customize the filename here

            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Revoke the blob URL
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    const iamgeAgainGenerate = async () => {
        setIsImageLoading(true)
        const articleId = localStorage.getItem('articleId');
        if (!articleId) {
            setError('Article ID is missing');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL!}/article/image-again/${articleId}`,
                {}, // You can add any data you need to send in the body here
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Image Generate!', life: 2000 });
            }
            setImageUrl(response.data?.image);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response?.data || 'An error occurred during registration', life: 1000 });
                console.log("Failed to save article:", error.response?.data || error.message);
            } else {
                console.log("Failed to save article:", error);
            }
        } finally {
            setIsImageLoading(false);
        }
    }

    const articleAgainGenerate = async () => {
        setIsArticleEndLoading(true);
        const articleId = localStorage.getItem('articleId');
        if (!articleId) {
            throw new Error('No article Id is missing');
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL!}/article/${articleId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (response.data?.contentJson === "") {
                setError('No content available for this article');
            } else {
                setArticleConfig(response.data?.contentJson || '[hkhjkhjhklhlk]');
            }

            // setImageUrl(response.data?.image);
            console.log("article--------------", response.data);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Failed to fetch keywords:", error.response?.data || error.message);
            } else {
                console.log("Failed to fetch keywords:", error);
            }
        } finally {
            setIsArticleEndLoading(false)
        }
    }

    return (
        <>
            <div className="flex gap-5 sm:gap-20 flex-col sm:flex-row sm:justify-between">
                <Title label="記事生成" />
                {/* <Step end /> */}
                <div className="flex flex-row items-center justify-center gap-5">
                    <p className="text-base text-gray-900">記事文字数：6000文字</p>
                    <Button
                        className="custom-class"
                        disabled={false}
                        onClick={articleAgainGenerate}
                        common
                        icon={FaStar}
                        label="記事を再生成"
                        isLoading={isArticleGenerateLoading}
                    />
                </div>
            </div>
            <div className="flex sm:flex-row flex-col gap-4 mt-4">
                <div className="bg-[#F5F8F8] p-6 flex flex-col gap-4 text-[#1A1F36]">
                    <h2 className="text-xl font-bold mb-4">見出し</h2>
                    {articleConfig.map((config, index) => (
                        <div key={index}>
                            <h2 className="text-xl">{config.text}</h2>
                            {config.subtitles.map((subtitle, subIndex) => (
                                <div key={subIndex}>
                                    <h3 className="text-lg ml-4">{subtitle.text}</h3>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <figure>
                            <BgImage imageUrl={imageUrl} />
                        </figure>
                        <div className="absolute bottom-4 right-8 flex flex-row gap-2 z-50">
                            <DownloadBtn onClick={handleDownloadImage} />
                            <Button
                                className="custom-class"
                                disabled={false}
                                onClick={iamgeAgainGenerate}
                                common
                                icon={FaStar}
                                label="画像を再生成"
                                isLoading={isImageLoading}
                            />
                        </div>
                    </div>
                    <div className="bg-[#F5F8F8] p-6 text-[#1A1F36]">
                        <div className="bg-white p-6">
                            <h2 className="text-xl font-bold mb-4">目次</h2>
                            <ul className="flex flex-col gap-1">
                                {articleConfig.map((config, index) => (
                                    <li key={index}>
                                        <h2 className="text-xl ml-2">{config.text}</h2>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col gap-4 mt-8 ml-2">
                            {articleConfig.map((config, index) => (
                                <div key={index}>
                                    <h2 className="text-xl">{config.text}</h2>
                                    {config.subtitles.map((subtitle, subIndex) => (
                                        <div key={subIndex}>
                                            <h3 className="text-lg ml-4">{subtitle.text}</h3>
                                            <p className="text-base ml-8">{subtitle.content}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex sm:flex-row flex-col items-center gap-2 sm:justify-end justify-center">
                        <Link href="/register" className="text-[14px] text-gray-900 hover:underline ml-1 whitespace-nowrap font-semibold">
                            戻 る
                        </Link>
                        <Button
                            className="custom-class"
                            onClick={articleSaved}
                            common
                            label="保存する"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ArticleEnd;
