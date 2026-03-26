/* eslint-disable  @typescript-eslint/no-explicit-any */

import ModalPortal from "../shared/layout/ModalPortal";
import { useEffect, useRef, useState } from "react";
import CheckboxGroup from "../shared/CheckboxGroup";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { setBodyScrollPosition, setBodyScrollable } from "@/redux/stylesSlice";
import CloseSimple from "../icons/CloseSimple";
import Accordion from "../shared/Accordion";
import { openFilter } from "@/redux/productsSlice";
import { useRouter } from "next/router";
import { Facet } from "@/types/commerce";
import Checkbox from "../shared/Checkbox";
import { useIsDesktop } from "@/hooks/use-is-desktop";

type Props = {
    filters: Facet[];
    brandName?: string;
    categoryName?: string;
}

const ProductsFilter: React.FC<Props> = props => {

    const {isDesktop} = useIsDesktop();

    const router = useRouter();

    const slugs: string[] = (router?.query?.slugs as string[]) || [];

    const [slideIn, setSlideIn] = useState<boolean>(false);

    const openedFilter = useAppSelector(state => state.products.openedFilter);

    const searchInputRef = useRef<HTMLInputElement>(null);


    const dispatch = useAppDispatch();

    useEffect(() => {
        if (openedFilter) {
            setSlideIn(true);
            dispatch(setBodyScrollable(false));
            dispatch(setBodyScrollPosition(window?.pageYOffset || 0));
        } else {
            dispatch(setBodyScrollable(true));
        }
    }, [!!openedFilter]);

    useEffect(() => {
        if (!slideIn) {
            setTimeout(() => { dispatch(openFilter("")) }, 300)
        }
    }, [slideIn]);

    useEffect(() => {
        const browserBackHandle = () => {
            setSlideIn(false)
            return true;
        };

        window.addEventListener("popstate", browserBackHandle);

        return () => {
            window.removeEventListener("popstate", browserBackHandle);
        };
    }, []);

    const changeFilterHandel = (values: string[], type: string) => {
        
        const otherSlugs = slugs?.filter(item => !(item.includes(`${type}-`)));
        
        const mainSegment = props.brandName ? `/brand/${props.brandName}`: props.categoryName? `/category/${props.categoryName}` :"/products";

        const segments = [...otherSlugs, ...(values.map(x => `${type}-${x}`))];
        const newUrl = segments.sort().join("/");
        router.push({
             pathname: [mainSegment ,newUrl].join("/")
        });
    }

    const recetAllFilters = () => {
        const otherSlugs = slugs?.filter(x => (x.includes("sort-") || x.includes("page-"))) || [];

        const mainSegment = props.brandName ? `/brand/${props.brandName}`: props.categoryName? `/category/${props.categoryName}` :"/products";

        const segments = [...otherSlugs];
        
        const newUrl = segments.sort().join("/");
        
        router.push({
            pathname: [mainSegment ,newUrl].join("/")
        });
    }

    const selectedFilter = (type: string) => { return (slugs?.filter(x => x.includes(`${type}-`))?.map(x => x.split(`${type}-`)?.[1])) || [] };

    // const activeClass = "mx-2 w-2 h-2 inline-block align-middle bg-red-500 rounded-full";

    const selectedFilterSlugs = slugs?.filter(x => (!x.includes("sort-") && !x.includes("page-"))) || [];
    const hasActiveFilter = selectedFilterSlugs.length;

    const openedFilterIsActive = (type: string) => !!(selectedFilterSlugs.find(item => item.includes(type)));


    const filterSearchHandle = () => {
        const searchedText = searchInputRef.current?.value;
        if(searchedText?.trim()?.length){

        changeFilterHandel([searchedText], "phrase")

        }
    }

    const filteredPhrase = selectedFilter("phrase")?.[0];

    useEffect(()=>{
        if(filteredPhrase && searchInputRef.current ){
            searchInputRef.current.value = filteredPhrase;
        }
    },[filteredPhrase, openedFilter]);


    let modalWrapperClass = `bg-white dark:bg-[#192a39] text-neutral-800 dark:text-white rounded-t-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full safePadding-b transition-all left-0 right-0 ${slideIn ? "bottom-0" : "-bottom-[80vh]"}`

    if (isDesktop) {
        modalWrapperClass = `bg-white dark:bg-[#192a39] text-neutral-800 dark:text-white rounded-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full max-w-2xl transition-all top-1/2 right-1/2 translate-x-1/2 ${slideIn ? "-translate-y-1/2 opacity-100" : "translate-y-0 opacity-0"}`
    }


    return (

        <ModalPortal
            show={!!openedFilter}
            selector='modal_portal'
        >
            <div className="bg-black/50 backdrop-blur-sm fixed top-0 left-0 right-0 bottom-0" onClick={() => { setSlideIn(false) }} />

            <div className={modalWrapperClass}>
                <div className="px-4 pt-8 pb-3">

                    <div className="mb-5 flex justify-between items-center">
                        {openedFilter === "all" ? (
                            <h5 className="font-semibold block">
                                فیلتر محصولات
                            </h5>
                        ) : (
                            <span />
                        )}
                        <button
                            type="button"
                            onClick={() => { setSlideIn(false) }}
                            className="relative -left-1.5"
                        >
                            <CloseSimple className="w-6 h-6 fill-current" />
                        </button>
                    </div>

                    { openedFilter === "all" && (
                        <Checkbox
                        className="mb-5"
                        block
                        label="فقط محصولات موجود"
                        onChange={(checked: boolean) => {
                            
                            const otherSlugs = slugs?.filter(item => !(item.includes("onlyAvailable")));

                            const mainSegment = props.brandName ? `/brand/${props.brandName}`: props.categoryName? `/category/${props.categoryName}` :"/products";

                            const segments = [...otherSlugs];

                            if(checked){
                                segments.push("onlyAvailable")
                            }
                            
                            const newUrl = segments.sort().join("/");

                            router.push({
                                pathname: [mainSegment ,newUrl].join("/"),
                            });
                        }}
                        value="OnlyAvailable"
                        checked={!!slugs.find(s => s.includes("onlyAvailable"))}
                    />
                    )}
                    
                   { openedFilter === "all" && (
                        <Checkbox
                            className="mb-5"
                            block
                            label="فقط پیش فروش"
                            onChange={(checked: boolean) => {

                                const otherSlugs = slugs?.filter(item => !(item.includes("onBackOrder")));
                                
                                const mainSegment = props.brandName ? `/brand/${props.brandName}` : props.categoryName? `/category/${props.categoryName}` :"/products";

                                const segments = [...otherSlugs];
                                
                                if(checked){
                                    segments.push("onBackOrder")
                                }
                                
                                const newUrl = segments.sort().join("/");
                                
                                router.push({
                                    pathname: [mainSegment , newUrl].join("/")
                                });
                            }}
                            value="OnBackOrder "
                            checked={!!slugs.find(s => s.includes("onBackOrder"))}
                        />
                    )}

                    { (openedFilter === "all" || openedFilter === "phrase") && (       
                        <Accordion
                            title={(
                                <h5 className="font-semibold text-sm"> فیلتر بر اساس جستجوی نام
                                    {/* {!!selectedFilter(filter.key)?.length && <span className={activeClass} />}  */}
                                </h5>
                            )}

                            extraInTitle={filteredPhrase && 
                                <div
                                    className="border rounded-full font-normal text-xs text-[#ca8bfb] border-[#ca8bfb] inline-flex items-center pr-2 pl-0.5"
                                >
                                    {filteredPhrase}
                                    <button
                                        type="button"
                                        onClick={() => { changeFilterHandel([], "phrase") }}
                                    >
                                        <CloseSimple className="w-5 h-5 fill-current" />
                                    </button>
                                </div>
                            }

                            content={(
                                <div>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        className="w-full block py-3 text-sm px-5 rounded-full outline-none bg-[#ffffff] dark:bg-[#ffffff2b] border-neutral-300 dark:border-transparent"
                                    />
                                </div>
                                // <CheckboxGroup
                                //     items={filter.items?.map(item => ({
                                //         label: `${item!.label} (${item.count})`,
                                //         value: item!.value!
                                //     })) || []}
                                //     onChange={vals => { changeFilterHandel(vals, filter.key) }}
                                //     values={selectedFilter(filter.key)}
                                // />
                            )}
                            initiallyOpen={openedFilter === "phrase"}
                            withArrowIcon
                            rotateArrow180
                            WrapperClassName="mb-4"
                        />
                    )}



                    {props.filters?.filter(item => ([item.key, "all"].includes(openedFilter))).map(filter => (
                        <Accordion
                            key={filter.key}
                            updateContent={filter.items?.join("-")}
                            title={(
                                <h5 className="font-semibold text-sm whitespace-nowrap"> فیلتر بر اساس {filter.label}
                                    {/* {!!selectedFilter(filter.key)?.length && <span className={activeClass} />}  */}
                                </h5>
                            )}

                            extraInTitle={selectedFilter(filter.key)?.map(i => (
                                <div
                                    key={i}
                                    className="border rounded-full font-normal text-xs text-[#ca8bfb] border-[#ca8bfb] inline-flex whitespace-nowrap items-center pr-2 pl-0.5"
                                >
                                    {filter.items?.find((f:any) => f.value === i)?.label || i}
                                    <button
                                        type="button"
                                        onClick={() => { changeFilterHandel(selectedFilter(filter.key).filter(x => x !== i), filter.key) }}
                                    >
                                        <CloseSimple className="w-5 h-5 fill-current" />
                                    </button>
                                </div>
                            ))}

                            content={(
                                <CheckboxGroup
                                    items={filter.items?.map(item => ({
                                        label: `${item!.label} (${item.count})`,
                                        value: item!.value!
                                    })) || []}
                                    onChange={vals => { changeFilterHandel(vals, filter.key) }}
                                    values={selectedFilter(filter.key)}
                                />
                            )}
                            initiallyOpen={openedFilter === filter.key}
                            withArrowIcon
                            rotateArrow180
                            WrapperClassName="mb-4"
                        />
                    ))}


                </div>

                <div className={`sticky bottom-0 px-4 pt-3 safePadding-b bg-white dark:bg-[#192a39] ${((hasActiveFilter && openedFilter === "all") || openedFilterIsActive(openedFilter)) ? "grid grid-cols-2 gap-3" : ""}`}>

                    {!!(openedFilter === "all" && hasActiveFilter) && (
                        <button
                            type="button"
                            className="bg-neutral-400 dark:bg-[#011425] text-white w-full rounded-full px-5 py-3 my-2 text-sm"
                            onClick={() => {
                                recetAllFilters();
                                setSlideIn(false);
                            }}
                        >
                            حذف فیلترها
                        </button>
                    )}

                    {openedFilterIsActive(openedFilter) && (
                        <button
                            type="button"
                            className="bg-neutral-400 dark:bg-[#011425] text-white w-full rounded-full px-5 py-3 my-2 text-sm"
                            onClick={() => {
                                changeFilterHandel([], openedFilter);
                                setSlideIn(false);
                            }}
                        >
                            حذف فیلتر
                        </button>
                    )}

                    <button
                        type="button"
                        className="text-white bg-gradient-violet w-full rounded-full px-5 py-3 my-2 text-sm"
                        onClick={() => { 
                            filterSearchHandle();
                            setSlideIn(false) 
                        }}
                    >
                        اعمال تغییرات
                    </button>

                </div>

            </div>
        </ModalPortal>

    )
}

export default ProductsFilter;