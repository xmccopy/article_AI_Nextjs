'use client'

import Image from "next/image";

const BgImage = () => {{
    return (
        <div className="w-full h-[400px]">
            <Image src="./../images/bf.jpg" alt="image" className="w-full h-full object-fill"/>
        </div>
    )
}}

export default BgImage;