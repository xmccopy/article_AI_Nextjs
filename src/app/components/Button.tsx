'use client'

interface ButtonProps {
    label: string;
    roundBtn?: boolean;
    outline?: boolean;
    signInOutBtn?: boolean;
    disabled?: boolean;
    common?: boolean;
    onClick: (e: React.MouseEvent) => void;
    isLoading?: boolean;
    className: string;
    titleLimit?: number;
}

const Button: React.FC<ButtonProps> = ({
    label,
    common,
    roundBtn,
    outline,
    signInOutBtn,
    disabled,
    onClick,
    isLoading,
    className = "",
    titleLimit
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                py-[12px]
                text-[14px]
                leading-[14px]
                h-fit
                font-bold
                transition-colors
                ${common ? 'px-[18px] text-white' : ''}
                ${outline ? 'px-[18px] bg-white text-center text-[#5469D4]' : 'bg-[#5469D4]'}
                ${signInOutBtn ? 'w-full bg-[#5469D4] text-center text-white' : ''}
                ${roundBtn ? 'bg-white rounded-full px-[24px] py-[8px] text-gray-900' : 'rounded-md'}
                ${disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : roundBtn
                        ? 'cursor-not-allowed'
                        : 'hover:bg-[#5469D4]/80 active:bg-[#5469D4]/50'
                }
                ${isLoading ? 'cursor-not-allowed opacity-50' : ''}
                ${className}
            `}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    生成中...
                </div>
            ) : (
                <span className="flex items-center justify-center">
                    {label}
                    {titleLimit !== undefined && (
                        <span className={`ml-2 text-xs transition-all ${titleLimit <= 1 ? 'text-red-500' : ''}`}>
                            （{titleLimit}/3）
                        </span>
                    )}
                </span>
            )}
        </button>
    )
}

export default Button;