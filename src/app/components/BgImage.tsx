'use client'

import Image from "next/image";

interface BgImageProps {
    imageUrl: string;
}

const BgImage: React.FC<BgImageProps> = ({
    imageUrl
}) => {
    {
        let url = `http://62.3.6.59:8000/downloads/${imageUrl.imageUrl}`;
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