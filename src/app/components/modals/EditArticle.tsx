'use client'

import Button from "../Button";

interface EditArticleProps {
    show: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    isLoadiing?: boolean;
}

const EditArticle: React.FC<EditArticleProps> = ({
    show,
    onConfirm,
    onCancel,
    isLoadiing
}) => {
    if (!show) return null;
    
    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" aria-hidden="true"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-scroll scrollbar-thin">
                <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-gray-100 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="px-4 py-6 sm:p-6 sm:pb-4">
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <div className="mt-2">
                                    <p className="text-base text-[#1A1F36] font-bold text-center">記事を編集しますか？</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 px-4 pb-6 sm:flex sm:px-6">
                            <Button
                                className="custom-class"
                                onClick={onCancel}
                                outline
                                label="キャンセル"
                                isLoading={isLoadiing}
                            // disabled={}
                            />
                            <Button
                                className="custom-class"
                                onClick={onConfirm}
                                common
                                label="編集する"
                                isLoading={isLoadiing}
                            // disabled={}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default EditArticle;