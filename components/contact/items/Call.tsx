import ModalPortal from "@/components/shared/layout/ModalPortal";
import { isWithinWorkingHours } from "@/helpers";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
    icon?: string;
    label?: string;
    description?: string;
    InnerData? : {
        Name?: string;
        Value?: string;
        Description?: string;
    }
}

const Call : React.FC<Props> = props => {

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

    const isActive = isWithinWorkingHours();

    const callLink = "tel:+982182800104";
    // let callLink = "";
    // if(props.InnerData?.Value?.startsWith('0')){
    //     callLink = "tel:+98"+ (props.InnerData.Value.slice(1));
    // }

    let modalWrapperClass = `bg-white dark:bg-[#192a39] text-neutral-800 dark:text-white rounded-t-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full safePadding-b transition-all left-0 right-0 ${slideIn ? "bottom-0" : "-bottom-[80vh]"}`

    if (isDesktop) {
        modalWrapperClass = `bg-white dark:bg-[#192a39] text-neutral-800 dark:text-white rounded-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full max-w-lg transition-all top-1/2 right-1/2 translate-x-1/2 ${slideIn ? "-translate-y-1/2 opacity-100" : "translate-y-0 opacity-0"}`
    }

    return(
        <>
        <button
            onClick={()=>{if(isActive) setOpen(true)}}
            type="button"
            className={`text-right dark:text-white min-h-20 w-full mb-3 py-4 px-5 rounded-xl ${isActive?"bg-gradient-to-t from-[#eeeeee] to-[#e1e1e1] dark:from-[#01212e] dark:to-[#102c33]":"text-neutral-400 bg-[#efefef] dark:bg-[#1a1e2e]"}`}
        >
            <div className="mb-4 flex justify-between gap-4 items-center font-semibold text-sm dark:text-white">
                <div className="flex gap-4 items-center">
                    {!!props.icon && <Image 
                        src={props.icon}
                        alt={props.label||""}
                        width={36}
                        height={36}
                        className="w-9 h-9"
                    />}
                    
                    {props.label}
                </div>

                {isActive ? (
                <div className="py-2.5 px-5 rounded-full bg-gradient-to-t from-[#028d7e] to-[#99feac] text-white text-xs">
                    فعال
                </div>
                ):(
                <div className="py-2.5 px-5 rounded-full bg-gradient-to-tr from-[#df415a] to-[#ff9a90] text-white text-xs">
                    غیر فعال
                </div>
                )}
            </div>
            {props.description && <p className="text-xs w-full">{props.description}</p>}

        </button>
        
        <ModalPortal
            show={open}
            selector='modal_portal'
        >
            <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen">

                <div className="relative w-full h-screen">

                    <div className="bg-[#cccccc]/50 dark:bg-black/50 backdrop-blur-sm absolute top-0 left-0 right-0 bottom-0" onClick={() => { setSlideIn(false) }} />
                    <div className={modalWrapperClass}>
                        <div className="flex flex-col gap-6 items-center p-5 py-10 bg-white dark:bg-[#192a39] text-[#666666] dark:text-white rounded-2xl">

                            <div className="bg-[#eeeeee] dark:bg-[#011425] p-3 rounded-full" >
                                <Image 
                                    src="/images/icons/callSupportIcon.svg"
                                    alt="تماس تلفنی"
                                    width={48}
                                    height={48}
                                    className="w-12 h-12"
                                />
                            </div>
                            
                            <strong className="text-2xl font-semibold" dir="ltr"> 
                                {/* {props.InnerData?.Value}  */}
                                021 82800104
                            </strong>

                            <p className="text-xs"> {props.InnerData?.Description} </p>                        
                            
                            {!!props.InnerData?.Value && (
                                <Link
                                    prefetch={false}
                                    className="block my-2 p-4 w-full text-center text-white bg-[#a93aff] rounded-full"
                                    href={callLink}
                                >
                                    {props.InnerData?.Name} 
                                </Link>
                            )}

                            <button
                                type="button"
                                onClick={()=>{setSlideIn(false)}}
                                className="block p-4 w-full text-center rounded-full bg-[#dddddd] dark:bg-[#011425]"
                            >
                                انصراف
                            </button>

                        </div>
                    </div>
                </div>

            </div>
        </ModalPortal>

        </>
    )
}

export default Call;