/* eslint-disable  @typescript-eslint/no-explicit-any */

//import { getStrapiContact, getStrapiPages } from "@/actions/strapi";
import { NextPage } from "next";
import { useAppDispatch } from "@/hooks/use-store";
import { useEffect } from "react";
import { setHeaderParams } from "@/redux/pages";
import Accordion from "@/components/shared/Accordion";
import Markdown from "react-markdown";
import Ticketing from "@/components/contact/items/Ticketing";
import { ServerAddress } from "@/enum/url";
import OnlineSupport from "@/components/contact/items/OnlineSupport";
import Call from "@/components/contact/items/Call";
import Image from "next/image";
import Head from "next/head";
import { StrapiSeoData } from "@/types/commerce";
import { contactStrapiData, contactStrapiFaqData, contactStrapiSeoData } from "@/dummyData/contactStrapiData";

type FaqData = {
  Title?: string;
  Items?: {
    Answer?: string;
    Question?: string;
    id: number;
  }[];
};

type ContactsData = {
  id:number;
  Keyword?: "ticket"|"online"|"call"|"address";
  Subtitle?: string;
  Title?: string;
  Url?: string;
  icon?:{
    url?: string;
  };
  Items?:{      
    Description?: string;
    Name?: string;
    Value?: string;
    icon?:{
        url?: string;
    };
    id:number;
    url?:string;
    backgroundColorCode?: string;
  }[]
}[]

const Contact: NextPage = ({ contacts, faq, strapiSeoData }: { contacts?: ContactsData, faq?: FaqData, strapiSeoData?:StrapiSeoData }) => {

  const dispatch = useAppDispatch();

  useEffect(()=>{

    dispatch(setHeaderParams({
      headerParams:{
        title:"تماس با ما"
      }
    }));

    return(()=>{
      dispatch(setHeaderParams({headerParams: undefined}));
    })

  },[]);

  const ticketingData = contacts?.find(c => c.Keyword === "ticket");

  const onlineSupportData = contacts?.find(c => c.Keyword === "online");

  const callData = contacts?.find(c => c.Keyword === "call");
  
  const addressData = contacts?.find(c => c.Keyword === "address");

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

      <div className="lg:max-w-[1000px] lg:mx-auto">
        <div className="px-5 mb-5 lg:py-5">

            <h3 className="text-[#ca54ff] font-bold text-sm mb-4">
              ارتباط با پشتیبانی
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-3 lg:mt-10">

              <Ticketing 
                icon={ticketingData?.icon?.url ? `${ServerAddress.Type}${ServerAddress.Strapi}/${ticketingData.icon.url}` : ""}
                label={ticketingData?.Title}
                url={ticketingData?.Url}
              />

              <OnlineSupport 
                icon={onlineSupportData?.icon?.url ? `${ServerAddress.Type}${ServerAddress.Strapi}/${onlineSupportData.icon.url}` : ""}
                label={onlineSupportData?.Title}
                items = {onlineSupportData?.Items}
              />

              <Call 
                icon={callData?.icon?.url ? `${ServerAddress.Type}${ServerAddress.Strapi}/${callData.icon.url}` : ""}
                label={callData?.Title}    
                description={callData?.Subtitle} 
                InnerData={callData?.Items?.[0]}     
              />


              <div
                  className="mb-3 dark:text-white py-4 min-h-20 px-5 bg-gradient-to-t from-[#eeeeee] to-[#e1e1e1] dark:from-[#01212e] dark:to-[#102c33] rounded-xl"
              >
                <div className="text-sm font-semibold flex gap-4 items-center mb-3">
                  <Image 
                      src={addressData?.icon?.url ? `${ServerAddress.Type}${ServerAddress.Strapi}/${addressData.icon.url}` : ""}
                      alt={addressData?.Title ||""}
                      width={36}
                      height={36}
                      className="w-9 h-9"
                  />            
                  {addressData?.Title}
                </div>

                <p className="text-xs w-full"> {addressData?.Subtitle} </p>

              </div>
            </div>




        </div>

          {!!faq?.Items?.length && (<div className="px-5 py-5">
              <h3 className="text-[#ca54ff] font-bold text-sm mb-4">
                {faq.Title || "سوالات متداول"}
              </h3>
              {faq.Items.map((item, index) => (
                <Accordion
                    key={item.id}
                    title={item.Question}
                    content={<Markdown>{item.Answer}</Markdown>}
                    WrapperClassName={`border-b border-neutral-300 dark:border-white/15 py-2 ${index ? "" : "border-t"}`}
                />
              ))}
          </div>)}
      </div>

      
    </>
  );
}

export const getStaticProps = async (context: any) => {

  //laterTOdo: restore commented code
  
  // const [contactUsResponse1,contactUsResponse2, faqResponse, strapiSeoResponse] = await Promise.all<any>([
  //   getStrapiContact('locale=fa&populate[ContactUs][populate]=*'),
  //   getStrapiContact('locale=fa&populate[ContactUs][populate][Items][populate]=*'),
  //   getStrapiContact('locale=fa&populate[Faqs][populate]=*'),
  //   getStrapiPages('filters[Page][$eq]=contact&locale=fa&populate[Seo][populate]=*')
  // ]);

  // const contacts1:ContactsData = contactUsResponse1?.data?.data?.[0]?.ContactUs;
  // const contacts2:ContactsData = contactUsResponse2?.data?.data?.[0]?.ContactUs;

  // const contacts = contacts2?.map((item) => {
  //   const icon = contacts1.find((x) => x.id === item.id)?.icon
  //   return({
  //     ...item,
  //     icon
  //   })
  // }) 

  return ({
    props: {
      context: {
        locales: context.locales || null
      },
      contacts: contactStrapiData,
      faq: contactStrapiFaqData,
      strapiSeoData : contactStrapiSeoData
      // contacts: contacts || null,
      // faq: faqResponse?.data?.data?.[0]?.Faqs || null,
      // strapiSeoData : strapiSeoResponse?.data?.data?.[0]?.Seo || null
    },
    revalidate: 3600
  })

}

export default Contact;
