import Image from "next/image";
import React from "react";

type Props = {
    wrapperClassName?: string;
}
const SnappPayBadge:React.FC<Props> = props => (
  <div className={`p-5 rounded-xl mt-5 flex gap-5 items-center ${props.wrapperClassName || ""}`}>
    <Image
      src="/images/snapp-pay.jpg"
      alt="snapp"
      className="w-14 h-14 rounded-md"
      width={56}
      height={56}
    />
    <div>
      <strong className="block text-sm font-semibold mb-2">
        پرداخت قسطی با اسنپ پی
      </strong>
      <p className="text-[#10923d] dark:text-teal-500 lg:text-teal-500 text-xs">
        میتوانید مبلغ را در پایان ماه یا در ۴ قسط جداگانه پرداخت کنید.
      </p>
    </div>
  </div>
);
export default SnappPayBadge;
