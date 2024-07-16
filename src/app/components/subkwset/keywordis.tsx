'use client'

interface KeyWordShowProps {
    label: string;
}

const KeyWordShow: React.FC<KeyWordShowProps> = ({
    label
}) => {

    return (
        <div className="text-[#3C4257]">
            <p className="text-[14px] mb-3 font-medium">メインキーワード</p>
            <div className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg">
                {label}
            </div>
        </div>
    )
}

export default KeyWordShow;