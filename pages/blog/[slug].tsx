/* eslint-disable  @typescript-eslint/no-explicit-any */

import {GetBlogDetail, GetSimilarPosts} from "@/actions/blog";
import { NextPage } from "next";
import {BlogDetailType, BlogListItemType} from "@/types/blog";
import Head from "next/head";
import Image from "next/image";
import { dateDisplayFormat, toPersianDigits } from "@/helpers";
import parse from "html-react-parser";
import Link from "next/link";
import BlogsCarousel from "@/components/blog/BlogsCarousel";
import { useEffect, useState } from "react";
import UserCircle from "@/components/icons/UserCircle";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useAppDispatch } from "@/hooks/use-store";
import { setHeaderParams } from "@/redux/pages";
import { useIsDesktop } from "@/hooks/use-is-desktop";

type Props = {
  slug: string;
  data?: BlogDetailType;
  moduleDisabled?: boolean;
  similarPosts?: BlogListItemType[];
};

const DetailBlog: NextPage<Props> = (props) => {

  const {isDesktop} = useIsDesktop();

  const [data, setData] = useState<BlogDetailType | undefined>(props.data);
  const [similarPosts, setSimilarPosts] = useState<BlogListItemType[] | undefined>(props.similarPosts);

  useEffect(() => {
    const fetchData = async (s: string) => {
      const response: any = await GetBlogDetail(s);
      if (response.data?.result) {
        setData(response.data.result);
      }
    };
    const fetchSimilarPosts = async (s: string) => {
      const response: any = await GetSimilarPosts(s);
      if (response.data?.result) {
        setSimilarPosts(response.data.result);
      }
    };
    if (props.slug) {
      fetchData(props.slug);
      fetchSimilarPosts(props.slug);
    }
  }, [props.slug]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setHeaderParams({
        headerParams: {
          logo: true,
          share: true,
        },
      }),
    );

    return () => {
      dispatch(setHeaderParams({ headerParams: undefined }));
    };
  }, []);

  if (props.moduleDisabled) {
    return (
      <div> NotFound </div>
      // <NotFound />
    );
  }

  const PostTitle: string = data?.title || "";

  if (!data) return null;

  const { content } = data;

  return (
    <>
      <Head>
        <title>{PostTitle}</title>
      </Head>
      <Breadcrumb
        items={[
          { label: "وبلاگ", link: "/blogs" },
          { label: data.title || "", link: "" },
        ]}
        wrapperClassName="mb-4"
      />
      <div className="px-5 mb-4">
        {!!data.postMainMediaUrl && (
          <Image
            src={data.postMainMediaUrl}
            alt={data.title || ""}
            width={isDesktop?1200:750}
            height={isDesktop?550:750}
            key={data.id}
            className="w-full h-auto block object-cover mb-3 max-w-[1200px] mx-auto"
          />
        )}
        <div className="max-w-[900px] mx-auto py-5">
          <h2 className="font-bold text-xl mb-3 lg:text-2xl lg:mb-7">
            {data.title}
          </h2>

          <div className="flex gap-3 flex-wrap lg:mb-12">
            {!!data.creationTime && (
              <div className="block border border-neutral-300 dark:border-white/15 p-4 rounded-xl text-xs">
                انتشار
                <b className="block font-semibold mt-2 text-sm">
                  {toPersianDigits(
                    dateDisplayFormat({
                      date: data.creationTime,
                      format: "timeAgo",
                      locale: "fa",
                    }),
                  )}
                </b>
              </div>
            )}

            {!!data.categories?.length && (
              <Link
                className="block border border-neutral-300 dark:border-white/15 p-4 rounded-xl text-xs"
                href={`/blog/category/${data.categories[0]?.slug}`}
              >
                دسته بندی
                <b className="block font-semibold mt-2 text-sm">
                  {data.categories[0]?.name}
                </b>
              </Link>
            )}

            {!!data.readTime && (
              <div className="block border border-neutral-300 dark:border-white/15 p-4 rounded-xl text-xs">
                مدت مطالعه
                <b className="block font-semibold mt-2 text-sm">
                  {data.readTime}
                </b>
              </div>
            )}
          </div>

          {!!content && (
            <div className="inserted-content">{parse(content)}</div>
          )}

          {!!data.author?.name && (
            <div className="flex items-center gap-1 my-8">
              {data.author.avatar ? (
                  <Image src={data.author.avatar} alt={data.author.name} width={48} height={48} className="w-12 h-12 fill-current" />   
              ):(
                  <UserCircle className="w-6 h-6 fill-current" />
              )}
              <span className="text-sm">نویسنده مقاله: {data.author.name}</span>
            </div>
          )}

          {!!data.tags?.length && (
            <>
              <h4 className="text-lg font-semibold mb-4 mt-8 text-[#a93aff] dark:text-[#ffefb2]">
                تگ های مرتبط
              </h4>
              <div className="flex gap-2 flex-wrap">
                {data.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="bg-[#a93aff] text-white dark:bg-[#161b3b] dark:text-[#a93aff] font-semibold p-4 text-xs rounded-xl block"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {!!similarPosts?.length && <BlogsCarousel 
          blogs={similarPosts}
          title="مطالب مشابه"
      />}
    </>
  );
};

export async function getServerSideProps(context: any) {
  if (!process.env.PROJECT_SERVER_BLOG) {
    return {
      props: {
        moduleDisabled: true,
      },
    };
  }

  const [BlogPost, SimilarPosts] = await Promise.all<any>([
      GetBlogDetail(context.query.slug),
      GetSimilarPosts(context.query.slug)
  ]);

  return {
    props: {
      slug: context.query?.slug || null,
      data: BlogPost?.data?.result || null,
      similarPosts: SimilarPosts?.data?.result || null
    },
  };
}

export default DetailBlog;