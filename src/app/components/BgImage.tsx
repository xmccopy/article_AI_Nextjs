'use client'

import Image from "next/image";

interface BgImageProps {
    imageUrl: string;
}

const BgImage: React.FC<BgImageProps> = ({
    imageUrl
}) => {
    {
        let url = `http://5.253.41.184:8000/downloads/${imageUrl.imageUrl}`;
        return (
            <div className="w-full h-[550px] relative">
                <Image
                    src={url ? url : '/iamges/register_bg.png'}
                    alt="image" 
                    layout="fill"
                    objectFit="cover"
                    className="z-10"
                />
            </div>
        )
    }
}

export default BgImage;