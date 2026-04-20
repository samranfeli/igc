/* eslint-disable  @typescript-eslint/no-explicit-any */

// import { getStrapiPages } from "@/actions/strapi";
import { NextPage } from "next";
import { useAppDispatch } from "@/hooks/use-store";
import { useEffect } from "react";
import { setHeaderParams } from "@/redux/pages";
import Intro from "@/components/about/Intro";
import FAQ from "@/components/shared/FAQ";
import AboutIcons from "@/components/about/AboutIcons";
import Head from "next/head";
import { StrapiSeoData } from "@/types/commerce";
import { aboutStrapiData, aboutStrapiSeoData } from "@/dummyData/aboutStrapiData";

type StrapiData = {
  Keyword: "about_intro" | "icons" | "faq" | "telNumber" | "email";
  Body?: string;
  Items?: {
    id: number;
    Question?: string;
    Answer?: string;

    Description?: string;
    Image?:{
      url?: string;
    };
    Title?: string;

  }[];
  Description?: string;
  Subtitle?: string;
  Url?: string;
}[];

const AboutUs: NextPage = ({ strapiData, strapiSeoData }: { strapiData?: StrapiData, strapiSeoData?: StrapiSeoData }) => {

  const dispatch = useAppDispatch();

    useEffect(()=>{
  
      dispatch(setHeaderParams({
        headerParams:{}
      }));
  
      return(()=>{
        dispatch(setHeaderParams({headerParams: undefined}));
      })
  
    },[]);

  const aboutDescription = strapiData?.find(item => item.Keyword === "about_intro")?.Body;

  const FAQ_items = strapiData?.find(item => item.Keyword === "faq")?.Items;
  const icons = strapiData?.find(item => item.Keyword === "icons")?.Items;
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
      <div className="lg:max-w-[1000px] lg:mx-auto lg:py-10">
        <div className="lg:py-5">
          {!!aboutDescription && <Intro description={aboutDescription} />}

          {!!icons && <AboutIcons items={icons} />}

          {!!FAQ_items?.length && <FAQ items={FAQ_items} answerParse="markDown" />}
        </div>

      </div>
      
    </>
  );
}

export const getStaticProps = async (context: any) => {

  //laterTOdo: restoreCommented code
  // const [responseForAllSections, responseForIconsSection, strapiSeoResponse] = await Promise.all<any>([
  //   getStrapiPages('filters[Page][$eq]=aboutUs&locale=fa&populate[Sections][populate]=*'),
  //   getStrapiPages('filters[Page][$eq]=aboutUs&locale=fa&populate[Sections][on][shared.repeter][populate][Items][populate]=*'),
  //   getStrapiPages('filters[Page][$eq]=aboutUs&locale=fa&populate[Seo][populate]=*')
  // ]);

  //const iconsSection = responseForIconsSection?.data?.data?.[0]?.Sections?.find((item:any) => item.Keyword==="icons");
  //const otherSections = responseForAllSections?.data?.data?.[0]?.Sections?.filter((item:any) => item.Keyword !=="icons");
  //const AllSections = otherSections ? [...otherSections, iconsSection] : null;

  return ({
    props: {
      context: {
        locales: context.locales || null
      },
      strapiData: aboutStrapiData,
      strapiSeoData : aboutStrapiSeoData
      // strapiData: AllSections || null,
      // strapiSeoData : strapiSeoResponse?.data?.data?.[0]?.Seo || null
    },
    revalidate: 3600
  })

}

export default AboutUs;