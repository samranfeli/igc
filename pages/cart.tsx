/* eslint-disable  @typescript-eslint/no-explicit-any */

import { useCartApi } from "@/actions/cart";
import CartCard from "@/components/cart/CartCard";
//import CartSection from "@/components/cart/CartSection";
import Home from "@/components/icons/Home";
import Steps from "@/components/payment/Steps";
import SimplePortal from "@/components/shared/layout/SimplePortal";
import LoadingFull from "@/components/shared/LoadingFull";
import Skeleton from "@/components/shared/Skeleton";
import { numberWithCommas } from "@/helpers";
import { getCurrencyLabelFa } from "@/helpers/currencyLabel";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { setGeneralCartInfo, setGeneralCartLoading } from "@/redux/cartSlice";
import { setHeaderParams } from "@/redux/pages";
import { CreateOrderParams } from "@/types/commerce";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

export default function CartPage() {

  const userInfo = useAppSelector((state) => state.authentication.user);;

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const { cartGeneralInfo, loading, error } = useAppSelector((state) => state.cart);
  const items = cartGeneralInfo?.items;
  const currencyStore = useAppSelector((state) => state.cart.currency);
  
  const currency =
      getCurrencyLabelFa(cartGeneralInfo?.items?.[0]?.variant.currencyType) ||
      getCurrencyLabelFa(currencyStore);

      
  const {isDesktop} = useIsDesktop();

  useEffect(()=>{
    dispatch(setHeaderParams({
      headerParams:{
        logo: true
      }
    }));

    return(()=>{
      dispatch(setHeaderParams({headerParams: undefined}));
    })
  },[]);

  const { createOrder, getCart } = useCartApi();

  const getGeneralCartData = async () => {
    dispatch(setGeneralCartLoading(true));
    const response: any = await getCart();
    if (response?.result) {
      dispatch(setGeneralCartInfo(response.result));
    }
    dispatch(setGeneralCartLoading(false));
  };

  const handleCart = async () => {
      
    setIsSubmitting(true);

    if (!userInfo || !userInfo.lastName) {
      router.push("/checkout");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("Token") : null;

    if (!token) return;

    try {

      let basaCookie ="";
      let utmSourceName="";
      const cookies = decodeURIComponent(document?.cookie).split(';');
      for (const item of cookies) {
          if (item.includes("basaUserToken=")) {
              basaCookie = item.split("=")[1];
          }
          if (item.includes("utmSourceName=")) {
              utmSourceName = item.split("=")[1];
          }
      }

      const params : CreateOrderParams = {
          gender: userInfo?.gender || false,
          email: userInfo?.emailAddress,
          firstName: userInfo?.firstName,
          lastName: userInfo?.lastName,
          phoneNumber: userInfo?.phoneNumber
      };

      if ( basaCookie){
          params.metaSearchName = "basa";
          params.metaSearchKey = basaCookie;
      }
      if ( utmSourceName){
          params.metaSearchName = utmSourceName;
      }

      const res: any = await createOrder(params);
               
      const orderId = res.data?.result?.id;
      const orderNumber = res.data?.result?.orderNumber;

      await getGeneralCartData();

      if (orderNumber && orderId) {
        router.push(`/payment?orderNumber=${orderNumber}&orderId=${orderId}`);
      } 
      
    } catch (error) {
      console.error("Error creating order:", error);
      setIsSubmitting(false);
    } finally {
    }
  };


  const cartIsEmpty = !loading && (!cartGeneralInfo || !Array.isArray(items) || items.length === 0);

  let cartContent : ReactNode = (
    <>
      <div className="flex items-center justify-between gap-2.5">
        <div>
          <span className="text-[#fd7e14] dark:text-[#FFE59A] leading-8 font-bold ml-2.5">
            سبد خرید شما
          </span>
          {items && items.length && (
            <span className="text-[13px] font-medium">
              {cartGeneralInfo?.totalQuantity}
              محصول
            </span>
          )}
        </div>

        <Image src="/images/icons/2color/menu.svg" alt="menu" width="24" height="24" className="lg:hidden" />
      </div>

      {items?.map((item, index:number)=>(
        <CartCard  key={item.id} item={item} loading={loading} isFirst={!index} />
      ))}

      <div
        className={`transition-opacity duration-700 ease-in-out ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {!!cartGeneralInfo?.items?.length && !isDesktop && (
          <div className="mt-4 flex flex-col gap-[30px] justify-between">
            {!!cartGeneralInfo.totalItemsPrice && <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-[#BBBBBB]">
                قیمت کالاها ({cartGeneralInfo?.totalQuantity})
              </span>
              <span className="font-bold">
                {numberWithCommas(cartGeneralInfo.totalItemsPrice)} {currency}
              </span>
            </div>}

            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-[#BBBBBB]">مبلغ قابل پرداخت</span>
              <span className="font-bold">
                {numberWithCommas(cartGeneralInfo.payableAmount)} {currency}
              </span>
            </div>

            {!!cartGeneralInfo.profitAmount && <div className="flex items-center justify-between">
              <span className="bg-gradient-to-t from-[#FD5900] to-[#FFDE00] bg-clip-text text-transparent font-bold drop-shadow">
                سود شما از خرید
              </span>
              <span className="bg-gradient-to-t from-[#FD5900] to-[#FFDE00] bg-clip-text text-transparent font-bold drop-shadow">
                {numberWithCommas(cartGeneralInfo.profitAmount)} {currency}
              </span>
            </div>}
          </div>
        )}
      </div>

      {!!cartGeneralInfo?.items?.length && (
        <SimplePortal selector="fixed_bottom_portal">
          <footer className="min-h-20 fixed bottom-0 z-10 left-0 right-0 bg-white dark:bg-[#192a39] px-4 py-3 flex flex-wrap justify-between gap-3 items-center w-full transition-all duration-200 lg:hidden">
        
            <button
              type="button"
              className="bg-violet-500 hover:bg-violet-600 text-white text-center rounded-full px-4 py-3 text-xs flex gap-2 items-center justify-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCart}
              disabled={isSubmitting}
            >
              {isSubmitting ? "در حال ثبت..." : "تایید و ثبت سفارش"}
            </button>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-[#011425] dark:text-gray-300">مبلغ قابل پرداخت</span>
              <span className="font-bold text-lg text-[#011425] dark:text-white">
                {numberWithCommas(cartGeneralInfo?.payableAmount) || 0}{" "}
                {currency}
              </span>
            </div>
            
          </footer>
          <div className="h-20 lg:hidden" />
        </SimplePortal>
      )}

    </>

  )

  if (
    !loading &&
    (!cartGeneralInfo || !Array.isArray(items) || items.length === 0)
  ) {
    cartContent = (
      <div className="flex flex-col max-lg:cart-min-h justify-center lg:p-5 lg:mb-7 lg:min-h-96 items-center max-w-[1000px] mx-auto lg:rounded-2xl lg:bg-gradient-to-t lg:from-[#eaeaea] lg:dark:from-[#182a38] lg:to-transparent">
        <Image
          width={90}
          height={90}
          src="/images/icons/2color/empty-cart.svg"
          alt="empty"
          className="lg:w-12"
        />
        <p className="font-extrabold text-xl text-[#FF163E] mt-5">
          سبد خرید شما خالی است!
        </p>
        <Link href="/" className="w-full">
          <button className="bg-gradient-orange text-xs text-white h-11 max-lg:w-full lg:w-64 mx-auto rounded-full mt-5 flex gap-3 items-center justify-center">
            <Home className="w-5 h-5 fill-current" />
            بازگشت به فروشگاه
          </button>
        </Link>
      </div>
    );
  }

    if(!loading && error){
    cartContent = (
      <div className="flex flex-col justify-center items-center ">
        <p className="font-extrabold text-xl text-red-500 mt-5">خطا در دریافت اطلاعات سبد خرید</p>
        <p className="text-sm text-gray-400 mt-2">{String(error)}</p>
      </div>
    )
  }


    if (loading || loading ) {
    cartContent =  [1, 2].map((x) => (
      <div className="mt-3" key={x}>
        <Skeleton className="h-3 w-24 mb-5" dark />
        <div className="flex gap-5 mb-5">
          <Skeleton type="image" dark className="rounded-2xl w-28 h-28" />
          <div className="pt-4">
            <Skeleton className="h-3 w-32 mb-5" dark />
            <Skeleton className="h-3 w-24 mb-3" dark />
            <Skeleton className="h-3 w-24 mb-3" dark />
          </div>
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-8 w-36" dark />
          <Skeleton className="h-3 w-24 mb-3" dark />
        </div>
        <hr className="my-6 border-[#192b39]/50"/>
      </div>
    ));
  }

  return (
    <>
      {isSubmitting && (
        <LoadingFull />
      )}
      <Head>
        <title>سبد خرید | فروشگاه</title>
      </Head>

      <Steps activeStepKey="cart" />

      <div className="p-4 xl:p-5 grid grid-cols-1 lg:grid-cols-3 gap-x-5 relative max-w-[1000px] mx-auto lg:px-4">
        <div className={cartIsEmpty?"lg:col-span-3":"lg:col-span-2"}>
          {cartContent}
        </div>

        {!!cartGeneralInfo?.items?.length && <div 
          className='max-lg:hidden flex flex-col gap-3 justify-end p-4 xl:p-5 rounded-2xl bg-gradient-to-t from-[#eaeaea] dark:from-[#182a38] to-transparent min-h-[350px]' 
        >            
          {!!cartGeneralInfo.totalItemsPrice && <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-[#BBBBBB]">
              قیمت کالاها ({cartGeneralInfo?.totalQuantity})
            </span>
            <span className="font-bold">
              {numberWithCommas(cartGeneralInfo.totalItemsPrice)} {currency}
            </span>
          </div>}

          {!!cartGeneralInfo.profitAmount && <div className="flex items-center justify-between">
            <span className="bg-gradient-to-t from-[#FD5900] to-[#FFDE00] bg-clip-text text-transparent font-bold drop-shadow">
              سود شما از خرید
            </span>
            <span className="bg-gradient-to-t from-[#FD5900] to-[#FFDE00] bg-clip-text text-transparent font-bold drop-shadow">
              {numberWithCommas(cartGeneralInfo.profitAmount)} {currency}
            </span>
          </div>}
          
          <button
            type="button"
            className="bg-violet-500 hover:bg-violet-600 text-white text-center rounded-full px-4 py-3 text-xs flex gap-2 items-center justify-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed lg:order-3 lg:mt-3"
            onClick={handleCart}
            disabled={isSubmitting}
          >
            {isSubmitting ? "در حال ثبت..." : "تایید و ثبت سفارش"}
          </button>
          
          <div className="flex max-lg:flex-col gap-1.5 lg:order-2 lg:justify-between lg:items-center">
            <span className="text-sm text-[#011425] dark:text-gray-300">مبلغ قابل پرداخت</span>
            <span className="font-bold text-lg text-[#011425] dark:text-white">
              {numberWithCommas(cartGeneralInfo?.payableAmount) || 0}
              {currency}
            </span>
          </div>             

        </div>}
      </div>

    </>
  );
}