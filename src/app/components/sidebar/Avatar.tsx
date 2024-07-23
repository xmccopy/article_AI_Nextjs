'use client'

import Image from "next/image"

interface AvatarProps {
    imageUrl: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({
    imageUrl
}) => {
    return (
        <Image
            className="rounded-full"
            height="48"
            width="48"
            alt="Avatar"
            src={imageUrl ? imageUrl : "/images/placeholder.jpg"}
        />
    )
}

export default Avatar;