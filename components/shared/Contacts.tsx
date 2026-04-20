/* eslint-disable  @typescript-eslint/no-explicit-any */

import { getStrapiPages } from "@/actions/strapi";
import { dummyContactDataObject } from "@/dummyData/homeStrapiData";
import { toPersianDigits } from "@/helpers"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";

type dataType = {
    emailAddress?: string;
    supportNumber?: string;
    supportNUmberUrl?: string;
    supportNumberSubtitle?: string;
}

type Props = {
    data?: dataType;
}

const Contacts: React.FC<Props> = props => {

    //laterTOdo: remove dummyContactDataObject
    const [data, setData] = useState<dataType | undefined>(props.data || dummyContactDataObject || undefined);

    useEffect(()=>{        
        const fetchData = async () => {
            const response: any = await getStrapiPages('filters[Page][$eq]=aboutUs&locale=fa&populate[Sections][populate]=*');
            if(response.data){
                const aboutSections = response?.data?.data?.[0]?.Sections;
                const dataObject = {
                    emailAddress: aboutSections?.find((item:any) => item.Keyword === "email")?.Description,
                    supportNumber: aboutSections?.find((item:any) => item.Keyword === "telNumber")?.Description,
                    supportNumberSubtitle: aboutSections?.find((item:any) => item.Keyword === "telNumber")?.Subtitle,
                    supportNUmberUrl: aboutSections?.find((item:any) => item.Keyword === "telNumber")?.Url                    
                };
                setData(dataObject);
            }
        }

        if(!data){
            fetchData();
        }

    },[data]);

    if (!data) return null;

    const {emailAddress, supportNUmberUrl, supportNumber, supportNumberSubtitle} = data;

    return (
        <div className={`text-white grid grid-cols-1 lg:p-b-5 gap-5 ${supportNumber&& emailAddress?"lg:grid-cols-2":""}`}>
            {!!supportNumber && <Link
                href={supportNUmberUrl ? `tel:${supportNUmberUrl}` : "#"}
                className="bg-blue-600 text-shadow flex justify-between items-center gap-5 rounded-full px-5 h-14"
            >
                <div className="flex gap-3 items-center">
                    <Image src='/images/icons/phone.svg' alt="contact number" className="w-8 h-8" width={32} height={32} />
                    <div>
                        <p className="text-sm block"> شماره پشتیبانی </p>
                        <span className="text-xs"> {toPersianDigits(supportNumberSubtitle || "ساعت 9 تا 14")} </span>
                    </div>
                </div>

                <span className="tracking-widest" dir="ltr"> {toPersianDigits(supportNumber)} </span>

            </Link>}

            {!!emailAddress && <Link
                href={`mailto:${emailAddress}`}
                className="bg-emerald-600 text-shadow flex justify-between items-center gap-5 rounded-full px-5 h-14"
            >
                <div className="flex gap-3 items-center">
                    <Image src='/images/icons/email.svg' alt="contact number" className="w-8 h-8" width={32} height={32} />
                    <p className="text-sm block"> ایمیل </p>
                </div>

                <span dir="ltr"> {emailAddress} </span>

            </Link>}
        </div>
    )
}

export default Contacts;