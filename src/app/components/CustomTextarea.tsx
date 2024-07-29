import React, { useState, KeyboardEvent, useRef, useEffect, useMemo } from 'react';
import { IoMdClose } from "react-icons/io";
import Button from './Button';
import axios from 'axios';
interface Tag {
  id: string;
  text: string;
}

interface Keyword {
  text: string;
  volume: string;
  saved: number;
}

interface CustomTextareaProps {
  onKeywordsGenerated: (keywords: Keyword[]) => void;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({ onKeywordsGenerated }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

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

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axios.post<Keyword[]>(
         `${process.env.NEXT_PUBLIC_API_URL!}/keyword/generate`,
        {
          keywords: tags.map(tag => tag.text)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const newKeywords = response.data;
      setKeywords(newKeywords);
      onKeywordsGenerated(newKeywords);
    } catch (error) {
      console.error('Error generateing keywords:', error);
    } finally {
      setIsLoading(false);
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
      <div className="p-4 h-[150px] border rounded-xl bg-white">
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
          className="custom-class"
          onClick={handleSave}
          common
          label="生成する"
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default CustomTextarea;