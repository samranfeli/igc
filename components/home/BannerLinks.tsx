import Link from "next/link";
import Image from "next/image";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import Carousel from "../shared/Carousel";

type Items = {
    imageUrl?: string;
    imageAlt?: string;
    imageTitle?: string;
    title: string;
    subtitle?: string;
    url: string;
}
type Props = {
    items: Items[]
}

const BannerLinks: React.FC<Props> = props => {
    
    const {isDesktop} = useIsDesktop();

    if(isDesktop && props.items.length > 4){
        const carouselItems = props.items.map(item => ({
            key: item.title,
            content: (
                <Link prefetch={false} href={item.url} className="relative block" key={item.title}>
                    <Image
                        src={item.imageUrl || "/images/default-game.png"}
                        alt={item.title || item.imageAlt || item.imageTitle || ""}
                        width={430}
                        height={130}
                        className="rounded-3xl w-full h-32 object-cover border border-white/25"
                    />
                </Link>
            )
        }));

        return (
            <Carousel
                wrapperClassName="p-5 pb-10"
                showDots={false}                
                items={carouselItems}
                numberOfSlides={4}
                gap={true}
                showArrow
            />
        )

    }

    return (
        <div className="p-3 lg:px-5 lg:flex lg:gap-3">
            {props.items?.map(item => (
                <Link prefetch={false} href={item.url} className="relative block mb-4" key={item.title}>
                    <Image
                        src={item.imageUrl || "/images/default-game.png"}
                        alt={item.title || item.imageAlt || item.imageTitle || ""}
                        width={430}
                        height={130}
                        className="rounded-3xl w-full h-32 object-cover border border-white/25"
                    />
                </Link>
            ))}
        </div>
    )
}

export default BannerLinks;