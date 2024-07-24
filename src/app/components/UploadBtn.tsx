'use client'

import { useRef } from 'react';
import { HiOutlineUpload } from "react-icons/hi";

const UploadBtn: React.FC<{ onFileSelect: (file: File) => void }> = ({ onFileSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div onClick={handleClick} className="bg-white px-[18px] py-[9px] rounded-md flex flex-row items-center justify-center gap-3 text-[14px] cursor-pointer hover:bg-gray-100 active:bg-white">
            <HiOutlineUpload className="text-[#5469D4] font-bold" size={18} />
            <p className="text-[#5469D4] font-bold">アップロード</p>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default UploadBtn;
