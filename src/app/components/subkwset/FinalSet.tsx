'use client'

interface FinalSetProps {
    keyword: string;
    subkeyword: SubKeyword[]; ///array..
    title: string;
}

interface SubKeyword {
    text: string;
    selected: boolean;
}

const FinalSet: React.FC<FinalSetProps> = ({
    keyword,
    subkeyword = [],
    title
}) => {
    return (
        <div className="bg-[#F5F8F8] p-4 flex flex-col gap-5 sm:w-[382px] w-full rounded-lg">
            <div className="flex flex-col gap-3 w-full">
                <p className="text-[14px]">キーワード</p>
                <div className="w-full bg-white sm:w-[350px] min-h-[50px] p-[12px] text-base border-2 rounded-lg">
                    {keyword ? (
                        keyword
                    ) : (
                        <div className="text-gray-500">キーワードがありません。</div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
                <p className="text-[14px]">サブキーワード</p>
                <div className="w-full bg-white sm:w-[350px] min-h-[50px] p-[12px] text-base border-2 rounded-lg">
                    {subkeyword.length > 0 ? (
                        subkeyword.filter(sk => sk.selected).map((sk, index) => (
                            <span key={index} className="mr-2">
                                {sk.text},
                            </span>
                        ))
                    ) : (
                        <div className="text-gray-500">サブキーワードがありません。</div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
                <p className="text-[14px]">記事タイトル</p>
                <div className="w-full bg-white sm:w-[350px] min-h-[50px] p-[12px] text-base border-2 rounded-lg">
                    {title ? (
                        title
                    ) : (
                        <div className="text-gray-500">タイトルがありません。</div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
                <p className="text-[14px]">カテゴリ</p>
                <input type="text" className="w-full sm:w-[350px] h-[50px] p-[12px] text-base border-2 rounded-lg" placeholder="カテゴリーを入力してください" />
            </div>
        </div>
    )
}

export default FinalSet;