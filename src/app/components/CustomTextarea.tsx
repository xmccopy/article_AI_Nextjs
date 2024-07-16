import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import Button from './Button';
import axios from 'axios';

interface Tag {
    id: string;
    text: string;
}

interface CustomTextareaProps {
    onKeywordsGenerated: (keywords: string[]) => void;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({
    onKeywordsGenerated,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContent] = useState<string>('');
    const [tags, setTags] = useState<Tag[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [savedText, setSavedText] = useState<string>('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && content.trim()) {
            e.preventDefault();
            const newTag = { id: Date.now().toString(), text: content.trim() };
            setTags([...tags, newTag]);
            setContent('');
        }
    };


    const handleSave = async () => {
        setIsLoading(true);
        const tagsText = tags.map(tag => tag.text).join(',');
        const fullText = `"${tagsText}"`.trim();
        setSavedText(fullText);
    
        const token = localStorage.getItem('token');
        console.log("token", token);
    
        if (!token) {
            console.log('No token found in localStorage');
            setIsLoading(false);
            return;
        }
    
        try {
            const response = await axios.post(
                "http://5.253.41.184:8000/keyword/generate",
                { keyword: tagsText },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
    
            if (Array.isArray(response.data)) {
                onKeywordsGenerated(response.data);
            }
    
        } catch (error) {
            console.error('Error:', error);
            // You might want to handle different types of errors here
            // For example, checking error.response for status codes
        } finally {
            setIsLoading(false);
        }
        
        setTags([]);
        setContent('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const removeTag = (id: string) => {
        setTags(tags.filter(tag => tag.id !== id));
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [tags]);

    return (
        <>
            <div className="p-4 min-h-[150px] border rounded-xl bg-white">
                <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                        <span
                            key={tag.id}
                            onClick={() => removeTag(tag.id)}
                            className="flex gap-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-md items-center cursor-pointer"
                        >
                            {tag.text}
                            <IoMdClose size={15} />
                        </span>
                    ))}
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-grow outline-none tracking-tighter"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Input keyword and press Enter"
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <Button 
                    common
                    className='custom-class'
                    onClick={handleSave} 
                    label="生成する"
                    isLoading={isLoading}
                />
            </div>
        </>
    );
};

export default CustomTextarea;
