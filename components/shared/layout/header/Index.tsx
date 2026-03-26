import Image from "next/image";
import Link from "next/link";
import MainMenu from './MainMenu';
import ArrowRight from "@/components/icons/ArrowRight";
import { useRouter } from "next/router";
import { useAppSelector } from "@/hooks/use-store";
import Loading from "@/components/icons/Loading";
import CartIcon from "@/components/icons/CartIcon";
import { toPersianDigits } from "@/helpers";
import { useEffect, useState } from "react";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import Skeleton from "../../Skeleton";
import { DownCaretThick } from "@/components/icons/DownCaretThick";
import MoreWrapper from "./MoreWrapper";

const Header: React.FC = () => {

    const {isDesktop} = useIsDesktop();

    const { cartGeneralInfo, loading } = useAppSelector((state) => state.cart);

    const headerParams = useAppSelector(state => state.pages.headerParams);

    const router = useRouter();

    const [scrolled, setScrolled] = useState<boolean>(false);

    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    const userInfoLoading = useAppSelector(state => state.authentication.getUserLoading);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    if (!isDesktop){
        return (
            <header className={`${scrolled?"headerShadow dark:no-box-shadow":""} fixed top-0 h-[84px] left-0 bg-[#fafafa] dark:bg-[#011425] z-[11] w-full flex justify-between p-3`}>
                {headerParams ? (
                    <div className={`flex items-center py-3.5 gap-4 ${(headerParams.logo && !headerParams.title) ?"w-[104px]":""} `}>
                        {headerParams.backLink ? (
                            <Link href={headerParams.backLink} className="w-8 h-8">
                                <ArrowRight />
                            </Link>
                        ):(
                            <button
                                type="button"
                                className="w-8 h-8 outline-none"
                                onClick={e=>{
                                    e.preventDefault();
                                    router.back()
                                }}
                            >
                                <ArrowRight />
                            </button>
                        )}
                        {headerParams.title || ""}
                    </div>
                ) : (
                    <Link href="/" className="flex gap-4">
                        <Image src="/logo.svg" alt="irangamecenter" width={50} height={50} />
                        <div>
                            <strong className="block text-xl font-bold">
                                ایران گیم سنتر
                            </strong>
                            <span className="text-xs">
                                فروشگاه آنلاین اکانت بازی
                            </span>
                        </div>
                    </Link>
                )}
    
                {!!headerParams?.logo &&(
                    <Link href={"/"}>
                        <Image src="/logo.svg" alt="irangamecenter" width={50} height={50} />
                    </Link>
                )}
                
                <div className={`flex gap-5 justify-end items-center ${headerParams?.logo?"w-[104px]":""}`}>
    
                    { headerParams?.cart && (
                        <Link href='/cart' className="relative w-fit cursor-pointer">
                            <CartIcon className="w-8 h-8 fill-current" />
                            {!!cartGeneralInfo?.totalQuantity && (
                                <span className="absolute bottom-[-10px] right-[-10px] bg-gradient-to-t from-green-600 to-green-300 text-[#011425] font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                    {loading ? (
                                        <Loading className="fill-current w-4 h-4 animate-spin" /> 
                                    ):(
                                        cartGeneralInfo.totalQuantity > 9 ? toPersianDigits("9+") : toPersianDigits(cartGeneralInfo.totalQuantity.toString())
                                    )}
                                </span>
                            )}
                        </Link>
                    )}    
    
                    {headerParams?.productId ?(
                        <MoreWrapper productId={headerParams.productId} variantId={headerParams.variantId} />
                    ):(
                        <MainMenu />
                    )}
    
                </div>
            </header>
        )
    }

    const menuItems: {
        label: string;
        url: string;
    }[] = [
        {
            url:"/",
            label:"فروشگاه"
        },
        {
            url:"/products",
            label:"پیشنهادهای ویژه"
        },
        // {
        //     url:"/categories",
        //     label:"دسته بندی ها"
        // },
        // {
        //     url:"/profile/orders",
        //     label:"سفارش های من"
        // },
        {
            url:"/terms",
            label:"قوانین و راهنما"
        },
        // {
        //     url:"/faq",
        //     label:"سوالات متداول"
        // },
        {
            url:"/about",
            label:"درباره ما"
        },
        {
            url:"/contact",
            label:"تماس با ما"
        }
    ];


    return(
        <header
            className={`${scrolled?"headerShadow dark:no-box-shadow":""} fixed left-0 right-0 top-0 h-[84px] z-[11] bg-white dark:bg-[#192a39]`}
        >
            <div className="lg:px-5 flex justify-between items-center h-[84px]">
                <div className="flex items-center gap-5">
                    <Link href={"/"} className="block">
                        <Image src="/logo.svg" alt="irangamecenter" width={50} height={50} />
                    </Link>

                    {menuItems.map(m => (
                        <Link
                            key={m.label}
                            href={m.url}
                            className="text-sm"
                        >
                            {m.label}
                        </Link>
                    ))}

                </div>

                <div className="flex gap-2 items-center">
                    <Link href='/cart' className="bg-white border border-neutral-300 dark:border-none dark:bg-[#011425] rounded-full px-4 py-3 relative text-sm flex gap-2 justify-center items-center cursor-pointer">
                        <Image src={"/images/icons/cart.svg"} alt="سبد خرید" className="block" width={26} height={26} />
                        سبد خرید
                        {!!cartGeneralInfo?.totalQuantity && (
                            <span className="bg-gradient-to-t from-green-600 to-green-300 text-[#011425] font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {loading ? (
                                    <Loading className="fill-current w-4 h-4 animate-spin" /> 
                                ):(
                                    cartGeneralInfo.totalQuantity > 9 ? toPersianDigits("9+") : toPersianDigits(cartGeneralInfo.totalQuantity.toString())
                                )}
                            </span>
                        )}
                    </Link>

                    <Link
                        prefetch={false}
                        href={isAuthenticated ? "/profile" : "/login"}
                        className={`bg-white border border-neutral-300 dark:border-none dark:bg-[#011425] rounded-full px-4 py-3 relative text-sm flex gap-2 justify-center items-center ${userInfoLoading ? "pointer-events-none" : ""}`}
                        >
                        <Image src={"/images/icons/profile.svg"} alt={"حساب کاربری"} className="block" width={26} height={26} />
                        {userInfoLoading ? <Skeleton className="w-12 h-4 mx-auto" /> : "پروفایل"}
                        <DownCaretThick className="w-3 h-3 fill-current" />
                    </Link>

                </div>

            </div>

        </header>
    )


}

export default Header;