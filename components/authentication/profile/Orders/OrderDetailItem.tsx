import ArrowTopLeft from "@/components/icons/ArrowTopLeft";
import CheckIcon from "@/components/icons/CheckIcon";
import CloseSimple from "@/components/icons/CloseSimple";
import HourGlass from "@/components/icons/HourGlass";
import ModalPortal from "@/components/shared/layout/ModalPortal";
import { numberWithCommas, toPersianDigits } from "@/helpers";
import { getCurrencyLabelFa } from "@/helpers/currencyLabel";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { OrderDetailItemType } from "@/types/commerce";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
    itemData : OrderDetailItemType;
    orderId: number;
}

const OrderDetailItem : React.FC<Props> = props => {
    
    const {itemData: data} = props;

    const {isDesktop} = useIsDesktop();

    const [open, setOpen] = useState<boolean>(false);
    const [slideIn, setSlideIn] = useState<boolean>(false);

    useEffect(() => {
        if (open) {
            setSlideIn(true);
        }
    }, [open]);

    useEffect(() => {
        if (!slideIn) {
            setTimeout(() => { setOpen(false) }, 300)
        }
    }, [slideIn]);

    const subtitleItems : string[] = [];
    if(data.variant?.description){
        subtitleItems.push(data.variant.description);
    }
    if(data.variant?.attributes?.length){
        subtitleItems.push(...data.variant.attributes);
    }

    let modalWrapperClass = `bg-white dark:bg-[#192a39] text-neutral-800 dark:text-white rounded-t-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full safePadding-b transition-all left-0 right-0 ${slideIn ? "bottom-0" : "-bottom-[80vh]"}`

    if (isDesktop) {
        modalWrapperClass = `bg-white dark:bg-[#192a39] text-neutral-800 dark:text-white rounded-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full max-w-md transition-all top-1/2 right-1/2 translate-x-1/2 ${slideIn ? "-translate-y-1/2 opacity-100" : "translate-y-0 opacity-0"}`
    }

    return(
        <>
            <div className="mb-7">
                <div className="flex gap-3 mb-5">
                    <Image src={data.variant?.filePath || data.product?.filePath || "/images/default-game.png"} alt={data.product.name} className="aspect-square shrink-0 grow-0 w-1/4 max-w-24 rounded-2xl" width={96} height={96} />
                    <div className="grow text-xs">
                        <h5 className="text-sm font-semibold mb-2"> {data.product.name} </h5>
                        {!!subtitleItems.length && <div className="mb-2"> {subtitleItems.join(", ")} </div>}
                        <div className="flex justify-between items-center mb-2">
                            <div> مبلغ : <b className="font-semibold"> {numberWithCommas(data.unitPrice)} {getCurrencyLabelFa(data.currencyType)} </b> </div>
                            <div className="text-red-400"> <b className="font-semibold"> {numberWithCommas(data.unitDiscountAmount)} {getCurrencyLabelFa(data.currencyType)} </b> تخفیف </div>
                        </div>
                        <div> تعداد : <b> {toPersianDigits(data.quantity.toString())} عدد </b></div>
                    </div>
                </div>

                <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-sm flex items-center gap-1"> 

                            <HourGlass className="w-4.5 h-4.5 fill-none stroke-current" /> 
                            {data.currentTimeline?.stepStr}

                        </div>
                        <button
                            type="button"
                            className="outline-none flex gap-2 items-center text-xs"
                            onClick={()=>{setOpen(true)}}
                        >
                            مراحل انجام
                            <ArrowTopLeft className="w-3 h-3 fill-current" />
                        </button>
                    </div>

                    <div className="h-3 w-full rounded-full bg-[#eaeaea] dark:bg-gradient-dark-green relative">
                        <span className="bg-gradient-green block absolute h-full rounded-full right-0 top-0" style={{width:(data.currentTimeline?.progressPercent || 0) + "%"}} />
                    </div>

                    {data.currentTimeline?.nextStepStr ? <p className="text-xs mt-2.5"> 
                        مرحله بعد:  {data.currentTimeline.nextStepStr}
                    </p> : null }


                </div>

                {!!props.itemData.allowNewLoginSubmission && <Link
                    href={`/profile/orders/${props.orderId}/${data.id}`}
                    className="block text-center bg-gradient-violet text-white rounded-full px-3 w-full text-sm py-3"
                >
                    ثبت اطلاعات اکانت
                </Link>}
            </div>

            <ModalPortal
                show={open}
                selector='modal_portal'
            >
                <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen">

                    <div className="relative w-full h-screen">

                        <div className="bg-[#cccccc]/50 dark:bg-black/50 backdrop-blur-sm absolute top-0 left-0 right-0 bottom-0" onClick={() => { setSlideIn(false) }} />

                        <div className={modalWrapperClass}>                            
                            <div className="flex flex-col gap-6 items-center p-5 py-7">

                                <div className="self-stretch flex items-center justify-between">
                                    <label className="font-semibold text-sm"> وضعیت سفارش </label>
                                    <button
                                        type="button"
                                        onClick={()=>{setSlideIn(false)}}
                                    >
                                        <CloseSimple className="w-7 h-7 fill-current" />
                                    </button>
                                </div>

                                <div className="self-stretch flex gap-3 items-center">
                                    <Image src={data.variant?.filePath || data.product?.filePath || "/images/default-game.png"} alt={data.product.name} className="aspect-square shrink-0 grow-0 w-1/4 max-w-20 rounded-2xl" width={96} height={96} />
                                    <h6 className="text-sm font-semibold"> {data.product.name} </h6>
                                </div>
                                <div className="flex flex-col gap-5 items-stretch self-stretch">
                                    <div className="bg-[#eeeeee] dark:bg-[#011425] p-5 rounded-2xl self-stretch">
                                        {data.timeLines?.map((t, i)=>(
                                            <div key={t.id} className="text-sm flex gap-4">
                                                <div className="flex flex-col gap-2 items-center mb-2">
                                                    {t.isDone ? (
                                                        <div className="w-7 h-7 rounded-full bg-gradient-violet flex justify-center items-center">
                                                            <CheckIcon className="w-5 h-5 fill-white" />
                                                        </div>
                                                    ):(
                                                        <div className="w-7 h-7 text-neutral-800 pt-1 rounded-full bg-gradient-gray flex justify-center items-center">
                                                            {toPersianDigits((i+1).toString())}
                                                        </div>
                                                    )}
                                                    { i < data.timeLines!.length-1 ? <div className="w-[2px] grow bg-neutral-400 dark:bg-white/50" /> : null}
                                                </div>
                                                <div className="pb-5">
                                                    <b className="font-semibold block my-1">
                                                        {t.stepStr}
                                                    </b>
                                                    <p className="text-xs">
                                                        {t.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </ModalPortal>

        </>
    )
}

export default OrderDetailItem;
