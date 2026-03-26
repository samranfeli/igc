/* eslint-disable  @typescript-eslint/no-explicit-any */

import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ArrowTopLeft from "@/components/icons/ArrowTopLeft";
//import { getStrapiCategories } from "@/actions/strapi";
import { ServerAddress } from "@/enum/url";
import { useAppDispatch } from "@/hooks/use-store";
import { setHeaderParams } from "@/redux/pages";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { categoriesStrapiData } from "@/dummyData/categoriesStrapiData";

type StrapiDataItem = {
    id: number;
    Order: number;
    Slug: string
    Title: string;
    Description?: string;
    Children?: StrapiDataItem[];
    Image?: {
        url?: string;
    };
}

type StrapiData = StrapiDataItem[];

const Categories: NextPage = ({ strapiData }: { strapiData?: StrapiData }) => {

    const dispatch = useAppDispatch();

    const {isDesktop} = useIsDesktop();

    const [activeItemId, setActiveItemId] = useState<number>(strapiData?.[0]?.id || 0);

    useEffect(() => {
        // const fetchData = async () => {
        //     await getStrapiCategories("locale=fa&populate=*&filters[isTopLevel]=true&pagination[pageSize]=150");
        //     await getStrapiCategories("locale=fa&filters[isTopLevel][$eq]=true&[populate][Children][populate]=*");
        // }

        // fetchData()
        
        dispatch(setHeaderParams({
          headerParams:{
            logo: true
          }
        }));
    
        return(()=>{
          dispatch(setHeaderParams({headerParams: undefined}));
        })

    }, []);

    const activeItem = strapiData?.find(x => x.id === activeItemId);

    if(isDesktop){
        return(
            <>
                <Head>
                    <title>دسته بندی</title>
                </Head>
                
                <h3 className="py-10 hidden lg:block text-3xl font-bold border-b border-neutral-300 dark:border-white/15 text-center dark:text-white"> دسته بندی </h3>

                {strapiData ? (
                    <>
                        <div className="flex gap-3 px-5 py-3 border-b border-neutral-300 dark:border-white/15">

                            {strapiData.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => { setActiveItemId(cat.id) }}
                                    className={`p-2 aspect-square shrink-0 min-w-28 grow-0 shadow dark:box-shadow-none ${activeItemId === cat.id ? "bg-white/90 text-neutral-800" : "bg-[#eeeeee] dark:bg-[#192b39] text-[#333] dark:text-white"} text-center text-2xs block relative`}
                                >
                                    <span className={`absolute block h-1.5 w-full right-0 bottom-0 ${activeItemId === cat.id ? "bg-gradient-to-r from-[#fe707b] to-[#ff9b91]" : "bg-transparent"}`} />
                                    <Image src={cat.Image?.url ? `${ServerAddress.Type}${ServerAddress.Strapi}/${cat.Image.url}` : "/images/default-game.png"} alt={cat.Title} title={cat.Title} width={94} height={32} className="w-full h-8  block object-contain px-2 mb-1.5" />
                                    {cat.Title}
                                </button>
                            ))}

                        </div>

                        <div className="flex flex-wrap max-w-[1200px] mx-auto gap-3 py-10">
                            {activeItem?.Children?.map(item => (
                                <Link
                                    prefetch={false}
                                    key={item.id}
                                    href={`${item.Slug}`}
                                    className="text-xs block grow-0 shrink-0 w-40 py-5 text-center shadow dark:box-shadow-none bg-white rounded-xl text-black"
                                >
                                    <Image src={item.Image?.url ? `${ServerAddress.Type}${ServerAddress.Strapi}/${item.Image.url}` : "/images/default-game.png"} alt={item.Title} width={100} height={100} className="w-12 h-12 block mb-2 mx-auto" />
                                    {item.Title}
                                </Link>
                            ))}
                        </div>

                        <div className="text-center lg:mb-10">
                            <Link
                                prefetch={false}
                                href={`${activeItem?.Slug}`}
                                className="border px-3 py-2 rounded-full inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap"
                            >
                                همه محصولات {activeItem?.Title}
                                <ArrowTopLeft className="w-3.5 h-3.5 fill-current" />
                            </Link>
                        </div>

                    </>
                ) : (
                    <div>
                        اطلاعات یافت نشد
                    </div>
                )}

            </>  
        )
    }

    return (
        <>
            <Head>
                <title>دسته بندی</title>
            </Head>

            {strapiData ? (
                <div className="grid grid-cols-4 gap-2">
                    <div className="">
                        <div className="sticky top-2">

                            {strapiData.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => { setActiveItemId(cat.id) }}
                                    className={`p-2 shadow dark:box-shadow-none rounded-l-xl ${activeItemId === cat.id ? "bg-white text-neutral-800" : "bg-[#eeeeee] dark:bg-[#192b39] text-[#333] dark:text-white"} text-center mb-3 text-2xs block w-full relative`}
                                >
                                    <span className={`absolute block h-full w-1.5 right-0 top-0 ${activeItemId === cat.id ? "bg-gradient-to-t from-[#fe707b] to-[#ff9b91]" : "bg-transparent"}`} />
                                    <Image src={cat.Image?.url ? `${ServerAddress.Type}${ServerAddress.Strapi}/${cat.Image.url}` : "/images/default-game.png"} alt={cat.Title} title={cat.Title} width={94} height={32} className="w-full h-8  block mb-2 object-contain px-2" />
                                    {cat.Title}
                                </button>
                            ))}

                        </div>
                    </div>
                    <div className="col-span-3 sticky top-0">
                        <div className="sticky top-2 px-3 py-5">
                            <div className="text-left">
                                <Link
                                    prefetch={false}
                                    href={`${activeItem?.Slug}`}
                                    className="border px-3 py-2 rounded-full inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap"
                                >
                                    همه محصولات {activeItem?.Title}
                                    <ArrowTopLeft className="w-3.5 h-3.5 fill-current" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-3 py-5">
                                {activeItem?.Children?.map(item => (
                                    <Link
                                        prefetch={false}
                                        key={item.id}
                                        href={`${item.Slug}`}
                                        className="text-xs block text-center shadow dark:box-shadow-none bg-white rounded-xl p-4 text-black"
                                    >
                                        <Image src={item.Image?.url ? `${ServerAddress.Type}${ServerAddress.Strapi}/${item.Image.url}` : "/images/default-game.png"} alt={item.Title} width={100} height={100} className="w-12 h-12 block mb-2 mx-auto" />
                                        {item.Title}
                                    </Link>
                                ))}


                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    اطلاعات یافت نشد
                </div>
            )}

        </>
    )
}


export const getStaticProps = async (context: any) => {

    //laterTOdo: restore commented code

    // type responseType = {
    //     data?: {
    //         data?: StrapiDataItem[];
    //     }
    // }

    // const [response, responseForChildren] = await Promise.all<responseType>([
    //     getStrapiCategories('locale=fa&populate=*&filters[isTopLevel]=true'),
    //     getStrapiCategories('locale=fa&filters[isTopLevel][$eq]=true&[populate][Children][populate]=*')
    // ]);


    // const items = responseForChildren?.data?.data?.map(i => {
    //     const relatedItem = response?.data?.data?.find(x => x.id === i.id);
    //     return ({
    //         ...i,
    //         Image: relatedItem?.Image
    //     })
    // })

    return ({
        props: {
            context: {
                locales: context.locales || null
            },
            //strapiData: items || null
            strapiData: categoriesStrapiData
        },
        revalidate: 3600
    })

}



export default Categories;