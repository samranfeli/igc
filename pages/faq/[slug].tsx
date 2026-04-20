/* eslint-disable  @typescript-eslint/no-explicit-any */

//import { getStrapiPages } from "@/actions/strapi";
import Accordion from "@/components/shared/Accordion";
import { faqStrapiData, faqStrapiSeoData } from "@/dummyData/faqStrapiData";
import { useAppDispatch } from "@/hooks/use-store";
import { setHeaderParams } from "@/redux/pages";
import { StrapiSeoData } from "@/types/commerce";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import Markdown from "react-markdown";

type FAQ = {
  id: number;
  Keyword: string;
  Title: string;
  icon?:{   
  url?:string;
  }
  Items?:{  
    Answer?: string;
    Question?: string;
    id:number;
  }[]
};

const FaqDetail: NextPage = ({ faq, strapiSeoData }: {faq?: FAQ,  strapiSeoData?: StrapiSeoData }) => {

    const dispatch = useAppDispatch();
  
    const title = faq?.Title;


    useEffect(()=>{
  
      dispatch(setHeaderParams({
        headerParams:{
          title:title
        }
      }));
  
      return(()=>{
        dispatch(setHeaderParams({headerParams: undefined}));
      })
  
    },[]);

  return (
  <>
    <Head>
      {strapiSeoData?.PageTitle && <title>{strapiSeoData.PageTitle}</title>}  
      
      {strapiSeoData?.Metas?.map(m => (
        <meta name={m.Type || ""} content={m.Value || ""} key={m.id} />
      ))}
      
      {strapiSeoData?.Schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: strapiSeoData.Schema }}
        />
      )}
    </Head>
    <div className="px-5 lg:max-w-[500px] lg:mx-auto lg:py-10">
      {faq?.Items?.map((item, index) => (
        <Accordion
          key={item.id}
          title={item.Question}
          content={<Markdown>{item.Answer}</Markdown>}
          WrapperClassName={`border-b border-neutral-300 dark:border-white/15 py-2 ${index ? "" : "border-t"}`}
          initiallyOpen={!index}
        />
      ))}
    </div>
  </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {

  const { query } = context;

  //laterTOdo: restore commented code
  
  // const [response, strapiSeoResponse] = await Promise.all<any>([
  //   getStrapiPages('filters[Page][$eq]=faq&locale=fa&populate[Sections][populate]=*'),
  //   getStrapiPages('filters[Page][$eq]=faq&locale=fa&populate[Seo][populate]=*')
  // ]);
  
  return ({
    props: {
      context: {
        locales: context.locales || null
      },
      faq: faqStrapiData?.find( (f:any) => f.Keyword === query.slug) || null,
      strapiSeoData : faqStrapiSeoData
      // faq: response?.data?.data?.[0]?.Sections?.find( (f:any) => f.Keyword === query.slug) || null,
      // strapiSeoData : strapiSeoResponse?.data?.data?.[0]?.Seo || null
    }
  })

}

export default FaqDetail;