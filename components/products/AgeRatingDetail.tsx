import { ProductDetailData } from "@/types/commerce";
import Tab from "../shared/Tab"
import { TabItem } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import ModalPortal from "../shared/layout/ModalPortal";
import Link from "next/link";
import ArrowTopLeft2 from "../icons/ArrowTopLeft2";
import { useAppDispatch } from "@/hooks/use-store";
import { setBodyScrollPosition, setBodyScrollable } from "@/redux/stylesSlice";
import CloseSimple from "../icons/CloseSimple";
import { useIsDesktop } from "@/hooks/use-is-desktop";

type Props = {
    pegi?: ProductDetailData["pegi"];
    esrb?: ProductDetailData["esrb"];
}

const AgeRatingDetail: React.FC<Props> = props => {

    const { esrb, pegi } = props;

    const dispatch = useAppDispatch();

    const [activeItem, setActiveItem] = useState<string>("");

    const {isDesktop} = useIsDesktop();

    const tabItems: TabItem[] = [];

    useEffect(() => {
        if (activeItem) {
            setOpenDetails(true);
        }
    }, [activeItem])

    const [openDetails, setOpenDetails] = useState<boolean>(false);
    const [slideInDetails, setSlideInDetails] = useState<boolean>(false);

    useEffect(() => {
        if (openDetails) {
            setSlideInDetails(true);
            dispatch(setBodyScrollable(false));
            dispatch(setBodyScrollPosition(window?.pageYOffset || 0));
        } else {
            setActiveItem("");
            dispatch(setBodyScrollable(true));
        }
    }, [openDetails]);

    useEffect(() => {
        if (!slideInDetails) {
            setTimeout(() => { setOpenDetails(false) }, 300)
        }
    }, [slideInDetails])


    if (!esrb && !pegi) return null;

    if (pegi?.name) {
        tabItems.push({
            key: "pegi",
            label: "رده سنی اروپا (PEGI)",
            children: (
                <>
                    <div className="flex gap-3 my-4">
                        {pegi?.image && (
                            <Image
                                src={pegi.image}
                                alt={pegi.title || pegi.name || ""}
                                width={48}
                                height={48}
                                className="w-12 h-12 text-4xs"
                            />
                        )}
                        <div>
                            <b className="block font-semibold mb-2 text-sm">
                                {pegi.name}
                            </b>
                            <p className="text-xs">
                                {pegi.description}
                            </p>
                        </div>
                    </div>

                    {pegi.items?.map(item => (

                        <div
                            className="flex gap-3 my-4 border rounded-xl mb-5 border-neutral-300 dark:border-white/15 p-3"
                            key={item.keyword}
                        >
                            {item.image && (
                                <Image
                                    src={item.image}
                                    alt={item.name || ""}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 text-4xs"
                                />
                            )}
                            <div>
                                <b className="block font-semibold mb-4 text-sm">
                                    {item.name}
                                </b>
                                <p className="text-xs">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                    ))}

                </>
            )
        })
    }


    if (esrb) {
        tabItems.push({
            key: "esrb",
            label: "رده سنی آمریکا (ESRB)",
            children: (
                <>
                    <div className="flex gap-3 my-4">
                        {esrb?.image && (
                            <Image
                                src={esrb.image}
                                alt={esrb.title || esrb.name || ""}
                                width={48}
                                height={48}
                                className="w-12 h-12 text-4xs"
                            />
                        )}
                        <div>
                            <b className="block font-semibold mb-2 text-sm">
                                {esrb.name}
                            </b>
                            <p className="text-xs">
                                {esrb.description}
                            </p>
                        </div>
                    </div>

                    {esrb.items?.map(item => (

                        <div
                            className="flex gap-3 my-4 border rounded-xl mb-5 border-neutral-300 dark:border-white/15 p-3"
                            key={item.keyword}
                        >
                            {item.image && (
                                <Image
                                    src={item.image}
                                    alt={item.name || ""}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 text-4xs"
                                />
                            )}
                            <div>
                                <b className="block font-semibold mb-4 text-sm">
                                    {item.name}
                                </b>
                                <p className="text-xs">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                    ))}

                </>
            )
        })
    }



    let modalWrapperClass = `bg-white dark:bg-[#192a39] text-neutral-800 dark:text-white rounded-t-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full safePadding-b transition-all left-0 right-0 ${slideInDetails ? "bottom-0" : "-bottom-[80vh]"}`

    if (isDesktop) {
        modalWrapperClass = `bg-white dark:bg-[#192a39] text-neutral-800 dark:text-white rounded-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full max-w-2xl transition-all top-1/2 right-1/2 translate-x-1/2 ${slideInDetails ? "-translate-y-1/2 opacity-100" : "translate-y-0 opacity-0"}`
    }


    return (
        <>
            {!!(pegi || esrb) && (
                <div className={`lg:max-w-[600px] lg:mx-auto ${pegi && esrb ? "grid grid-cols-2" : ""}`}>

                    {!!pegi && (
                        <button
                            className={`block border border-neutral-300 dark:border-white/15 p-2.5 text-xs mt-5 ${esrb ? "rounded-r-xl border-l-0" : "rounded-xl"}`}
                            type="button"
                            onClick={() => { setActiveItem("pegi") }}
                        >
                            <div className="flex gap-1 justify-center">
                                {pegi?.image && (
                                    <Image
                                        src={pegi.image}
                                        alt={pegi.title || pegi.name || ""}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 text-4xs"
                                    />
                                )}
                                <div className="w-40">
                                    رده سنی اروپا (PEGI)
                                    <b className="block font-semibold mt-2 text-xs">
                                        {pegi.name}
                                    </b>
                                </div>
                            </div>
                        </button>
                    )}

                    {!!esrb && (
                        <button
                            className={`block border border-neutral-300 dark:border-white/15 p-2.5 text-xs mt-5 ${pegi ? "rounded-l-xl" : "rounded-xl"}`}
                            type="button"
                            onClick={() => { setActiveItem("esrb") }}
                        >
                            <div className="flex gap-1 justify-center">
                                {esrb?.image && (
                                    <Image
                                        src={esrb.image}
                                        alt={esrb.title || esrb.name || ""}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 text-4xs"
                                    />
                                )}
                                <div className="w-40">
                                    رده سنی آمریکا (ESRB)
                                    <b className="block font-semibold mt-2 text-xs">
                                        {esrb.name}
                                    </b>
                                </div>
                            </div>
                        </button>
                    )}

                </div>
            )}

            <ModalPortal
                show={openDetails}
                selector='modal_portal'
            >
                <div className="bg-black/50 backdrop-blur-sm fixed top-0 left-0 right-0 bottom-0" onClick={() => { setSlideInDetails(false) }} />

                <div className={modalWrapperClass}>
                    <div className="min-h-96 flex flex-col justify-between" >
                        <div>

                            <div className="flex justify-between items-center pt-5 px-4 mb-4">
                                <h2 className="text-lg font-semibold block"> رده‌بندی سنی </h2>
                                <button
                                    type="button"
                                    onClick={() => { setSlideInDetails(false) }}
                                >
                                    <CloseSimple className="w-6 h-6 fill-current" />
                                </button>
                            </div>

                            <Tab
                                items={tabItems}
                                style="3"
                                wrapperClassName="mx-3"
                                scrollTabs
                                noGrowTabs
                                activeTab={activeItem}
                                onChange={(key) => { setActiveItem(key.toString()) }}
                            />
                        </div>
                        <div className="p-4">
                            <Link
                                href={"#"}
                                className="text-xs flex items-center justify-center gap-2 grow font-semibold text-violet-400"
                            >
                                <ArrowTopLeft2 className="w-4 h-4 fill-current" />
                                توضیحات بیشتر
                            </Link>
                        </div>
                    </div>

                </div>
            </ModalPortal>

        </>
    )
}

export default AgeRatingDetail;