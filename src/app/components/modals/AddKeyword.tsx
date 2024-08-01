'use client'

import { useState } from "react";
import Button from "../Button";
import axios from "axios";

interface AddKeywordProps {
    show: boolean;
    onConfirm: (keyword: string) => void;
    onCancel: () => void;
    isLoadiing?: boolean;
}

const AddKeyword: React.FC<AddKeywordProps> = ({
    show,
    onConfirm,
    onCancel,
    isLoadiing
}) => {
    const [newKeywords, setNewKeyword] = useState<string>("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewKeyword(event.target.value);
    };


    const handleGenerate = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL!}/keyword/create-one`,
                { keyword: newKeywords },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            onConfirm(newKeywords); // Pass the new keyword string to the parent
            setNewKeyword(""); // Clear the input field
        } catch (error) {
            console.error('Failed to create keyword:', error);
        }
    };

    if (!show) return null;

    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" aria-hidden="true"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-scroll scrollbar-thin">
                <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-gray-100 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="flex flex-col gap-4 items-center justify-center px-4 py-6 sm:p-6 sm:pb-4">
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <div className="mt-2">
                                    <p className="text-base text-[#1A1F36] font-bold text-center">キーワードをご入力ください。</p>
                                </div>
                            </div>
                            <input
                                type="text"
                                name="apiUsername"
                                value={newKeywords}
                                onChange={handleInputChange}
                                className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                                placeholder="Input Keyword"
                            />
                        </div>
                        <div className="flex justify-center gap-4 px-4 pb-6 sm:flex sm:px-6">
                            <Button
                                className="custom-class"
                                onClick={onCancel}
                                outline
                                label="キャンセル"
                                isLoading={isLoadiing}
                            // disabled={}
                            />
                            <Button
                                className="custom-class"
                                onClick={handleGenerate}
                                common
                                label="生成する"
                                isLoading={isLoadiing}
                            // disabled={}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AddKeyword;