'use client'

interface SubKwSettingProps {
    label: string;
    selected: boolean;
    onChange: () => void;
}

const SubKwSetting: React.FC<SubKwSettingProps> = ({
    label,
    selected,
    onChange
}) => {
    return (
        <div className="flex flex-row gap-2">
            <input 
                type="checkbox" 
                checked={selected}
                onChange={onChange}
            />
            <p className="text-base w-fit">{label}</p>
        </div>
    )
}

export default SubKwSetting;