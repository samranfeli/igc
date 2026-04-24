/* eslint-disable  @typescript-eslint/no-explicit-any */

import Image from "next/image";
import CloseSimple from "../icons/CloseSimple";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/hooks/use-store";
import { setBodyScrollPosition, setBodyScrollable } from "@/redux/stylesSlice";
import ArrowRight from "../icons/ArrowRight";
import axios from "axios";
import { Blog, Commerce, ServerAddress } from "@/enum/url";
import { ProductItem } from "@/types/commerce";
import { setReduxError } from "@/redux/errorSlice";
import Link from "next/link";
import { toPersianDigits } from "@/helpers";
import Skeleton from "./Skeleton";
import History from "../icons/History";
import ArrowTopLeft from "../icons/ArrowTopLeft";
import { BlogListItemType } from "@/types/blog";
import SearchIcon from "../icons/SearchIcon";
import { useIsDesktop } from "@/hooks/use-is-desktop";

const Search = () => {

    const min = 3;

    const dispatch = useAppDispatch();

    const [open, setOpen] = useState<boolean>(false);
    const [slideIn, setSlideIn] = useState<boolean>(false);

    const [products, setProducts] = useState<ProductItem[]>();
    const [blogs, setBlogs] = useState<BlogListItemType[]>();

    const [text, setText] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [blogLoading, setBlogLoading] = useState<boolean>(false);

    useEffect(() => {
        if (open) {
            setSlideIn(true);
            searchInputRef.current?.focus();
            dispatch(setBodyScrollable(false));
            dispatch(setBodyScrollPosition(window?.pageYOffset || 0));
        } else {
            dispatch(setBodyScrollable(true));
        }
    }, [open]);

    useEffect(() => {
        if (!slideIn) {
            setText("");
            setTimeout(() => { setOpen(false) }, 300)
        }
    }, [slideIn]);

    const {isDesktop} = useIsDesktop();

    const [recentSearchList, setRecentSearchList] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("recentSearch");
        const items = stored ? JSON.parse(stored) : [];
        setRecentSearchList(items);
    }, []);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchInputRefDesktop = useRef<HTMLInputElement>(null);

    const source = axios.CancelToken.source();

    function saveRecentSearch(value: string) {
        const key = "recentSearch";
        const stored = localStorage.getItem(key);
        let list: string[] = stored ? JSON.parse(stored) : [];
        list = list.filter(item => item !== value);
        list.unshift(value);
        list = list.slice(0, 6);
        localStorage.setItem(key, JSON.stringify(list));
    }

    const fetchData = async (val: string) => {

        saveRecentSearch(val);

        try {

            const axiosParams = {
                method: "post",
                url: `${ServerAddress.Type}${ServerAddress.Commerce}${Commerce.GetAllProducts}`,
                cancelToken: source.token,
                data: {
                    maxResultCount: 30,
                    skipCount: 0,
                    search: val
                }
            }

            const response = await axios(axiosParams);

            if (response?.data?.result?.pagedResult?.items?.length) {
                setProducts(response.data.result.pagedResult.items);
            } else if (response?.data?.result?.pagedResult?.items) {
                setProducts([]);
            }

        } catch (error: any) {
            if (error.message && error.message !== "canceled") {
                dispatch(setReduxError({
                    title: "خطا",
                    message: error.message,
                    isVisible: true
                }))
            }

        } finally {
            setTimeout(() => { setLoading(false) }, 800);

            const stored = localStorage.getItem("recentSearch");
            const items = stored ? JSON.parse(stored) : [];
            setRecentSearchList(items);

        }

    };

    const fetchBlogs = async (val: string) => {

        try {       

            const axiosParams = {
                method: "get",
                url: `${ServerAddress.Type}${ServerAddress.Blog}${Blog.getPosts}?Search=${val}&MaxResultCount=${25}&SkipCount=0`,
                cancelToken: source.token
            }

            const response = await axios(axiosParams);

            if (response?.data?.result?.items?.length) {
                setBlogs(response.data.result.items);
            } else if (response?.data) {
                setBlogs([]);
            }

        } catch (error: any) {
            if (error.message && error.message !== "canceled") {
                dispatch(setReduxError({
                    title: "خطا",
                    message: error.message,
                    isVisible: true
                }))
            }

        } finally {
            setTimeout(() => { setBlogLoading(false) }, 800);

        }

    };


    useEffect(() => {

        setProducts(undefined);
        setBlogs(undefined);
        setLoading(true);
        setBlogLoading(true);

        let fetchTimeout: ReturnType<typeof setTimeout>;

        if (text.length >= min) {
            fetchTimeout = setTimeout(() => {
                fetchData(text);
                fetchBlogs(text);
            }, 300);
        }

        return () => {
            clearTimeout(fetchTimeout);
            if (source) {
                source.cancel("canceled");
            }
        }

    }, [text]);

    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (e: any) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
            setSlideIn(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className="relative lg:max-w-2xl lg:mx-auto" ref={wrapperRef}>
            <button
                onClick={() => { setOpen(true); }}
                type="button"
                name="text"
                className="lg:hidden w-full h-14 border-none outline-none rounded-full bg-black/10 dark:bg-white/10 px-4 flex items-center gap-3 text-[#333333] dark:text-[#bbbbbb]"
            >
                <SearchIcon className="w-9 h-9 fill-[#666] dark:fill-[#fff]" />
                جستجو
            </button>

            {isDesktop && <div className="hidden lg:block relative">
                <input 
                    className="w-full h-12 outline-none rounded-full bg-white border border-neutral-300 dark:border-none dark:bg-white/10 px-4 pr-14 text-[#333333] dark:text-[#bbbbbb]"
                    placeholder="جستجو"
                    onChange={e => { setText(e.target.value) }}
                    value={text}
                    ref={searchInputRefDesktop}
                    onFocus={() => { setOpen(true)}}
                />
                <SearchIcon className="w-8 h-8 fill-[#666] dark:fill-[#fff] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                
                {!!text.length && <button
                    type="button"
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 dark:bg-white/30 rounded-full p-1"
                    onClick={() => {
                        setText("");
                        searchInputRefDesktop.current?.focus();
                    }}
                >
                    <CloseSimple className="fill-white w-4 h-4" />
                </button>}
            </div>}
            


            {open && (
                <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen z-50 lg:absolute lg:top-full lg:mt-1 lg:bottom-auto lg:w-auto lg:h-auto">

                <div className="relative w-full h-screen lg:h-480">

                    <div className={`flex flex-col gap-4 p-5 py-7 lg:p-2.5 lg:rounded-3xl bg-[#fafafa] dark:bg-[#192a39] dark:text-white absolute transition-all left-0 right-0 max-lg:min-h-screen ${slideIn ? "opacity-100" : "opacity-0"}`}>

                        <div className='relative lg:hidden' >
                            <input
                                type="text"
                                autoComplete="off"
                                name="text"
                                ref={searchInputRef}
                                placeholder="جستجو"
                                onChange={e => { setText(e.target.value) }}
                                value={text}
                                className="w-full h-14 border-none outline-none rounded-full text-sm bg-black/10 dark:bg-white/10 px-5 pr-14"
                            />
                            <button
                                type="submit"
                                className="absolute top-1/2 right-4 -translate-y-1/2"
                                onClick={() => { setSlideIn(false) }}
                            >
                                <ArrowRight className="w-7 h-7 fill-current" />
                            </button>

                            {!!text.length && <button
                                type="button"
                                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 dark:bg-white/30 rounded-full p-1"
                                onClick={() => {
                                    setText("");
                                    searchInputRef.current?.focus();
                                }}
                            >
                                <CloseSimple className="fill-white w-4 h-4" />
                            </button>}

                        </div>

                        <div className="bg-black/10 dark:bg-white/10 rounded-3xl py-5 px-2 grow">
                            {!!text.length && (
                                <div className="flex gap-4 mx-4 items-center border-b border-black/30 dark:border-white/30 pb-5 text-xs">
                                    <SearchIcon className="w-9 h-9 fill-[#666] dark:fill-[#fff] lg:hidden" />
                                    <span> جستجوی “{text}” </span>
                                </div>
                            )}

                            <div className="max-lg:search-result-max-h lg:search-result-max-h-desktop styled-scrollbar overflow-auto px-3">
                                {!!text.length && (
                                    <>
                                        <label className="block font-semibold mt-5 mb-3"> جستجو در محصولات </label>
                                        {loading ? (
                                            [1, 2, 3].map(item => (
                                                <div className="flex gap-3 items-center border-b border-black/30 dark:border-white/30 py-3" key={item}>
                                                    <Skeleton
                                                        key={item}
                                                        dark
                                                        type="image"
                                                        className="w-18 h-18 block shrink-0 rounded-2xl"
                                                    />
                                                    <Skeleton className="h-4 w-full" dark />
                                                </div>
                                            ))
                                        ) : products?.length ? products.map(product => (
                                            <Link prefetch={false} key={product.id} href={`/product/${product.slug}`} className="flex items-center gap-4 border-b border-black/30 dark:border-white/30 py-3" >
                                                <Image
                                                    src={product.filePath || "/images/default-game.png"}
                                                    alt={product.fileAltAttribute || product.name || ""}
                                                    width={72}
                                                    height={72}
                                                    className="block w-18 h-18 rounded-2xl"
                                                    title={product.fileTitleAttribute || product.name}
                                                />
                                                <h4 className="text-xs"> {toPersianDigits(product.name || "")} </h4>
                                            </Link>
                                        )) : products ? (
                                            <div className="text-sm py-5 mb-5"> محصولی یافت نشد </div>
                                        ) : <div className="h-13"/>}

                                        <label className="block font-semibold mt-5 mb-3"> جستجو در مقالات </label>

                                        {blogLoading ? (
                                            [1, 2].map(item => (
                                                <div className="flex gap-3 items-center border-b border-black/30 dark:border-white/30 py-3" key={item}>
                                                    <Skeleton
                                                        key={item}
                                                        dark
                                                        type="image"
                                                        className="w-18 h-18 block shrink-0 rounded-2xl"
                                                    />
                                                    <Skeleton className="h-4 w-full" dark />
                                                </div>
                                            ))
                                        ) : blogs?.length ? blogs.map(blog => (
                                            <Link prefetch={false} key={blog.id} href={`/blog/${blog.slug}`} className="flex items-center gap-4 border-b border-black/30 dark:border-white/30 py-3" >
                                                <Image
                                                    src={blog.postMainMediaUrl || "/images/default-game.png"}
                                                    alt={blog.title || ""}
                                                    width={72}
                                                    height={72}
                                                    className="block w-18 h-18 rounded-2xl"
                                                    title={blog.title || ""}
                                                />
                                                <h4 className="text-xs"> {toPersianDigits(blog.title || "")} </h4>
                                            </Link>
                                        )) : blogs ? (
                                            <div className="text-sm py-5 mb-5"> مطلبی یافت نشد </div>
                                        ) : <div className="h-13"/>}
                                    </>
                                )}

                                <br />

                                {recentSearchList?.map(item => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => { setText(item) }}
                                        className="py-3 flex items-center w-full px-3 justify-between gap-2"
                                    >
                                        <span className="flex items-center gap-2">
                                            <History className="w-5 h-5 fill-current" /> {item}
                                        </span>
                                        <ArrowTopLeft className="w-4 h-4 fill-current" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            )}
            

        </div>
    )
}

export default Search;