'use client'

import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import axios from "axios";
import BgImage from "./BgImage";
import { useRouter } from "next/navigation";
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';

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
    const [isLoading, setIsLoading] = useState(false);
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
                `${process.env.NEXT_PUBLIC_API_URL!}/content/create/${articleId}`,
                {}, // You can add any data you need to send in the body here
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Login successful!', life: 2000});
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

    return (
        <>
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
                <figure>
                    <BgImage imageUrl={imageUrl} />
                </figure>
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
                    <p className="text-[14px]">戻る</p>
                    <Button
                        className="custom-class"
                        onClick={() => { }}
                        common
                        label="ダウンロード"
                    />
                    <Button
                        className="custom-class"
                        onClick={() => { }}
                        common
                        label="Shopifyに記事投稿"
                    />
                    <Button
                        className="custom-class"
                        onClick={() => { }}
                        common
                        label="WordPressに記事投稿"
                    />
                    <Button
                        className="custom-class"
                        onClick={articleSaved}
                        common
                        label="保存する"
                    />
                </div>
            </div>
        </>
    );
};

export default ArticleEnd;
