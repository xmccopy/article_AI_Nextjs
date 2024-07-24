'use client'

import Image from "next/image";

interface BgImageProps {
    imageUrl: string;
}

const BgImage: React.FC<BgImageProps> = ({
    imageUrl
}) => {
    {
        return (
            <div className="w-full h-[400px] relative">
                <Image
                    src={imageUrl ? imageUrl : '/iamges/register_bg.png'}
                    alt="image" 
                    layout="fill"
                    objectFit="cover"
                />
            </div>
        )
    }
}

export default BgImage;