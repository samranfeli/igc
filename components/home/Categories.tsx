import Image from "next/image";
import Link from "next/link";
import React from "react";

type ItemType = {
    Url?: string;
    Title?: string;
    ImageAlternative?: string;
    ImageTitle?: string;
    id: number;
    Image?: {
        url?: string;
    }
}
type Props = {
    items: ItemType[];
    title?: string;
}

const Categories: React.FC<Props> = props => {

    function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            result.push(arr.slice(i, i + chunkSize));
        }
        return result;
    }

    const itemsWithUrl = props.items.filter(item => item.Image?.url);

    const chunkedArray: ItemType[][] = chunkArray(itemsWithUrl, 2);

    if (props.items.length) {
        return (
            <section className="flex gap-2 py-3 lg:mb-3">
                <div className="bg-red-600 text-sm text-white writing-tb lg:writing-inherit lg:shrink-0 rotate-180 lg:rotate-0 px-2 py-5 lg:px-6 max-lg:rounded-r-xl lg:rounded-l-xl flex items-center justify-center gap-3">
                    <Image src="/images/icons/squares.svg" alt="categories" width={24} height={24} className="w-6 h-6" />
                    {props.title || "دسته بندی ها"}
                </div>
                <div className="max-lg:hidden-scrollbar lg:styled-scrollbar lg:pb-2 lg:-mb-3 overflow-x-auto overflow-y-clip">
                    <div className="grid grid-flow-col gap-y-2">
                        {chunkedArray.map(item => (
                            <div key={item[0].id} className="pl-2 lg:flex lg:gap-2">
                                {item.map((i, index) => (
                                    <Link key={i.id} href={i.Url || "#"} className={`block w-36 ${index?"max-lg:mt-2":""}`} prefetch={false} >
                                        {/* <Image src={ServerAddress.Type! + ServerAddress.Strapi + i.Image!.url!} alt={i.ImageAlternative || i.Title || ""} width={144} height={80} className="w-36 h-20 object-cover rounded-2xl" /> */}
                                        <Image src={i.Image!.url!} alt={i.ImageAlternative || i.Title || ""} width={144} height={80} className="w-36 h-20 object-cover rounded-2xl" />
                                    </Link>
                                ))}
                                <div className="x-1" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return null;

}

export default Categories;