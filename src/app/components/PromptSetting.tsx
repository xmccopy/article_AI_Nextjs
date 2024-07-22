const PromptSetting = () => {
    return (
        <div className="flex flex-col gap-6 mt-6">
            <div>
                <p className="text-[14px] text-[#1A1F36] font-bold mb-3">Title prompt</p>
                <div className="flex gap-4 mt-4" >
                    <textarea
                        className="w-full sm:w-[350px] h-[80px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input prompt"
                    />
                    <button className="text-[14px] text-[#5469D4] min-w-max" type="submit">更新する</button>
                </div >
            </div>
            <div>
                <p className="text-[14px] text-[#1A1F36] mb-3 font-bold">Config prompt</p>
                <div className="flex gap-4 mt-4" >
                    <textarea
                        className="w-full sm:w-[350px] h-[80px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input prompt"
                    />
                    <button className="text-[14px] text-[#5469D4] min-w-max" type="submit">更新する</button>
                </div >
            </div>
            <div>
                <p className="text-[14px] text-[#1A1F36] mb-3 font-bold">Image prompt</p>
                <div className="flex gap-4 mt-4" >
                    <textarea
                        className="w-full sm:w-[350px] h-[80px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input prompt"
                    />
                    <button className="text-[14px] text-[#5469D4] min-w-max" type="submit">更新する</button>
                </div >
            </div>
            <div>
                <p className="text-[14px] text-[#1A1F36] mb-3 font-bold">Content prompt</p>
                <div className="flex gap-4 mt-4" >
                    <textarea
                        className="w-full sm:w-[350px] h-[80px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input prompt"
                    />
                    <button className="text-[14px] text-[#5469D4] min-w-max" type="submit">更新する</button>
                </div >
            </div>
        </div>
    )
}

export default PromptSetting;