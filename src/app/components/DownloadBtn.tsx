'use client'

import { HiOutlineDownload } from "react-icons/hi";

interface DownloadBtnProps {
    onClick: () => void;
    disabled?: boolean;
}

const DownloadBtn: React.FC<DownloadBtnProps> = ({
    onClick,
    disabled
}) => {
    return (
        <div
            onClick={!disabled ? onClick : undefined}
            className={`bg-white px-[18px] py-[9px] rounded-md flex flex-row items-center justify-center gap-3 text-[14px] cursor-pointer hover:bg-gray-100 active:bg-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <HiOutlineDownload className="text-[#5469D4] font-bold" size={18}/>
            <p className="text-[#5469D4] font-bold">ダウンロード</p>
        </div>
    )
}

export default DownloadBtn;
