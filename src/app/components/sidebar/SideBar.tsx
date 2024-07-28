'use client'

import SideBtn from "../SideBtn";
import { CiPen, CiSettings } from "react-icons/ci";
import { AiOutlineSave } from "react-icons/ai";
import { HiOutlineCommandLine } from "react-icons/hi2";
import { VscListUnordered } from "react-icons/vsc";
import { FaCrown } from "react-icons/fa6";
import Avatar from "./Avatar";
import Progress from "./Progress";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "./AuthContext";
import { RiLogoutBoxRLine } from "react-icons/ri";
import Button from "../Button";

interface SideBarProps {
    showSidebar: boolean;
    onClose: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ showSidebar, onClose }) => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [activeButton, setActiveButton] = useState<string>('');

    const paymentPlan = () => {
        router.push('/payment')
    }

    useEffect(() => {
        if (pathname === '/kwgenerate') setActiveButton('kwgenerate');
        else if (pathname === '/savedkw') setActiveButton('savedkw');
        else if (pathname === '/setting') setActiveButton('setting');
        else if (pathname === '/savedarticle') setActiveButton('savedarticle');
        else if (pathname === '/apiconnect') setActiveButton('apiconnect');
        else if (pathname === '/prompt') setActiveButton('prompt');
        else setActiveButton('')
    }, [pathname])

    const handleNavigation = (path: string, buttonId: string) => {
        router.push(path);
        setActiveButton(buttonId);
        onClose();
    }
    return (
        <>
            {showSidebar && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden"
                    onClick={onClose}
                ></div>
            )}

            <aside className={`flex top-0 left-0 flex-col justify-between fixed z-40 h-full w-[300px] transition-transform duration-300 bg-[url(/images/bg.png)] bg-cover 
                              ${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
                              xl:translate-x-0 xl:bg-opacity-0`}>
                <div>
                    <div className="relative">
                        <a className="flex items-center gap-4 py-6 px-8" href="#/">
                            <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-[#1A1F36]">Logo</h6>
                        </a>
                    </div>
                    <div className="m-4">
                        <ul className="flex flex-col mb-4 gap-1">
                            <li className="mx-3.5 mb-4">
                                <p className="block antialiased font-sans text-[16px] leading-normal text-[#1A1F36] font-black uppercase opacity-75">キーワード</p>
                            </li>
                            <li>
                                <SideBtn
                                    icon={<CiPen size={24} />}
                                    onClick={() => handleNavigation('/kwgenerate', 'kwgenerate')}
                                    label="キーワード生成"
                                    isActive={activeButton === 'kwgenerate'}
                                />
                            </li>
                            <li>
                                <SideBtn
                                    icon={<AiOutlineSave size={24} />}
                                    onClick={() => handleNavigation('/savedkw', 'savedkw')}
                                    isActive={activeButton === 'savedkw'}
                                    label="保存キーワード"
                                />
                            </li>
                        </ul>
                        <ul className="flex flex-col mb-4 gap-1">
                            <li className="mx-3.5 mb-4">
                                <p className="block antialiased font-sans text-[16px] leading-normal text-[#1A1F36] font-black uppercase opacity-75">記事</p>
                            </li>
                            <li>
                                <SideBtn
                                    icon={<HiOutlineCommandLine size={24} />}
                                    onClick={() => handleNavigation('/setting', 'setting')}
                                    isActive={activeButton === 'setting'}
                                    label="記事生成"
                                />
                            </li>
                            <li>
                                <SideBtn
                                    icon={<VscListUnordered size={24} />}
                                    onClick={() => handleNavigation('/savedarticle', 'savedarticle')}
                                    isActive={activeButton === 'savedarticle'}
                                    label="保存した記事"
                                />
                            </li>
                        </ul>
                        <ul className="flex flex-col mb-4 gap-1">
                            <li className="mx-3.5 mb-4">
                                <p className="block antialiased font-sans text-[16px] leading-normal text-[#1A1F36] font-black uppercase opacity-75">設定</p>
                            </li>
                            <li>
                                <a className="" href="#">
                                    <SideBtn
                                        icon={<CiSettings size={24} />}
                                        onClick={() => handleNavigation('/apiconnect', 'apiconnect')}
                                        isActive={activeButton === 'apiconnect'}
                                        label="API連携"
                                    />
                                </a>
                            </li>
                            <li>
                                <a className="" href="#">
                                    <SideBtn
                                        icon={<CiSettings size={24} />}
                                        onClick={() => handleNavigation('/prompt', 'prompt')}
                                        isActive={activeButton === 'prompt'}
                                        label="Prompt"
                                    />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col pl-8 gap-4 mb-6">
                        <div className="xl:p-4 xl:mx-0 p-4 mx-2 bg-white rounded-[12px] flex flex-col gap-6">
                            <p className="text-base font-bold">スタータープラン</p>
                            <Progress />
                            <Button
                                className="custom-class"
                                onClick={paymentPlan}
                                common
                                disabled={false}
                                isLoading={false}
                                label="アップグレード"
                                icon={FaCrown}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <Avatar imageUrl={user?.image}/>
                                <div className="flex flex-col items-center justify-between">
                                    <p className="text-base">{user?.username}</p>
                                    <p className="text-[14px]">{user?.email}</p>
                                </div>
                            </div>
                            <RiLogoutBoxRLine
                                size={25}
                                className="opacity-60 cursor-pointer mr-1"
                                onClick={logout}
                            />
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default SideBar;