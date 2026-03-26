import Image from "next/image";
import Tab from "../shared/Tab";
import Add from "../icons/Add";
import { PlatformSlugTypes, ProductItem } from "@/types/commerce";
import React from "react";
import ProductListItem from "../products/ProductListItem";
import Link from "next/link";
import { TabItem } from "@/types";
import { setProgressLoading } from "@/redux/stylesSlice";
import { useAppDispatch } from "@/hooks/use-store";
import { useIsDesktop } from "@/hooks/use-is-desktop";

type Props = {
    playstation5Products?: ProductItem[];
    playstation4Products?: ProductItem[];
    steamProducts?: ProductItem[];
    xboxOneProducts?: ProductItem[];
    xboxSeriesXsProducts?: ProductItem[];
    nintendoSwitch2Products?: ProductItem[];
};

const BestSellers: React.FC<Props> = props => {
    
    const dispatch = useAppDispatch();

    const {isDesktop} = useIsDesktop();

    const items: {
        products: ProductItem[];
        slug: PlatformSlugTypes;
        label: string;
    }[] = [];

    if (props.playstation5Products?.length) {
        items.push({
            slug: "playstation-5",
            label: "Playstation 5",
            products: props.playstation5Products
        })
    }
    if (props.playstation4Products?.length) {
        items.push({
            slug: "playstation-4",
            label: "Playstation 4",
            products: props.playstation4Products
        })
    }
    if (props.steamProducts?.length) {
        items.push({
            slug: "steam",
            label: "Steam",
            products: props.steamProducts
        })
    }
    if (props.xboxOneProducts) {
        items.push({
            slug: "xbox-one",
            label: "Xbox one",
            products: props.xboxOneProducts
        })
    }
    if (props.xboxSeriesXsProducts) {
        items.push({
            slug: "xbox-series-xs",
            label: "Xbox Series X/S",
            products: props.xboxSeriesXsProducts
        })
    }
    if (props.nintendoSwitch2Products) {
        items.push({
            slug: "nintendo-switch-2",
            label: "Nintendo Switch 2",
            products: props.nintendoSwitch2Products
        })
    }

    const tabItems: TabItem[] = items.map(item => ({
        label: item.label,
        key: item.label,
        children: (<div className="py-5 grid grid-cols-1 gap-3 lg:grid-cols-3 xl:grid-cols-4">

            {item.products.map(i => (
                <ProductListItem 
                    onClick={()=>{dispatch(setProgressLoading(true))}} 
                    product={i} 
                    key={i.id} 
                    bgClass={isDesktop?"bg-[#eeeeee] dark:bg-[#0d1f2f]":"bg-[#fafafa] dark:bg-[#011425]"}
                />
            ))}
            <div className="lg:col-span-3 xl:col-span-4 lg:text-left">
                <Link
                    prefetch={false}
                    href={`/products/Platform-${item.slug}`}
                    onClick={()=>{dispatch(setProgressLoading(true));}}
                    className="text-sm text-white dark:text-[#ca54ff] bg-gradient-violet dark:bg-gradient-dark-violet max-lg:w-full px-5 py-3 flex lg:inline-flex rounded-full justify-center gap-3"
                >
                    <Add />
                    محصولات بیشتر
                </Link>
            </div>

        </div>)
    }))

    return (
        <section className="py-6">

            <h3 className="px-3 lg:px-5 text-[#ca54ff] font-bold flex gap-2 items-center text-md mb-4">
                <Image src="/images/icons/joystick.svg" alt="best sellers" width={36} height={36} className="w-9 h-9" />
                محصولات پرفروش
            </h3>

            <Tab
                items={tabItems}
                style="3"
                wrapperClassName="mx-3 lg:mx-5"
                scrollTabs
            />

        </section>
    )
}

export default BestSellers;