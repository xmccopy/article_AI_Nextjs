'use client'

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ApiService from '@/utils/ApiService'; // Adjust the import path as needed
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import SpinSetting from '@/app/components/Spin';

const Success = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isVerified, setIsVerified] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const apiURL = process.env.NEXT_PUBLIC_API_URL;

    const apiService = useMemo(() => new ApiService(apiURL!), []);

    const verifyPayment = useCallback(async (sessionId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                apiService.setToken(token);
            }

            const response = await apiService.verifyPayment(sessionId);

            if (response.success) {
                setVerificationStatus('success');
                setIsVerified(true);
                // Update user credits in your frontend state
                // For example: updateUserCredits(response.credits);
            } else {
                setVerificationStatus('error');
                setErrorMessage(response.message || 'Payment verification failed');
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            setVerificationStatus('error');
            setErrorMessage('An unexpected error occurred');
        }
    }, [apiService]);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        if (sessionId) {
            verifyPayment(sessionId);
        } else {
            setVerificationStatus('error');
            setErrorMessage('No session ID found');
        }
    }, [searchParams, verifyPayment]);

    if (verificationStatus === 'pending') {
        return <SpinSetting />;
    }

    if (verificationStatus === 'error') {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <IoCloseCircleSharp size={100} className='mb-8 text-[#00c805]' />
                <div className='text-center'>
                    <h1 className='text-4xl font-bold mb-8 text-[#1A1F36]'>支払いに失敗した！</h1>
                    <p className='mb-6 text-[#1A1F36] text-xl'>申し訳ございません。お支払いの処理にエラーが発生しました。<br />
                        別のお支払い方法でもう一度お試しください。</p>
                    <button
                        onClick={() => router.push('/payment')}
                        className='px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
                    >
                        <p className='text-base font-bold'>ホームページに戻る</p>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <FaCheckCircle size={100} className='mb-8 text-[#00c805]' />
            <div className='text-center'>
                <h1 className='text-4xl font-bold mb-8 text-[#1A1F36]'>お支払いが完了しました！</h1>
                <p className='mb-6 text-[#1A1F36] text-xl'>ご購入ありがとうございました。お取引は正常に完了いたしました。</p>
                <button
                    onClick={() => router.push('/kwgenerate')}
                    className='px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
                >
                    <p className='text-base font-bold'>ホームページに戻る</p>
                </button>
            </div>
        </div>
    );
}

export default Success;
