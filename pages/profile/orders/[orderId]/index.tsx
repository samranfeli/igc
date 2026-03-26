/* eslint-disable  @typescript-eslint/no-explicit-any */

import { getOrderById } from "@/actions/commerce";
import OrderDetailItem from "@/components/authentication/profile/Orders/OrderDetailItem";
import OrderTransactions from "@/components/authentication/profile/Orders/OrderTransactions";
import ProfileSideBar from "@/components/authentication/profile/ProfileSideBar";
import ArrowRight from "@/components/icons/ArrowRight";
import Skeleton from "@/components/shared/Skeleton";
import { numberWithCommas, toPersianDigits } from "@/helpers";
import { getCurrencyLabelFa } from "@/helpers/currencyLabel";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useAppDispatch } from "@/hooks/use-store";
import { setHeaderParams } from "@/redux/pages";
import { OrderDetail } from "@/types/commerce";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

const OrderDeatil: NextPage = () => {
  const [orderDetail, setOrderDetail] = useState<undefined | OrderDetail>();
  const [fetchingOrder, setFetchingOrder] = useState<boolean>(false);

  const router = useRouter();

  const dispatch = useAppDispatch();

  const { orderId } = router.query;

  useEffect(() => {
    dispatch(
      setHeaderParams({
        headerParams: {
          logo: true,
        },
      }),
    );

    return () => {
      dispatch(setHeaderParams({ headerParams: undefined }));
    };
  }, []);

  useEffect(() => {
    const fetchData = async (id: number) => {
      const userToken = localStorage.getItem("Token");

      if (!userToken) return;
      setFetchingOrder(true);
      const response: any = await getOrderById({ id: id, token: userToken });
      if (response.data?.result) {
        setOrderDetail(response.data.result);
      }
      setFetchingOrder(false);
    };

    if (orderId) {
      fetchData(+orderId);
    }
  }, [orderId]);

  let creationTimeString: ReactNode = toPersianDigits(
    orderDetail?.creationTime || "-",
  );

  if (orderDetail?.creationDateStr) {
    creationTimeString = toPersianDigits(orderDetail.creationDateStr);

    if (orderDetail.creationTimeStr) {
      creationTimeString += ` - ${toPersianDigits(orderDetail.creationTimeStr)}`;
    }
  }

  if (fetchingOrder) {
    creationTimeString = <Skeleton className="h-3 w-12" dark />;
  }

  const pairItems: { label: string; value: ReactNode }[] = [
    {
      label: "شماره سفارش",
      value: fetchingOrder ? (
        <Skeleton className="h-3 w-12" dark />
      ) : (
        orderDetail?.id.toString() || "-"
      ),
    },
    {
      label: "تاریخ ثبت سفارش",
      value: <span dir="ltr"> {creationTimeString} </span>,
    },
    {
      label: "قیمت کالاها",
      value: fetchingOrder ? (
        <Skeleton className="h-3 w-12" dark />
      ) : orderDetail?.payableAmount ? (
        `${numberWithCommas(orderDetail.totalItemsPrice)} ${getCurrencyLabelFa(orderDetail.currencyType)}`
      ) : (
        "-"
      ),
    },
    {
      label: "سود شما از خرید",
      value: fetchingOrder ? (
        <Skeleton className="h-3 w-12" dark />
      ) : orderDetail?.profitAmount ? (
        `${numberWithCommas(orderDetail.profitAmount + Math.abs(orderDetail.totalDiscountPrice || 0))} ${getCurrencyLabelFa(orderDetail.currencyType)}`
      ) : (
        "-"
      ),
    },
    {
      label: "مبلغ قابل پرداخت ",
      value: fetchingOrder ? (
        <Skeleton className="h-3 w-12" dark />
      ) : orderDetail?.payableAmount ? (
        `${numberWithCommas(orderDetail.payableAmount)} ${getCurrencyLabelFa(orderDetail.currencyType)}`
      ) : (
        "-"
      ),
    },
    {
      label: "نوع پرداخت",
      value: fetchingOrder ? (
        <Skeleton className="h-3 w-12" dark />
      ) : (
        orderDetail?.paymentStatus || "-"
      ),
    },
  ];

  const {isDesktop} = useIsDesktop();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-5 relative max-w-[1000px] mx-auto px-3.5 lg:px-5">
      <div className="max-lg:hidden relative">
        <div className="lg:sticky lg:top-[100px]">
          {isDesktop && <ProfileSideBar activeItem="orders" />}
        </div>
      </div>
      <div className="lg:mt-4 lg:col-span-2 lg:sticky lg:top-5">
        <div className="max-lg:hidden lg:flex lg:items-center lg:gap-2 font-semibold mt-1 mb-5">
          <Link href="/profile/orders" className="block mt-1"> <ArrowRight className="w-5 h-5 fill-current" /> </Link>
          <span className="text-[#ff7189]"> جزییات سفارش </span>
        </div>

        <div className="lg:mb-6 lg:py-5 lg:border lg:border-neutral-300 dark:lg:border-white/15 lg:p-4 lg:rounded-xl">
          {orderDetail?.items.find(x => x.allowNewLoginSubmission) ? (
            <div className="bg-[#e8ecf0] dark:bg-[#192a39] px-5 py-3 text-xs text-center ">
              <Image
                src="/images/icons/sand-clock.svg"
                alt="sand clock"
                width={24}
                height={24}
                className="w-6 h-6 inline-block ml-2"
              />
              لطفاً اطلاعات اکانت بازی خود را برای ادامه فرایند وارد کنید.
            </div>
          ):null}
          
          <div className="p-5">
            {pairItems.map((item) => (
              <div key={item.label} className="flex justify-between mb-3 text-sm">
                <label> {item.label} </label>
                <div className="font-semibold"> {item.value} </div>
              </div>
            ))}

            {orderId && <OrderTransactions orderId={+orderId} />}

            {!!orderId &&
              orderDetail?.items?.map((item) => (
                <OrderDetailItem
                  key={item.id}
                  itemData={item}
                  orderId={+orderId}
                />
              ))}

            {orderDetail?.status === "Pending" && (
              <>
                {/* <div className="my-3 text-xs text-amber-600 dark:text-amber-400"> 
                          <Image src={"/images/icons/error.svg"} alt="warning icon" className="w-5 h-5 object-contain inline-block align-middle ml-2" width={25} height={25} />
                          سفارش در صورت عدم پرداخت تا ۲۵ دقیقه دیگر لغو خواهد شد
                      </div> */}
                <Link
                  href={`/payment?orderNumber=${orderDetail.orderNumber}&orderId=${orderDetail.id}`}
                  className="block text-center bg-gradient-violet text-white rounded-full px-3 w-full text-sm py-3 my-3"
                >
                  پرداخت {numberWithCommas(orderDetail.payableAmount)}{" "}
                  {getCurrencyLabelFa(orderDetail.currencyType || "IRR")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDeatil;
