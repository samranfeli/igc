import ClipRadius from "@/public/images/icons/ClipRadius";
import Image from "next/image";
import ArrowTopLeft from "../icons/ArrowTopLeft";
import Link from "next/link";
//import { ServerAddress } from "@/enum/url";
import Carousel from "../shared/Carousel";
import { useIsDesktop } from "@/hooks/use-is-desktop";

type Props = {
    items: {
        Url?: string;
        Title?: string;
        ImageAlternative?: string;
        ImageTitle?: string;
        id: number;
        Description?: string;
        Subtitle?: string;
        Image: {
            url: string;
        }
    }[];
}

const Slider: React.FC<Props> = props => {

    const {isDesktop, initializing} = useIsDesktop();
    
    //laterTOdo: restore commented code and use Strapi data; 
    //const createImageUrl = (u: string) => ServerAddress.Type! + ServerAddress.Strapi + u;
    const createImageUrl = (u: string) => u;

    if(initializing){
        return null;
    }
    
    if (props.items.length === 1 && !isDesktop) {

        const item = props.items[0];

        return (
            <section className="py-3 px-3">
                <Link className="relative block"  prefetch={false} href={item.Url || "#"}  >
                    <Image
                        src={createImageUrl(item.Image!.url!)}
                        alt={item.ImageAlternative || item.Title || ""}
                        title={item.ImageTitle}
                        width={430}
                        height={230}
                        priority
                        fetchPriority="high"
                        className="rounded-large w-full min-h-52 object-cover"
                    />
                    <span className="absolute top-0 right-0 pt-2 pb-3 pr-3 pl-5 block rounded-bl-large rounded-tr-large text-xs bg-white/75 dark:bg-[#011425]/75" >
                        {item.Description}
                    </span>

                    <div className="absolute bottom-0 right-0 pr-3 pt-2 pb-3 pl-16 left-0 bg-gradient-to-l from-white to-white/30 dark:from-[#011425]/75 dark:to-[#011425]/10 rounded-br-3xl">
                        <strong className="block mb-1 text-xl font-semibold truncate">
                            {item.Title}
                        </strong>
                        <p className="text-xs truncate">
                            {item.Subtitle}
                        </p>
                    </div>

                    <div
                        className="absolute -bottom-px -left-px h-16 w-16 bg-[#fafafa] dark:bg-[#011425] rounded-tr-large"
                    >
                        <ClipRadius className="absolute bottom-full left-0 fill-[#fafafa] dark:fill-[#011425] w-8 h-8" />
                        <ClipRadius className="absolute bottom-0 left-full fill-[#fafafa] dark:fill-[#011425] w-8 h-8" />

                        <div className="w-12 h-12  bg-[#eaeaea] dark:bg-[#1b2c3b] cursor-pointer select-none rounded-full absolute bottom-1 left-1 flex items-center justify-center">
                            <ArrowTopLeft className="fill-black dark:fill-white w-3.5 h-3.5" />
                        </div>

                    </div>

                </Link>
            </section>
        )
    }

    if (props.items.length) {

        const carouselItems = props.items.map((item, index) => ({
            key: item.id.toString(),
            content: (
                <Link className="relative block"  prefetch={false} href={item.Url || "#"} >
                    <Image
                        src={createImageUrl(item.Image!.url!)}
                        alt={item.ImageAlternative || item.Title || ""}
                        title={item.ImageTitle}
                        width={430}
                        height={230}
                         priority={!index}
                        fetchPriority="high"
                        className="rounded-large w-full min-h-52 object-cover"
                    />
                    <span className="absolute top-0 right-0 pt-2 pb-3 pr-3 pl-5 block rounded-bl-large rounded-tr-large text-xs bg-white/75 dark:bg-[#011425]/75" >
                        {item.Description}
                    </span>

                    <div className="absolute bottom-0 right-0 pr-3 pt-2 pb-3 pl-16 left-0 bg-gradient-to-l from-white to-white/30 dark:from-[#011425]/75 dark:to-[#011425]/10 rounded-br-3xl">
                        <strong className="block mb-1 text-xl font-semibold truncate">
                            {item.Title}
                        </strong>
                        <p className="text-xs truncate">
                            {item.Subtitle}
                        </p>
                    </div>

                    <div
                        className="absolute -bottom-px -left-px h-16 w-16 bg-[#fafafa] dark:bg-[#011425] rounded-tr-large"
                    >
                        <ClipRadius className="absolute bottom-full left-0 fill-[#fafafa] dark:fill-[#011425] w-8 h-8" />
                        <ClipRadius className="absolute bottom-0 left-full fill-[#fafafa] dark:fill-[#011425] w-8 h-8" />

                        <div className="w-12 h-12  bg-[#eaeaea] dark:bg-[#1b2c3b] cursor-pointer select-none rounded-full absolute bottom-1 left-1 flex items-center justify-center">
                            <ArrowTopLeft className="fill-black dark:fill-white w-3.5 h-3.5" />
                        </div>

                    </div>

                </Link>
            )
        }));

        let finalItems = carouselItems;

        if(carouselItems.length < 4 && isDesktop){
            
            const needed = 4 - carouselItems.length;
            const extra = Array.from({ length: needed }).map((_, i) => {
                const base = carouselItems[i % carouselItems.length];
                return {
                ...base,
                key: `${base.key}-repeat-${i}`,
                };
            });

            finalItems = [...carouselItems, ...extra];
        }

        return (
            <Carousel
                wrapperClassName={`py-3 px-3 ${isDesktop?"lg:px-5":""}`}
                showDots
                items={finalItems}
                numberOfSlides={isDesktop? 4 : undefined}
                gap={isDesktop}
            />
        )
    }

    return null;

}

export default Slider;
