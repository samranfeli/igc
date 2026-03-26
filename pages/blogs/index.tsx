/* eslint-disable  @typescript-eslint/no-explicit-any */

import { getBlogsList } from "@/actions/blog";
import { NextPage } from "next";
import { BlogListItemType } from "@/types/blog";
import Breadcrumb from "@/components/shared/Breadcrumb";
import BlogListItem from "@/components/blog/BlogListItem";
import { useEffect, useRef, useState } from "react";
import Skeleton from "@/components/shared/Skeleton";
import Add from "@/components/icons/Add";
import { useIsDesktop } from "@/hooks/use-is-desktop";

type Props = {
    posts?: BlogListItemType[];
    total: number;
}
const Blogs: NextPage<Props> = props => {

    const [posts, setPosts] = useState<BlogListItemType[]>(props.posts || []);
    const [fetchMode, setFetchMode] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(props.total);

    const {isDesktop} = useIsDesktop();

    const loadMoreWrapper = useRef<HTMLDivElement>(null);

    const removeListener = () => {
        document.removeEventListener('scroll', checkIsInView);
        window.removeEventListener("resize", checkIsInView);
    }

    useEffect(()=>{
        const fetchData = async (isDesk:boolean) => {
            const blogs: any = await  getBlogsList({
                MaxResultCount: isDesk ? 20 : 10,
                SkipCount:0
            });
            if(blogs?.data?.result){
                setTotal(blogs?.data?.result?.totalCount);
                setPosts(blogs?.data?.result?.items)
            }
        }
        
        fetchData(isDesktop);

    },[isDesktop]);

    useEffect(() => {
        if (fetchMode) {
            if(posts.length < (isDesktop ? 50 : 20)){
                addItems();
            }else{
               removeListener(); 
            }
        }
    }, [fetchMode, posts.length]);

    const addItems = async () => {

        if (posts.length >= total) {
            removeListener();
            return;
        }
        setLoading(true);
        const blogs: any = await getBlogsList({
            MaxResultCount:isDesktop ? 20 : 10,
            SkipCount: posts.length
        });
        if (blogs?.data?.result?.items) {
            setPosts(prevPosts => [...prevPosts, ...blogs.data.result.items]);
            setTotal(blogs.data.result.totalCount)
        } else {
            removeListener();
        }
        setLoading(false);
        setFetchMode(false);
    }

    const checkIsInView = () => {
        const targetTop = loadMoreWrapper.current?.getBoundingClientRect().top;
        const screenHeight = screen.height;
        if (targetTop && targetTop < (3 * screenHeight / 5) && !fetchMode) {
            setFetchMode(true);
        }
    }

    useEffect(() => {
        document.addEventListener('scroll', checkIsInView);
        window.addEventListener("resize", checkIsInView);

        return (() => {
            document.removeEventListener('scroll', checkIsInView);
            window.removeEventListener("resize", checkIsInView);
        });
    }, []);


    return (
        <>
            <Breadcrumb
                wrapperClassName="mb-4 lg:mb-0"
                items={[{ label: "وبلاگ", link: "" }]}
            />

            <h3 className="py-10 hidden lg:block text-3xl font-bold border-b border-neutral-300 dark:border-white/15 text-center text-white"> وبلاگ </h3>

            <div className="px-4 lg:grid lg:grid-cols-3 lg:gap-3 lg:py-10 max-w-[1200px] mx-auto">
                {posts?.map(post => (
                    <BlogListItem
                        key={post.id}
                        data={post}
                        wrapperClassName="mb-4"
                    />
                ))}

                {!!loading && [1, 2, 3, 4, 5].map(item => (
                    <div className="flex gap-3 mb-4" key={item}>
                        <Skeleton
                            dark
                            type="image"
                            className="w-18 h-18 aspect-square rounded-2xl"
                        />
                        <div className="grow">
                            <Skeleton className="h-4 w-full mt-5 mb-4" dark />
                            <Skeleton className="w-1/2" dark />
                        </div>
                    </div>
                ))}
                
                <div className="lg:col-span-3" ref={loadMoreWrapper}>
                    { total > posts.length &&  <button
                        type="button"
                        className="text-sm text-white dark:text-[#ca54ff] bg-[#ca54ff] dark:bg-[#161b39] w-full lg:max-w-[380px] mx-auto px-5 py-3 flex rounded-full justify-center gap-3"
                        onClick={addItems}
                    >
                        <Add />
                        مطالب بیشتر
                    </button>}
                </div>

            </div>

        </>
    )
}

export async function getServerSideProps() {

    if (!process.env.PROJECT_SERVER_BLOG) {
        return (
            {
                props: {
                    moduleDisabled: true
                },
            }
        )
    }


    const blogs: any = await  getBlogsList({
        MaxResultCount:10,
        SkipCount:0
    })

    return (
        {
            props: {
                posts: blogs?.data?.result?.items || null,
                totalPages: blogs?.data?.result?.totalCount || null
            }
        }
    )
}


export default Blogs;