interface GptTitleProps {
    label: string;
    onTitleClick: () => void;
}

const GptTitle: React.FC<GptTitleProps> = ({ label, onTitleClick }) => {
    return (
        <div 
            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
            onClick={onTitleClick}
        >
            {label}
        </div>
    );
};

export default GptTitle;