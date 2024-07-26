'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
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
    const [shopifyData, setShopifyData] = useState<ApiData>({
        apiUsername: '',
        apiPassword: '',
        siteUrl: ''
    });
    const [wordpressData, setWordpressData] = useState<ApiData>({
        apiUsername: '',
        apiPassword: '',
        siteUrl: ''
    });
    const [isShopifyValid, setIsShopifyValid] = useState<boolean>(false);
    const [isWordpressValid, setIsWordpressValid] = useState<boolean>(false);
    const [isShopifyEditMode, setIsShopifyEditMode] = useState<boolean>(false);
    const [isWordpressEditMode, setIsWordpressEditMode] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const { apiUsername, apiPassword, siteUrl } = shopifyData;
        setIsShopifyValid(apiUsername !== '' && apiPassword !== '' && siteUrl !== '');
    }, [shopifyData]);

    useEffect(() => {
        const { apiUsername, apiPassword, siteUrl } = wordpressData;
        setIsWordpressValid(apiUsername !== '' && apiPassword !== '' && siteUrl !== '');
    }, [wordpressData]);

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
                if (data.wordpressApi && data.shopifyApi) {
                    setWordpressData({
                        apiUsername: data.wordpressApi.apiUsername,
                        apiPassword: data.wordpressApi.apiPassword,
                        siteUrl: data.wordpressApi.siteUrl
                    });
                    setShopifyData({
                        apiUsername: data.shopifyApi.apiUsername,
                        apiPassword: data.shopifyApi.apiPassword,
                        siteUrl: data.shopifyApi.siteUrl
                    });
                    setIsShopifyEditMode(true);
                    setIsWordpressEditMode(true);
                } else {
                    setIsShopifyEditMode(false);
                    setIsWordpressEditMode(false);
                }
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data', life: 2000 });
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        setData: React.Dispatch<React.SetStateAction<ApiData>>
    ) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent, data: ApiData, setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL!}/wp-api`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            ); // Replace with your actual API endpoint
            if (response.status === 200) {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Registration successful!', life: 2000 });
                setIsEditMode(true);
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Registration failed!', life: 2000 });
        }
    };

    const handleEditModeToggle = async (setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>, isEditMode: boolean) => {
        if (isEditMode) {
            setIsEditMode(false);  // Change to "Refresh" mode
        } else {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const updateData = isShopifyEditMode ? shopifyData : wordpressData;
                const response = await axios.patch(
                    `${process.env.NEXT_PUBLIC_API_URL!}/wp-api`,
                    updateData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (response.status === 200) {
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Data updated successfully!', life: 2000 });
                    fetchData();  // Refresh data after successful update
                }
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update data', life: 2000 });
            }
        }
    };

    return (
        <div className="flex flex-col gap-6 mt-6">
            <Toast ref={toast} />
            <form onSubmit={(e) => handleSubmit(e, shopifyData, setIsShopifyEditMode)}>
                <p className="text-[14px] text-[#1A1F36] font-bold mb-3">ShopifyのAPIキー</p>
                <div className="flex flex-col gap-4 mt-4">
                    <input
                        type="text"
                        name="apiUsername"
                        value={shopifyData.apiUsername}
                        onChange={(e) => handleInputChange(e, setShopifyData)}
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input apiUsername"
                        disabled={isShopifyEditMode}
                    />
                    <input
                        type="password"
                        name="apiPassword"
                        value={shopifyData.apiPassword}
                        onChange={(e) => handleInputChange(e, setShopifyData)}
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input apiPassword"
                        disabled={isShopifyEditMode}
                    />
                    <input
                        type="text"
                        name="siteUrl"
                        value={shopifyData.siteUrl}
                        onChange={(e) => handleInputChange(e, setShopifyData)}
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="siteUrl"
                        disabled={isShopifyEditMode}
                    />
                    <div className="flex gap-4 sm:flex-row flex-col">
                        {isShopifyEditMode ? (
                            <button
                                className="text-[14px] rounded-md text-[#5469D4] bg-slate-100 w-full sm:w-[100px] h-[50px] hover:font-bold"
                                type="button"
                                onClick={() => handleEditModeToggle(setIsShopifyEditMode, isShopifyEditMode)}
                            >
                                更新する
                            </button>
                        ) : (
                            <button
                                className={`text-[14px] rounded-md text-[#5469D4] bg-slate-100 w-full sm:w-[100px] h-[50px] hover:font-bold ${!isShopifyValid && 'opacity-50 cursor-not-allowed'}`}
                                type="submit"
                                disabled={!isShopifyValid}
                            >
                                追加する
                            </button>
                        )}
                    </div>
                </div>


            </form>
            <form onSubmit={(e) => handleSubmit(e, wordpressData, setIsWordpressEditMode)}>
                <p className="text-[14px] text-[#1A1F36] mb-3 font-bold">WordPressのAPIキー</p>
                <div className="flex flex-col gap-4 mt-4">
                    <input
                        type="text"
                        name="apiUsername"
                        value={wordpressData.apiUsername}
                        onChange={(e) => handleInputChange(e, setWordpressData)}
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input apiUsername"
                        disabled={isWordpressEditMode}
                    />
                    <input
                        type="password"
                        name="apiPassword"
                        value={wordpressData.apiPassword}
                        onChange={(e) => handleInputChange(e, setWordpressData)}
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input apiPassword"
                        disabled={isWordpressEditMode}
                    />
                    <input
                        type="text"
                        name="siteUrl"
                        value={wordpressData.siteUrl}
                        onChange={(e) => handleInputChange(e, setWordpressData)}
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="siteUrl"
                        disabled={isWordpressEditMode}
                    />
                    <div className="flex gap-4 flex-col sm:flex-row">
                        {isWordpressEditMode ? (
                            <button
                                className="text-[14px] rounded-md text-[#5469D4] bg-slate-100 w-full sm:w-[100px] h-[50px] hover:font-bold"
                                type="button"
                                onClick={() => handleEditModeToggle(setIsWordpressEditMode, isWordpressEditMode)}
                            >
                                更新する
                            </button>
                        ) : (
                            <button
                                className={`text-[14px] rounded-md text-[#5469D4] bg-slate-100 w-full sm:w-[100px] h-[50px] hover:font-bold ${!isWordpressValid && 'opacity-50 cursor-not-allowed'}`}
                                type="submit"
                                disabled={!isWordpressValid}
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