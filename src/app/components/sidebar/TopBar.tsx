'use client'

import Progress from "./Progress";


const TopBar = () => {
    return (
        <nav className="fixed top-0 block w-full h-[100px] max-w-full  z-30 text-[#1A1F36] shadow-none transition-all py-1 bg-[url(/images/bg.png)] bg-cover">
            <div className="flex sm:flex-row flex-col sm:items-center justify-between">
                <p className="text-[14px] ml-4 mt-4"></p>
                <div className=" mr-16 mt-3 ml-6 w-[165px] sm:fixed  z-50 right-0 top-4">
                    <Progress/>
                </div>
            </div>
        </nav>
    )
}

export default TopBar;