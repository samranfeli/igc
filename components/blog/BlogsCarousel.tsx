import Image from "next/image";
import Link from "next/link";
import ArrowTopLeft from "../icons/ArrowTopLeft";
import {  BlogListItemType } from "@/types/blog";
import { toPersianDigits } from "@/helpers";
import parse from 'html-react-parser';
import dynamic from "next/dynamic";
import { useIsDesktop } from "@/hooks/use-is-desktop";

const Carousel = dynamic(() => import("../shared/Carousel"), {
  ssr: false,
});

type Props = {
    blogs: BlogListItemType[];
    title?: string;
};
const BlogsCarousel: React.FC<Props> = props => {

    const items: {
        image: string;
        imageAlt?: string;
        title: string;
        subTitle?: string;
        url: string;
        date: string
    }[] = props.blogs.map(blog => ({
        image: blog.postMainMediaUrl || "/images/default-game.png",
        title: blog.title || "",
        url: `/blog/${blog.slug}`,
        imageAlt: blog.title || "",
        subTitle: blog.excerpt || "",
        date: toPersianDigits(blog.creationTime)
    }));

    const {isDesktop} = useIsDesktop();

    if (!items?.length) {
        return null
    }

    return (
        <section className="bg-[#e8ecf0] dark:bg-[#192b39] py-6 lg:px-3">

            <h3 className="max-lg:px-4 lg:px-2 text-[#ff7189] font-bold flex gap-2 items-center text-md mb-4">
                <Image src="/images/icons/blog.svg" alt="offer" width={36} height={36} className="w-9 h-9" />
                {props.title || "مجله خبری ایران گیم سنتر"}
            </h3>

            {items.length > 1 ? (
                <Carousel
                    numberOfSlides={isDesktop?4:undefined}
                    showDots
                    items={items.map(item => (
                        {
                            key: item.title,
                            content: (
                                <div className="px-4 lg:px-2" key={item.title} dir="rtl">
                                    <div className="bg-[#fff] dark:bg-[#011425] rounded-large">
                                        <Image
                                            src={item.image || "default-game.png"}
                                            alt={item.imageAlt || item.title}
                                            width={488}
                                            height={214}
                                            className="rounded-large w-full min-h-52 object-cover"
                                        />

                                        <Link prefetch={false} href={item.url} className="relative pl-10 p-5 block justify-between gap-3 items-center">
                                            <strong className="block mb-1 text-sm">
                                                {item.title}
                                            </strong>
                                            {!!item.subTitle && <div className="text-xs truncate-content-p">
                                                {parse(item.subTitle)}
                                            </div>}
                                            <ArrowTopLeft className="w-3.5 h-3.5 fill-current absolute top-1/2 left-4 -translate-y-1/2" />
                                        </Link>

                                    </div>
                                </div>
                            )
                        }
                    ))}
                />
            ) : (
                <div className="px-4 pb-6" key={items[0]?.title} dir="rtl">
                    <div className="bg-[#011425] rounded-large">
                        <Image
                            src={items[0]?.image || "default-game.png"}
                            alt={items[0]?.imageAlt || items[0]?.title}
                            width={488}
                            height={214}
                            className="rounded-large w-full min-h-52 object-cover"
                        />

                        <Link prefetch={false} href={items[0]?.url} className="relative pl-10 p-5 block justify-between gap-3 items-center">
                            <strong className="block mb-1 text-sm">
                                {items[0]?.title}
                            </strong>
                            {!!items[0]?.subTitle && <div className="text-xs truncate-content-p">
                                {parse(items[0]?.subTitle)}
                            </div>}
                            <ArrowTopLeft className="w-3.5 h-3.5 fill-current absolute top-1/2 left-4 -translate-y-1/2" />
                        </Link>

                    </div>
                </div>
            )}

        </section>
    )
}

export default BlogsCarousel;