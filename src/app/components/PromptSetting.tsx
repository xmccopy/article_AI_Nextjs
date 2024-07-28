'use client'

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';

interface Prompt {
    id: string;
    prompt: string;
    type: string;
    createdAt: string;
    updatedAt: string;
}

const PromptSetting = () => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const toast = useRef<Toast>(null);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL!}/prompt`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const promptsData = response.data?.allPrompt;
                setPrompts(promptsData);
            } catch (error) {
                console.error('Failed to fetch prompts:', error);
                // Handle error (e.g., show error message to user)
            }
        };

        fetchPrompts();
    }, []);

    const updatePrompt = async (id: string, newPrompt: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL!}/prompt/${id}`,
                { prompt: newPrompt },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Update the local state
            setPrompts(prevPrompts =>
                prevPrompts.map(p => p.id === id ? { ...p, prompt: newPrompt } : p)
            );

            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Login successful!', life: 2000 });
            }
            console.log(`Prompt updated successfully`);

        } catch (error) {
            console.error(`Failed to update prompt:`, error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'An error occurred during registration', life: 2000 });
        }
    };

    const getPromptByType = (type: string) => prompts.find(p => p.type === type) || { id: '', prompt: '' };

    return (
        <div className="flex flex-col gap-6 mt-6">
            <div className="flex items-end justify-center gap-10 sm:mr-40">
                <div className="flex items-center justify-center gap-4">
                    <input
                        type="radio"
                        name="model"
                        value="ChatGPT"
                        checked={selectedModel === 'ChatGPT'}
                        onChange={(e) => setSelectedModel(e.target.value)}
                    />
                    <p className="text-base font-bold">ChatGPT</p>
                </div>
                <div className="flex items-center justify-center gap-4">
                    <input
                        type="radio"
                        name="model"
                        value="Claude3.5"
                        checked={selectedModel === 'Claude3.5'}
                        onChange={(e) => setSelectedModel(e.target.value)}
                    />
                    <p className="text-base font-bold">Claude3.5</p>
                </div>
            </div>
            <Toast ref={toast} />
            {[
                { label: "Title prompt", type: "title" },
                { label: "Config prompt", type: "config" },
                { label: "Image prompt", type: "image" },
                { label: "Content prompt", type: "article" }
            ].map(({ label, type }) => {
                const { id, prompt } = getPromptByType(type);
                const textareaRef = useRef<HTMLTextAreaElement>(null);

                const adjustHeight = () => {
                    const textarea = textareaRef.current;
                    if (textarea) {
                        textarea.style.height = 'auto'; // Reset height
                        textarea.style.height = textarea.scrollHeight + 'px'; // Adjust height
                    }
                };

                useEffect(() => {
                    adjustHeight(); // Adjust height on mount and whenever the prompt changes

                    // Add event listener to adjust height on window resize
                    window.addEventListener('resize', adjustHeight);

                    // Cleanup event listener on unmount
                    return () => {
                        window.removeEventListener('resize', adjustHeight);
                    };
                }, [prompt]);

                return (
                    <div key={type}>
                        <p className="text-[14px] text-[#1A1F36] font-bold mb-3">{label}</p>
                        <div className="flex gap-4 mt-4">
                            <textarea
                                ref={textareaRef}
                                className="w-full resize-none overflow-hidden p-[12px] text-base border-2 rounded-lg"
                                placeholder="Input prompt"
                                value={prompt}
                                onChange={(e) => {
                                    setPrompts(prevPrompts =>
                                        prevPrompts.map(p => p.id === id ? { ...p, prompt: e.target.value } : p)
                                    );
                                    adjustHeight(); // Adjust height on input
                                }}
                                onInput={adjustHeight} // Adjust height on input
                            />
                            <button
                                onClick={() => updatePrompt(id, prompt)}
                                className="text-[14px] text-[#5469D4] min-w-max"
                                type="button"
                            >
                                更新する
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default PromptSetting;
