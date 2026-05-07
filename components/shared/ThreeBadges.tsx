import { ReactNode } from "react";
import Spark from '@/components/icons/Spark';
import BadgeMark from '@/components/icons/BadgeMark';
import PhoneLinear from '@/components/icons/PhoneLinear';

const ThreeBadges = () => {

    const Items : {
        title:string;
        subtitle: string;
        icon: ReactNode;
    }[] = [
        {
            title:"اصالت و امنیت",
            subtitle:"اکانت ها و خدمات ارائه شده کاملا قانونی و مطمئن هستند.",
            icon:<BadgeMark className="w-9 h-9 fill-current shrink-0 grow-0" />
        },
        {
            title:"تحویل سریع",
            subtitle:"خرید آسان و دریافت فوری اکانت ها و اشتراک های دیجیتال.",
            icon:<Spark className="w-9 h-9 fill-current shrink-0 grow-0" />
        },
        {
            title:"پشتیبانی حرفه ای",
            subtitle:"تیم ما همیشه آماده راهنمایی و حل مشکلات کاربران است.",
            icon:<PhoneLinear className="w-9 h-9 fill-current shrink-0 grow-0" />
        }
    ];

    return(
        Items.map(item =>(
            <div 
                key={item.title}
                className="flex gap-4 items-center py-2"
            >
                {item.icon}
                
                <div className="grow">
                    <strong className="text-sm font-semibold mb-1 block"> {item.title} </strong>
                    <p className="text-xs text-[#10923d] dark:text-teal-500 lg:text-teal-500"> {item.subtitle} </p>
                </div>

            </div>
        ))
    )
}

export default ThreeBadges;