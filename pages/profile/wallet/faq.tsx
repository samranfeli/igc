/* eslint-disable  @typescript-eslint/no-explicit-any */

//import { getStrapiPages } from "@/actions/strapi";
import ProfileSideBar from "@/components/authentication/profile/ProfileSideBar";
import ArrowRight from "@/components/icons/ArrowRight";
import WalletFaq from "@/components/payment/WalletFaq";
import { walletFaqData } from "@/dummyData/faqStrapiData";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { NextPage } from "next";
import Link from "next/link";
import Markdown from "react-markdown";

type FaqItemType = {
  id: number;
  Question?: string;
  Answer?: string;
};
const Faq: NextPage = ({ items }: { items?: FaqItemType[] }) => {
  const {isDesktop} = useIsDesktop();

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-5 relative max-w-[1000px] mx-auto px-3.5 lg:px-5">
        <div className="max-lg:hidden relative">
          <div className="lg:sticky lg:top-[100px] lg:mb-6">
            {isDesktop && <ProfileSideBar activeItem="wallet" />}
          </div>
        </div>
        <div className="lg:mt-4 lg:col-span-2 lg:sticky lg:top-5">
          <div className="lg:font-semibold mt-4 lg:mt-1 mb-5 lg:text-[#ff7189] text-xs lg:text-sm flex items-center gap-5">
            <Link href="/profile/wallet" className="w-6 h-6 lg:hidden">
                <ArrowRight />
            </Link>
            سوالات متداول
          </div>
          <div className="lg:py-5 lg:mb-6 lg:border lg:border-neutral-300 dark:lg:border-white/15 lg:p-4 lg:rounded-xl">
            {items?.length ? (
              <WalletFaq
                items={items?.map((item) => ({
                  content: <Markdown>{item.Answer}</Markdown>,
                  title: item.Question,
                  key: item.id,
                }))}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps = async (context: any) => {
  
  //laterTOdo: restore commented code

  // const response = await getStrapiPages(
  //   "filters[Page][$eq]=walletFaq&locale=fa&populate[Sections][populate]=*",
  // );

  return {
    props: {
      context: {
        locales: context.locales || null,
      },
      //items: response?.data?.data?.[0]?.Sections?.[0]?.Items || null,
      items: walletFaqData
    },
    revalidate: 3600,
  };
};

export default Faq;
