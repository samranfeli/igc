/* eslint-disable  @typescript-eslint/no-explicit-any */

import { getOrderById } from "@/actions/commerce";
import { getBanksGateways, makeTokenByAmount, registerDiscount, removeDiscount } from "@/actions/payment";
import Gateways from "@/components/payment/Gateways";
import PaymentByDeposit from "@/components/payment/PaymentByDeposit";
import PromoCode from "@/components/payment/PromoCode";
import Steps from "@/components/payment/Steps";
import SimplePortal from "@/components/shared/layout/SimplePortal";
import LoadingFull from "@/components/shared/LoadingFull";
import { ServerAddress } from "@/enum/url";
import { numberWithCommas } from "@/helpers";
import { getCurrencyLabelFa } from "@/helpers/currencyLabel";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { setReduxError } from "@/redux/errorSlice";
import { setHeaderParams } from "@/redux/pages";
import { GatewayGroupItem } from "@/types/payment";
import { Skeleton } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PaymentPage() {

  const {isDesktop} = useIsDesktop();

  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const orderId = searchParams.get("orderId");

  const [goToBankLoading, setGoToBankLoading] = useState(false);

  interface OrderDetail {
    currencyType: "IRR" | string;
    creationTime: string;
    firstName?: string;
    gender: boolean;
    id: number;
    items: any[];
    totalDiscountPrice?: number;
    lastName?: string;
    orderNumber: string;
    payableAmount: number;
    paymentStatus: "None";
    phoneNumber: "+989374755674";
    profitAmount: number;
    profitPercent: number;
    specialRequest?: unknown;
    status: "Pending" | string;
    tenantId: number;
    totalItemsPrice: number;
    totalQuantity: number;
    totalBasePrice?: number;
    totalTaxPrice?: number;
    totalServicePrice?: number;
    
  }
  const [orderData, setOrderData] = useState<OrderDetail>();

  const [depositIsSelected, setDepositIsSelected] = useState(false);

  const [selectedGatewayId, setSelectedGatewayId] = useState<number>();
  const [gateways, setGateways] = useState<GatewayGroupItem[]>();
  const [getGatewaysLoading, setGetGatewaysLoading] = useState<boolean>(false);

  const router = useRouter();

  const balance = useAppSelector(state => state.authentication.balance);
  const balanceLoading = useAppSelector(state => state.authentication.balanceLoading);
  const getUserLoading = useAppSelector(state => state.authentication.getUserLoading);
  const balanceCurrency = useAppSelector(state => state.authentication.balanceCurrency);

  const [discountData, setDiscountData] = useState<any>();
  const [discountLoading, setDiscountLoading] = useState<boolean>(false);
  const [removeDiscountLoading, setRemoveDiscountLoading] = useState<boolean>(false);

  useEffect(()=>{
    if(gateways?.length){
      setSelectedGatewayId(gateways[0]?.gateways?.[0]?.id);
    }
  },[gateways?.length]);


    const fetchOrder = async (id: string, token: string) => {
      
      if(!token){
        router.push("/");
      }

      const response: any = await getOrderById({
        id: +id,
        currency: "IRR",
        token: token
      });

      setOrderData(response?.data?.result);
    };

  useEffect(() => {


    const token = localStorage.getItem("Token");

    if (orderId && token) {
      fetchOrder(orderId, token);
    }

    const fetchBanks = async (orderId: number, orderNumber: string) => {
      const token = localStorage.getItem("Token");
      if (!token) return;
      setGetGatewaysLoading(true);
      const response: any = await getBanksGateways(
        {
          reserveId: orderId,
          username: orderNumber,
          token: token,
        },
        "fa-IR"
      );

      if (response.data?.result) {
        setGateways(response.data.result);
      }
      setGetGatewaysLoading(false);
    };

    if (orderId && orderNumber) {
      fetchBanks(+orderId, orderNumber as string);
    }


  }, [orderId, orderNumber]);
  
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

  let requiredAmount: number = orderData?.payableAmount || 0;

  let withdrawFromWallet = 0;

  const isTheSameCurrency = balanceCurrency === orderData?.currencyType;

  if(isTheSameCurrency && balance && depositIsSelected && orderData?.payableAmount){
    if (balance >= orderData.payableAmount){
      requiredAmount = 0;
      withdrawFromWallet = orderData.payableAmount;
    }else{
      requiredAmount = orderData?.payableAmount - balance;
      withdrawFromWallet = balance;
    }
  }

  const onSubmit = async () => {
    setGoToBankLoading(true);
    
    if(withdrawFromWallet && !requiredAmount){
      router.push(`/confirm?deposite=true&orderNumber=${orderNumber}&orderId=${orderId}`);
    }else{
      
      const callbackUrl = window?.location?.origin + "/confirm";

      const token = localStorage.getItem("Token");
      
      if(!selectedGatewayId || !orderId || !token) return;

      const response: any = await makeTokenByAmount({
        amount:requiredAmount < 30000 ? 30000 : requiredAmount,
        callBackUrl:callbackUrl,
        currencyType:"IRR",
        gatewayId: +selectedGatewayId,
        ipAddress:1,
        reserveId: +orderId
      }, token);

      debugger;
      console.log(response);
      debugger;
      
      if (response?.status == 200) {
        const url = `https://${ServerAddress.Payment}/fa-IR/Reserves/Payment/PaymentRequest?tokenId=${response.data.result.tokenId}`;         
        router.push(url);
      } else {
          
        const errorMessage = response?.response?.data?.error?.message;
        dispatch(setReduxError({
            message: errorMessage || "ارسال اطلاعات ناموفق",
            isVisible: true
        }));

        setGoToBankLoading(false);
      }


      
      //makeTokenByAmount
      //goToBank
    }
  }

  const submitDiscountCode = async (code : string) => {
    
    const userToken = localStorage.getItem("Token");        
    
    if(!code?.length || !userToken || !orderId || !orderNumber ) return;

    setDiscountData(undefined);
    setDiscountLoading(true);

    const response: any = await registerDiscount({
        promoCode:code,
        reserveId:orderId,
        username:orderNumber
    },userToken);


    if (response?.data?.result) {
      setDiscountData(response.data.result);
      
      fetchOrder(orderId, userToken);

    } else if (response?.data?.error) {
      setDiscountData(response.data?.error);
    }
    setDiscountLoading(false);

  }

  const removeDiscountHandle = async () => {
    
    const userToken = localStorage.getItem("Token");        
    
    if(!userToken || !orderId || !orderNumber ) return;
    
    setRemoveDiscountLoading(true);

    const response: any = await removeDiscount({
        reserveId:orderId,
        username:orderNumber,
        token: userToken
    });

    if (response?.data?.success) {
      setDiscountData(undefined);
      fetchOrder(orderId, userToken);
    }

    setRemoveDiscountLoading(false);

  }
  
  return (
    <>

      {goToBankLoading && (
        <LoadingFull
          details={{
            title:"در حال پرداخت از کیف پول",
            description:"لطفا صبر کنید ..."
          }}
        />
      )}

      <Steps activeStepKey="payment" />

      <div className="p-4 xl:p-5 grid grid-cols-1 lg:grid-cols-3 gap-x-5 relative max-w-[1000px] mx-auto lg:px-4">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold my-4 text-[#fd7e14] dark:text-[#ffefb2]">
            انتخاب روش پرداخت
          </h2>

          {!!(orderId && orderNumber) && (
            <Gateways 
              gateways={gateways}
              getGatewaysLoading={getGatewaysLoading}
              selectedGatewayId={selectedGatewayId}
              onSelectGateway={setSelectedGatewayId}
            />
          )}

          {(orderData && !getUserLoading && !balanceLoading) ? (
            <PaymentByDeposit 
              onSelect={()=>{setDepositIsSelected(prevState => !prevState)}} 
              isSelected={depositIsSelected} 
            /> 
          ):(
            <div>
              <Skeleton className="w-24 h-4 mb-6" />
            </div>
          )}
          
          <PromoCode 
            onRemoveAddedCode={removeDiscountHandle}
            onSubmit={submitDiscountCode}
            loading={discountLoading}
            data={discountData}
            orderTotalDiscountPrice = {orderData?.totalDiscountPrice}
            onChangeText={()=>{setDiscountData(undefined)}}
            removeDiscountLoading={removeDiscountLoading}
          />

          {!!orderData?.totalBasePrice && (
            <div className="text-sm flex gap-3 items-center justify-between mt-5">
              <label className="text-xs">
                قیمت پایه
              </label>
              <span className="font-semibold">
                {numberWithCommas(orderData.totalBasePrice)} ریال
              </span>
            </div>
          )}
          
          {!!orderData?.totalTaxPrice && (
            <div className="text-sm flex gap-3 items-center justify-between mt-5">
              <label className="text-xs">
                مالیات
              </label>
              <span className="font-semibold">
                {numberWithCommas(orderData.totalTaxPrice)} ریال
              </span>
            </div>
          )}

          {!!orderData?.totalServicePrice && (
            <div className="text-sm flex gap-3 items-center justify-between mt-5">
              <label className="text-xs">
                هزینه خدمات
              </label>
              <span className="font-semibold">
                {numberWithCommas(orderData.totalServicePrice)} ریال
              </span>
            </div>
          )}

          {!!orderData?.totalItemsPrice && <div className="text-sm flex gap-3 items-center justify-between mt-5">
            <label className="text-xs">
              قیمت کالاها ({orderData?.totalQuantity})
            </label>
            <span className="font-semibold">
              {numberWithCommas(orderData?.totalItemsPrice || 0)} ریال
            </span>
          </div>}

          {!!withdrawFromWallet && (
          <div className="text-sm flex gap-3 items-center justify-between mt-5">
            <label className="text-xs"> پرداخت از کیف پول </label>
            <span className="font-semibold">
              {numberWithCommas(withdrawFromWallet)} ریال
            </span>
          </div>
          )}

          {!!orderData?.totalDiscountPrice && <div className="text-sm flex gap-3 items-center justify-between mt-5">
            <label className="text-xs"> کد تخفیف </label>
            <span className="font-semibold">
              {numberWithCommas(Math.abs(orderData.totalDiscountPrice))} ریال
            </span>
          </div>}

          <div className="text-sm flex gap-3 items-center justify-between mt-5">
            <label className="text-xs"> مبلغ قابل پرداخت </label>
            <span className="font-semibold">
              {numberWithCommas(requiredAmount || 0) } ریال
            </span>
          </div>


          {!!(orderData?.profitAmount || orderData?.totalDiscountPrice) && <div className="text-sm flex gap-3 items-center justify-between mt-5">
            <label className="font-semibold bg-gradient-to-t from-[#FD5900] to-[#FFDE00] bg-clip-text text-transparent">
              سود شما از خرید
            </label>
            <span className="font-semibold bg-gradient-to-t from-[#FD5900] to-[#FFDE00] bg-clip-text text-transparent">
              {numberWithCommas((orderData?.profitAmount || 0) + (Math.abs(orderData?.totalDiscountPrice || 0)))} ریال
            </span>
          </div>}

        </div>

        <div 
          className='max-lg:hidden relative' 
        >
          <div id="payment-footer-desktop-modal" className="flex flex-col p-4 xl:p-5 rounded-2xl bg-gradient-to-t from-[#eaeaea] dark:from-[#182a38] to-transparent sticky top-24 min-h-60 justify-end"  />
        </div>
      </div>




      <div className="h-[104px] lg:hidden" />

      <SimplePortal selector={isDesktop?"payment-footer-desktop-modal":"fixed_bottom_portal"}>
        <footer className="min-h-20 max-lg:fixed max-lg:bottom-0 max-lg:z-10 max-lg:left-0 max-lg:right-0 max-lg:bg-white max-lg:dark:bg-[#192a39] max-lg:px-4 max-lg:py-3 flex flex-wrap justify-between gap-3 lg:flex-col max-lg:items-center w-full transition-all duration-200">
          <div className="flex w-full justify-between dark:text-white mb-2">
            <label className="text-sm"> {!requiredAmount && withdrawFromWallet ? "پرداخت از کیف پول" : "مبلغ قابل پرداخت"} </label>
            <span className="font-semibold">
              {numberWithCommas(!requiredAmount && withdrawFromWallet ? withdrawFromWallet : requiredAmount || 0)} ریال
            </span>
          </div>
          <button
            type="button"
            className="w-full p-3 font-semibold bg-[#a93aff] text-white rounded-full"
            onClick = {onSubmit}
            disabled={!selectedGatewayId && !!requiredAmount}
          >
            {`پرداخت ${numberWithCommas(orderData?.payableAmount || 0)} ${getCurrencyLabelFa(orderData?.currencyType)}`}
          </button>
        </footer>
        <div className="h-20 lg:hidden" />
      </SimplePortal>
    </>
  );
}
