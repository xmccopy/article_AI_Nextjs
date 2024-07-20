'use client'

import React from 'react';
import { useAuth } from './AuthContext';

const Progress = () => {
    const { user } = useAuth();

    return (
        <div className='flex flex-col gap-1'>
            <p className='text-[14px]'>残クレジット：{user?.credits}</p>
            <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-600">
                <div className="h-3 bg-[#628CF8]" style={{ width: "45%" }}></div>
            </div>
        </div>
    );
}

export default Progress;