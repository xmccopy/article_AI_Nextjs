'use client'

import Image from "next/image"

interface AvatarProps {
    imageUrl: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({
    imageUrl
}) => {
    const placeholderImage = "/images/placeholder.jpg";

    return (
        <Image
            className="rounded-full"
            height={48}
            width={48}
            alt="Avatar"
            src={imageUrl || placeholderImage}
        />
    )
}

export default Avatar;
