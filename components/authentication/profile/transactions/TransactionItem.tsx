import CaretLeft from "@/components/icons/CaretLeft";
import CloseSimple from "@/components/icons/CloseSimple";
import ModalPortal from "@/components/shared/layout/ModalPortal";
import { numberWithCommas, toPersianDigits } from "@/helpers";
import { getCurrencyLabelFa } from "@/helpers/currencyLabel";
import { Transaction } from "@/types/payment";
import { useEffect, useState } from "react";

type Props = {
    transaction : Transaction; 
}
const TransactionItem: React.FC<Props> = props => {

    const {amount, type, typeStr, information, currencyType, creationDateStr, creationTimeStr} = props.transaction;

    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const [slideInDetail, setSlideInDetail] = useState<boolean>(false);

    useEffect(() => {
        if (openDetail) {
            setSlideInDetail(true);
        }
    }, [openDetail]);

    useEffect(() => {
        if (!slideInDetail) {
            setTimeout(() => { setOpenDetail(false) }, 300)
        }
    }, [slideInDetail]);
    
    return (
        <>
            <button onClick={()=>{setOpenDetail(true)}} className="text-right border-b border-neutral-300 dark:border-white/25 py-3 outline-none flex justify-between items-center w-full" >
                <div className="text-xs">
                    <div className="mb-2 font-semibold" >
                        {typeStr}
                    </div>
                    <span dir="ltr" className="text-neutral-500"> {toPersianDigits(creationDateStr||"")} - {toPersianDigits(creationTimeStr||"")} </span>
                </div>
                <div className="flex gap-2 items-center">
                    <div className={`font-semibold text-xs px-2 rounded whitespace-nowrap ${amount > 0 ? "text-[#2b8a3e] bg-[#d3f9d8] dark:bg-[#0c859921]" : "text-[#c92a2a] bg-red-100 dark:bg-[#ff2f2f1f]"}`}>                
                        <b dir="ltr" className="text-sm ml-2"> {amount > 0 ? "+" : "-"} {numberWithCommas(Math.abs(amount))} </b> {getCurrencyLabelFa(currencyType)} 
                    </div>
                    <CaretLeft className="inline-block w-4 h-4 mr-2 fill-neutral-500" />
                </div>
            </button>

            <ModalPortal
                show={openDetail}
                selector='modal_portal'
            >
                <div className="bg-black/50 backdrop-blur-sm fixed top-0 left-0 right-0 bottom-0" onClick={() => { setSlideInDetail(false) }} />

                <div className={`bg-white p-5 dark:bg-[#192a39] dark:text-white rounded-t-2xl safePadding-b max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full md:max-w-lg safePadding-b transition-all left-0 max-md:right-0 md:right-1/2 md:translate-x-1/2 ${slideInDetail ? "bottom-0" : "-bottom-[80vh]"}`}>
                    
                    <div className="flex justify-between mb-3 items-center">
                        <h5 className="font-bold">
                        جزییات تراکنش
                        </h5>
                        <button 
                            type="button" 
                            className="" 
                            onClick={() => { setSlideInDetail(false) }}
                        >
                            <CloseSimple  className="w-6 h-6 fill-neutral-500" />
                        </button>
                    </div>

                    <div className="text-sm flex gap-5 flex-wrap justify-between items-center py-3 border-b border-neutral-300 dark:border-white/25">
                        <label className="text-sm font-semibold"> نوع تراکنش </label>
                        <div className="text-xs"> {typeStr || type} </div>
                    </div>

                    <div className="text-sm flex gap-5 flex-wrap justify-between items-center py-3 border-b border-neutral-300 dark:border-white/25">
                        <label className="text-sm font-semibold"> تاریخ و ساعت تراکنش </label>
                        <div className="text-xs" dir="ltr"> {toPersianDigits(creationDateStr||"")} - {toPersianDigits(creationTimeStr||"")} </div>
                    </div>

                    <div className="text-sm flex gap-5 flex-wrap justify-between items-center py-3 border-b border-neutral-300 dark:border-white/25">
                        <label className="text-sm font-semibold"> مبلغ تراکنش </label>
                        <span className={`px-2 text-xs rounded ${amount > 0 ? "text-[#2b8a3e] bg-[#d3f9d8] dark:bg-[#0c859921]" : "text-[#c92a2a] bg-red-100 dark:bg-[#ff2f2f1f]"}`}> 
                           <b dir="ltr" className="text-sm ml-2"> {amount > 0 ? "+" : "-"} {numberWithCommas(Math.abs(amount))} </b> {getCurrencyLabelFa(currencyType)} 
                        </span>
                    </div>

                    {information && <div className="text-sm flex gap-5 flex-wrap justify-between items-center py-3 mb-3">
                        <label className="text-sm font-semibold"> توضیحات </label>
                        <div className="text-xs"> {information} </div>
                    </div>}



                </div>
            </ModalPortal>
        </>
    )
}

export default TransactionItem;