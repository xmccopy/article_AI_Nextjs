const ApiSetting = () => {
    return (
        <div className="flex flex-col gap-6 mt-6">
            <form onSubmit={() => {}}>
                <p className="text-[14px] text-[#1A1F36] font-bold mb-3">ShopifyのAPIキー</p>
                <div className="flex gap-4 mt-4" >
                    <input
                        type="text"
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input Username"
                    />
                    <input
                        type="password"
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input password"
                    />
                    <input
                        type="text"
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="WordPress API Key"
                    />
                    <button className="text-[14px] text-[#5469D4] min-w-max" type="submit">追加する</button>
                </div>
            </form>
            <form onSubmit={() => {}}>
                <p className="text-[14px] text-[#1A1F36] mb-3 font-bold">WordPressのAPIキー</p>
                <div className="flex gap-4 mt-4" >
                    <input
                        type="text"
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input Username"
                    />
                    <input
                        type="password"
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Input password"
                    />
                    <input
                        type="text"
                        className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg"
                        placeholder="Shopify API Key"
                    />
                    <button className="text-[14px] text-[#5469D4] min-w-max" type="submit">追加する</button>
                </div >
            </form>
        </div>
    )
}

export default ApiSetting;