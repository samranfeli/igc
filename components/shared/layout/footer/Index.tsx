import Image from "next/image";
import Link from "next/link";
import InfoCircleOutline from "@/components/icons/InfoCircleOutline";
import Faq from "@/components/icons/Faq";
import GameOutline from "@/components/icons/GameOutline";
import Phone from "@/components/icons/Phone";
import CaretLeft from "@/components/icons/CaretLeft";
import Contacts from "../../Contacts";
import FooterNamad from "./FooterNamad";

const Footer = () => {

    const socialMediaLink: {
        title: string;
        url: string;
        iconUrl: string;
    }[] = [
            {
                title: "تلگرام",
                url: "https://t.me/irangamecenter_official",
                iconUrl: '/images/icons/telegram.svg'
            },
            {
                title: "آپارات",
                url: "https://www.aparat.com/irangamecenter.com ",
                iconUrl: '/images/icons/aparat.svg'
            },
            {
                title: "ایکس",
                url: "https://x.com/irangamecenter ",
                iconUrl: '/images/icons/x.svg'
            },
            {
                title: "اینستاگرام",
                url: "https://www.instagram.com/irangamecenter_official",
                iconUrl: '/images/icons/insta.svg'
            }
        ];

        const contactLinks = [        
            {
                url:"/about",
                label:"درباره ما",
                icon: <GameOutline className="w-5 h-5 fill-current lg:hidden" />
            },
            {
                url:"/contact",
                label:"تماس با ما",
                icon: <Phone className="w-5 h-5 fill-none stroke-current lg:hidden" />
            },
            {
                url:"/terms",
                label:"قوانین و راهنما",
                icon: <InfoCircleOutline className="w-5 h-5 fill-none stroke-current lg:hidden" />
            },
            {
                url:"/faq",
                label:"سوالات متداول",
                icon: <Faq className="w-5 h-5 fill-none stroke-current lg:hidden" />
            }
        ]

    return (
        <footer className="p-3 px-5 dark:lg:bg-[#192a39]">


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-3">
                    <Contacts />
                </div>
                                
                <div>
                    <strong className="block text-center px-2 lg:text-right font-semibold mb-4"> لینک های مهم </strong>
                    <div>
                        {contactLinks.map((item, index) => (
                            <Link 
                                prefetch={false}
                                key={item.label}
                                href={item.url} 
                                className={`flex justify-between items-center px-2 py-4 lg:py-0  lg:mb-3 border-neutral-300 dark:border-white/15 text-sm ${index ? "border-t" : ""} lg:border-none`}
                            >
                                <span className="flex gap-3 items-center">
                                    {item.icon}
                                    {item.label}
                                </span>
                                <CaretLeft className="w-4 h-4 fill-current lg:hidden" />
                            </Link>
                        ))}
                    </div>
                </div>                

                <div>
                    <strong className="block text-center px-2 lg:text-right font-semibold mb-4"> شبکه های اجتماعی </strong>
                    <div className="flex gap-4 justify-center lg:justify-start">
                        {socialMediaLink.map(item => (
                            <Link
                                key={item.title}
                                title={item.title}
                                href={item.url}
                                className="block p-2 rounded-full bg-black/10 dark:bg-white/15"
                            >
                                <Image src={item.iconUrl} alt={item.title} className="w-8 h-8" width={32} height={32} />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="py-5 max-lg:border-t max-lg:border-white/15">
                    <strong className="block text-center px-2 lg:text-right font-semibold mb-4"> نمادهای اعتماد </strong>
                    <FooterNamad />
                </div>
            </div>


            <div className="text-[11px] border-t border-neutral-300 dark:border-white/15 py-5">
                © ۱۴۰۳ - تمام حقوق مربوط به وب سایت ایران گیم سنتر می باشد.
            </div>

        </footer>
    )
}

export default Footer;
