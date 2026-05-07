import CheckoutSection from "@/components/cart/CheckoutSection";
import Location from "@/components/icons/Location";
import Steps from "@/components/payment/Steps";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { setHeaderParams } from "@/redux/pages";
import { useEffect } from "react";

export default function CheckoutPage() {
    
  const { cartGeneralInfo } = useAppSelector((state) => state.cart);

  const dispatch = useAppDispatch();

    useEffect(()=>{
  
      dispatch(setHeaderParams({
        headerParams:{
          logo: true,
          backLink:"/cart"
        }
      }));
  
      return(()=>{
        dispatch(setHeaderParams({headerParams: undefined}));
      })
  
    },[]);

    const hasPhysicalItem = cartGeneralInfo && cartGeneralInfo.items.find(item => !item.variant.isVirtual);

  return (
    <>
      <Steps activeStepKey="checkout" />
      {!!hasPhysicalItem && (
        <div className="px-5">
          <div className="text-black bg-gradient-yellow flex items-center p-5 gap-3 lg:max-w-[1000px] lg:mx-auto rounded-2xl mb-10 max-lg:mt-5">
            <Location className="w-7 h-7 fill-red-600" />
            <div>
              <strong className="text-sm block mb-1"> هماهنگی آدرس گیرنده با تماس تلفنی به شما </strong>
              <p className="text-xs"> پس از ثبت سفارش، برای هماهنگی آدرس با شما تماس می گیریم. </p>
            </div>
          </div>
        </div>
      )}
      <CheckoutSection />
    </>
  );
}