'use client'

import Link from "next/link";
import { useState, MouseEvent, FormEvent, useRef } from "react";
import { PiEyeThin, PiEyeSlashThin } from "react-icons/pi";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from "../sidebar/AuthContext";
import Image from "next/image";
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
interface RegisterResponse {
    user: {
        id: string;
        email: string;
        username: string;
        company: string;
        credits: number;
    };
    token: string;
}

const RegisterModal = () => {
    const { setUser } = useAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [company, setCompany] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toast = useRef<Toast>(null);

    // const apiService = new ApiService(process.env.NEXT_PUBLIC_API_URL || 'http://192.168.136.127:8000')

    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        setShowPassword(true);
    };
    
    const handleGoogleLogin = async () => {
        setIsLoading(true);
        router.push(`${process.env.NEXT_PUBLIC_API_URL!}/auth/google`)
    };

    const handleMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        setShowPassword(false);
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post<RegisterResponse>(
                `${process.env.NEXT_PUBLIC_API_URL!}/auth/register`,
                {
                    username,
                    company,
                    email,
                    password,
                    // rememberMe,
                }
            );

            setUser({
                id: response.data?.user?.id || '',
                username: response.data?.user?.username || '',
                email: response.data?.user?.email || '',
                company: response.data?.user?.company || '',
                credits: response.data?.user?.credits
            });

            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Registration successful!', life: 2000 });

            setTimeout(() => {
                router.push('/login')
            }, 1500)
        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.message || 'An error occurred during registration');
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data.message || 'An error occurred during registration', life: 3000 });
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <Toast ref={toast}/>
            <div className="sm:w-[520px] h-full p-8 rounded-[16px]  bg-white">
                <h2 className="text-[#1A1F36] text-left text-xl font-bold">新規登録</h2>
                <form className="mt-4 text-[#1A1F36] space-y-4 " onSubmit={handleSubmit}>
                    <div>
                        <label className="text-[14px] mb-2 block font-bold">会社名：</label>
                        <div className="relative flex items-center">
                            <input
                                name="company"
                                type="text"
                                required
                                className="w-full bg-[#F8F9F9] text-sm border border-[#D9DCE1] px-4 py-3 rounded-md outline-blue-600"
                                placeholder="company name"
                                value={company}
                                onChange={(e) => (
                                    setError(null),
                                    setCompany(e.target.value)
                                )}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[14px] mb-2 block font-bold">担当者名：</label>
                        <div className="relative flex items-center">
                            <input
                                name="username"
                                type="text"
                                required
                                className="w-full bg-[#F8F9F9] text-sm border border-[#D9DCE1] px-4 py-3 rounded-md outline-blue-600"
                                placeholder="User Name"
                                value={username}
                                onChange={(e) => (
                                    setError(null),
                                    setUsername(e.target.value)
                                )}
                            />
                        </div>
                    </div>
                    <div>
                        <label className=" text-[14px] mb-2 block font-bold">メアド：</label>
                        <div className="relative flex items-center">
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full bg-[#F8F9F9] text-sm border border-[#D9DCE1] px-4 py-3 rounded-md outline-blue-600"
                                placeholder="example@example.com"
                                value={email}
                                onChange={(e) => (
                                    setError(null),
                                    setEmail(e.target.value)
                                )}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex text-[14px] items-center justify-between">
                            <label className=" text-sm mb-2 block font-bold">パスワード：</label>
                        </div>
                        <div className="relative flex items-center">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-[#F8F9F9] text-sm border border-[#D9DCE1] px-4 py-3 rounded-md outline-blue-600"
                                placeholder="password"
                            />
                            <button
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                {showPassword ? <PiEyeSlashThin className="w-4 h-4 absolute right-4 top-4 opacity-40" /> : <PiEyeThin className="w-4 h-4 absolute right-4 opacity-40 top-4" />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <p className=" text-[14px] !mt-8 text-left">利用規約、プライバシーポリシーに同意して</p>
                    <div className="">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full font-bold py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-[#628CF8] hover:bg-[#9cb6f8] active:bg-[#628CF8] focus:outline-none"
                        >
                            {isLoading ? "'処理中..." : "登録する"}
                        </button>
                    </div>
                </form>
                <button onClick={handleGoogleLogin} className="w-full py-[7px] px-6 border-2 border-gray-300 rounded-lg transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100 mt-4">
                    <div className="relative flex items-center justify-center">
                        <Image src="https://tailus.io/sources/blocks/social/preview/images/google.svg" width={20} height={20} className="absolute left-0 w-5" alt="google logo" />
                        <span className="block w-max font-semibold tracking-wide text-gray-700 text-[14px] transition duration-300 group-hover:text-blue-600">Google で続ける</span>
                    </div>
                </button>
                <p className=" text-[14px] !mt-4 text-left underline">
                    <Link href="./login" className="text-[#628CF8] hover:underline ml-1 whitespace-nowrap">
                        ログインはこちら
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default RegisterModal;