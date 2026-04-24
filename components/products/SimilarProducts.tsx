/* eslint-disable  @typescript-eslint/no-explicit-any */

import Image from "next/image";
import { PlatformSlugTypes, ProductItemExtented } from "@/types/commerce";
import ProductListItem from "./ProductListItem";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getSimilarsBySlug } from "@/actions/commerce";
import { useRouter } from "next/router";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import ProductDesktopSection from "./productDetailDesktop/ProductDesktopSection";

const Carousel = dynamic(() => import("../shared/Carousel"), {
    ssr: false,
});

type Props = {
    productSlug: string;
    onHasSimilarItems:()=>void;
};
const SimilarProducts: React.FC<Props> = props => {

    const [similarProducts, setSimilarProducts] = useState<ProductItemExtented[]>([]);
  
    const router = useRouter();

    const {query} = router;

    const {isDesktop} = useIsDesktop();

    const queryVariant = query.variant;
    const queryPlatform = query.platform as PlatformSlugTypes || undefined;

    useEffect(() => {
    
        const fetchData = async (s: string) => {
            const response: any = await getSimilarsBySlug({
                acceptLanguage:"fa-IR",
                slug: s,
                platform: queryPlatform ,
                variantId: queryVariant? +queryVariant : undefined
            });
            if (response.data?.result.length) {
                setSimilarProducts(response.data.result);
                props.onHasSimilarItems();
            }
        }

        if (props.productSlug) {
            fetchData(props.productSlug);
        }
    }, [props.productSlug]);


    function chunkArray<T>(arr: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    const products: ProductItemExtented[][] = chunkArray(similarProducts, 3);

    if (!products?.length) {
        return null
    }

    if (!props.productSlug) return null;

    if(isDesktop){
        return(
             <ProductDesktopSection  id="similar" title="محصولات مشابه">
                {products.length > 1 ? (
                    <Carousel
                        wrapperClassName="relative pb-10"
                        numberOfSlides={3}
                        showDots
                        infinite
                        items={products.map(productsGroup => (
                            {
                                key: productsGroup[0].id,
                                content: (
                                    <div className="flex flex-col gap-3 px-1.5" dir="rtl">
                                        {productsGroup.map(product => <ProductListItem key={product.id} product={product} />)}
                                    </div>
                                )
                            }
                        ))}
                        dotsWrapperClassName="absolute bottom-0 left-1/2"
                    />
                ) : (
                    <div className="flex flex-col gap-3 px-1.5" dir="rtl">
                        {products[0].map(product => <ProductListItem key={product.id} product={product} />)}
                    </div>
                )}
             </ProductDesktopSection> 
        )
    }

    return (
        <section id="similar" className={`bg-[#e8ecf0] dark:bg-[#192b39] py-6 lg:px-5 relative ${products.length > 1 ?"pr-1.5":"px-1.5"}`}>

            <h3 className="text-[#ff7189] font-bold flex gap-2 items-center text-md mb-4 px-1.5">
                <Image src="/images/icons/curl.svg" alt="offer" width={36} height={36} className="w-9 h-9" />
                محصولات مشابه
            </h3>

            {products.length > 1 ? (
                <Carousel
                    peek={15}
                    showDots
                    infinite
                    items={products.map(productsGroup => (
                        {
                            key: productsGroup[0].id,
                            content: (
                                <div className="flex flex-col gap-3 px-1.5" dir="rtl">
                                    {productsGroup.map(product => <ProductListItem key={product.id} product={product} />)}
                                </div>
                            )
                        }
                    ))}
                    dotsWrapperClassName="absolute top-6 left-4"
                />
            ) : (
                <div className="flex flex-col gap-3 px-1.5" dir="rtl">
                    {products[0].map(product => <ProductListItem key={product.id} product={product} />)}
                </div>
            )}

        </section>
    )
}

export default SimilarProducts;
