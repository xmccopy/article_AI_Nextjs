'use client';

import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';

interface ApiData {
    apiUsername: string;
    apiPassword: string;
    siteUrl: string;
}

const ApiSetting: React.FC = () => {
    const [wordpressData, setWordpressData] = useState<ApiData>({
        apiUsername: '',
        apiPassword: '',
        siteUrl: ''
    });

    const [initialData, setInitialData] = useState<ApiData>({
        apiUsername: '',
        apiPassword: '',
        siteUrl: ''
    });

    const [isWordpressEditMode, setIsWordpressEditMode] = useState<boolean>(false);
    const [isWordpressModified, setIsWordpressModified] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL!}/wp-api`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (response.status === 200) {
                    const data = response.data;
                    if (data.wordpressApi) {
                        const apiData = {
                            apiUsername: data.wordpressApi.apiUsername,
                            apiPassword: data.wordpressApi.apiPassword,
                            siteUrl: data.wordpressApi.siteUrl
                        };
                        setWordpressData(apiData);
                        setInitialData(apiData);
                        setIsWordpressEditMode(false); // Initially in view mode
                    } else {
                        setIsWordpressEditMode(false); // No data, still in view mode
                    }
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data', life: 2000 });
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const isModified = (
            wordpressData.apiUsername !== initialData.apiUsername ||
            wordpressData.apiPassword !== initialData.apiPassword ||
            wordpressData.siteUrl !== initialData.siteUrl
        );
        setIsWordpressModified(isModified);
    }, [wordpressData, initialData]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setWordpressData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddClick = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL!}/wp-api`,
                wordpressData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Data added successfully!', life: 2000 });
                setInitialData(wordpressData);
                setIsWordpressModified(false);
                setIsWordpressEditMode(false);
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to add data', life: 2000 });
        }
    };

    const handleUpdateClick = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL!}/wp-api`,
                wordpressData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                const updatedData = response.data.wordpressApi;
                setWordpressData(updatedData);
                setInitialData(updatedData);
                setIsWordpressModified(false);
                setIsWordpressEditMode(false);  // Disable input fields
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Data updated successfully!', life: 2000 });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update data', life: 2000 });
        }
    };

    const toggleEditMode = () => {
        setIsWordpressEditMode(true);
    };

    return (
        <div className="flex flex-col gap-6 mt-6">
            <Toast ref={toast} />
            <form>
                <p className="text-base text-[#1A1F36] mb-3 font-bold">ShopifyのAPIキー</p>
                <div className="flex flex-col gap-4 mt-4">
                    <input
                        type="text"
                        name="apiUsername"
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input apiUsername"
                    />
                    <input
                        type="password"
                        name="apiPassword"
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input apiPassword"
                    />
                    <input
                        type="text"
                        name="siteUrl"
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="siteUrl"
                    />
                    <div className="flex gap-4 flex-col sm:flex-row">
                        
                            <button
                                className={`text-[14px] rounded-md text-[#5469D4] bg-slate-100 w-full sm:w-[100px] h-[50px] hover:font-bold`}
                                onClick={handleAddClick}
                                type="button"
                            >
                                追加する
                            </button>
                    </div>
                </div>
            </form>
            <form>
                <p className="text-base text-[#1A1F36] mb-3 font-bold">WordPressのAPIキー</p>
                <div className="flex flex-col gap-4 mt-4">
                    <input
                        type="text"
                        name="apiUsername"
                        value={wordpressData.apiUsername}
                        onChange={handleInputChange}
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input apiUsername"
                        disabled={!isWordpressEditMode}
                    />
                    <input
                        type="password"
                        name="apiPassword"
                        value={wordpressData.apiPassword}
                        onChange={handleInputChange}
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input apiPassword"
                        disabled={!isWordpressEditMode}
                    />
                    <input
                        type="text"
                        name="siteUrl"
                        value={wordpressData.siteUrl}
                        onChange={handleInputChange}
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="siteUrl"
                        disabled={!isWordpressEditMode}
                    />
                    <div className="flex gap-4 flex-col sm:flex-row">
                        {initialData.apiUsername ? (
                            <button
                                className={`text-[14px] rounded-md text-[#5469D4] bg-slate-100 w-full sm:w-[100px] h-[50px] hover:font-bold ${isWordpressModified ? 'text-green-500' : ''}`}
                                type="button"
                                onClick={isWordpressEditMode ? (isWordpressModified ? handleUpdateClick : toggleEditMode) : toggleEditMode}
                            >
                                {isWordpressEditMode ? (isWordpressModified ? '更新する' : '編集する') : '編集する'}
                            </button>
                        ) : (
                            <button
                                className={`text-[14px] rounded-md text-[#5469D4] bg-slate-100 w-full sm:w-[100px] h-[50px] hover:font-bold`}
                                onClick={handleAddClick}
                                type="button"
                            >
                                追加する
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ApiSetting;