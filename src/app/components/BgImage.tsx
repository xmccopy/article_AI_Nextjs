'use client'

import Image from "next/image";

// interface BgImageProps {
//     imageUrl: string;
// }

const BgImage = () => {
    {
        return (
            <div className="w-full h-[400px] relative">
                <Image
                    src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-QsSOFwOq6DVTftDVj1x8DU1R/user-phQgsYiB7U1O6AM6IuBYTiOd/img-b57QdiBGMYbzqp426kBNKkWw.png?st=2024-07-20T11%3A23%3A57Z&se=2024-07-20T13%3A23%3A57Z&sp=r&sv=2023-11-03&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-07-19T23%3A25%3A23Z&ske=2024-07-20T23%3A25%3A23Z&sks=b&skv=2023-11-03&sig=CQdbp08cn/ZTPcisx7knJ2yxg9XAOsRgBIKfx6kHI5Q%3D"
                    alt="image" 
                    layout="fill"
                    objectFit="cover"
                />
            </div>
        )
    }
}

export default BgImage;