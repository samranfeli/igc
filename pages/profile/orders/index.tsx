/* eslint-disable  @typescript-eslint/no-explicit-any */

import { getAllOrders, getOrdersStatistics } from "@/actions/commerce";
import OrderItem from "@/components/authentication/profile/Orders/OrderItem";
import ProfileSideBar from "@/components/authentication/profile/ProfileSideBar";
import CartOutline2 from "@/components/icons/CartOutline2";
import Home from "@/components/icons/Home";
import InfoCircleFill from "@/components/icons/InfoCircleFill";
import SearchIcon from "@/components/icons/SearchIcon";
import Pagination from "@/components/shared/Pagination";
import Skeleton from "@/components/shared/Skeleton";
import { scrollToTop, toPersianDigits } from "@/helpers";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useAppDispatch } from "@/hooks/use-store";
import { setHeaderParams } from "@/redux/pages";
import { OrderListItemType } from "@/types/commerce";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

const Orders: NextPage = () => {

  const {isDesktop} = useIsDesktop();

  type Status3 = "Canceled"|"Completed" | "InProgress";

  const [orders, setOrders] = useState<undefined | OrderListItemType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fetchingOrders, setFetchingOrders] = useState<boolean>(false);

  const [activeStatus, setActiveStatus] = useState<Status3>("InProgress");

  const [enteredText, setEnteredText] = useState<string>("");

  const [statistics, setStatistics] = useState<{
    totalRowsCanceled: number,
    totalRowsCompleted: number,
    totalRowsInProgress: number
  }>();

  const dispatch = useAppDispatch();

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

  useEffect(()=>{
    setFetchingOrders(true);
    scrollToTop();
  },[currentPage]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const handler = setTimeout(async () => {
      if (enteredText.length >= 3 || enteredText.length === 0) {
        setFetchingOrders(true);

        const userToken = localStorage.getItem("Token");
        if (!userToken) return;

        try {
          const response: any = await getAllOrders(
            {
              MaxResultCount: 10,
              SkipCount: (currentPage - 1) * 10,
              search: enteredText || "",
              status: activeStatus,
            },
            userToken,
            signal
          );

          if (response.data?.result?.items?.length) {
            setTotalCount(response.data.result.totalCount);
            setOrders(response.data.result.items || []);
          } else {
            setOrders(undefined);
          }
        } catch (error: any) {
          if (error.name === "CanceledError") {
            console.log("Previous request canceled");
          } else {
            setOrders(undefined);
          }
        } finally {
          setFetchingOrders(false);
        }
      }
    }, 500);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [enteredText, currentPage, activeStatus]);

  useEffect(()=>{

    const userToken = localStorage.getItem("Token");
    if (!userToken) return;

    const fetchStatistics = async () => {
      const response : any = await getOrdersStatistics(userToken);
      if(response.data?.result){
        setStatistics(response.data.result)
      }
    }
    fetchStatistics();
  },[]);


  const tabItems : {
    label: "لغو شده"|"انجام شده"|"جاری";
    count: number;
    status:Status3;
  }[] = [{
    label:"جاری",
    status:"InProgress",
    count:statistics?.totalRowsInProgress || 0
  },{
    label:"انجام شده",
    status:"Completed",
    count:statistics?.totalRowsCompleted || 0
  },{
    label:"لغو شده",
    status:"Canceled",
    count:statistics?.totalRowsCanceled || 0
  }];

  return (

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-5 relative max-w-[1000px] mx-auto px-3.5 lg:px-5">
      
      <div className="max-lg:hidden relative">
        <div className="lg:sticky lg:top-[100px] lg:mb-6">
          {isDesktop && <ProfileSideBar activeItem="orders" /> }
        </div>
      </div>
      <div className="lg:mt-4 lg:col-span-2 lg:sticky lg:top-5">
        <div className="max-lg:hidden font-semibold mt-1 mb-5 text-sm text-[#ff7189]"> سفارش های من </div>
        <div className="lg:py-5 lg:mb-6 lg:border lg:border-neutral-300 dark:lg:border-white/15 lg:p-4 lg:rounded-xl">
          
          <div className="relative mb-5">
            <input 
              className="w-full px-5 h-11 bg-white pr-12 dark:bg-[#192a39] border border-neutral-300 dark:border-transparent outline-none rounded-full text-sm"
              placeholder="جستجو بر اساس شماره سفارش"
              onChange={e => {setEnteredText(e.target.value)}}
              value={enteredText}
            />
            <SearchIcon className="w-6 h-6 absolute fill-current top-1/2 -mt-3 right-3" />
          </div>

          <div className="grid grid-cols-3 border-b border-neutral-300 dark:border-white/25">
            {tabItems.map(item => {
              const active = item.status === activeStatus;
              return(
              <button
                key={item.status}
                type="button"
                onClick={() => {setActiveStatus(item.status)}}
                className={`outline-none text-sm pb-3 font-semibold border-b border-b-2 ${active?"text-[#ca54ff] border-[#ca54ff]":"border-transparent text-neutral-600 dark:text-white"}`}
              >
                {item.label} <span className={`inline-flex items-center justify-center text-white w-6 h-6 rounded ${active?"bg-gradient-violet":"bg-[#aaaaaa] dark:bg-[#31404e]"}`}> {toPersianDigits((item.count || 0).toString())} </span>
              </button>
            )
            })}
          </div>

          {fetchingOrders ? 
            [1,2,3].map(item => (
            <div key={item} className="border-b border-neutral-300 dark:border-white/25 py-5">

                <div className="flex justify-between items-center mb-3">
                  <Skeleton dark className="h-5 w-14" />
                  <Skeleton dark className="h-5 w-5 rounded-full" type="button" />
                </div>

                <Skeleton dark className="w-24 h-4 mb-3" />

                <div className="flex justify-between items-center mb-3">
                  <Skeleton dark className="h-5 w-14" />
                  <Skeleton dark className="h-5 w-14" />
                </div>
                
                <Skeleton dark className="w-16 h-16 rounded-lg" type="image" />

            </div>
            )
          ): orders?.length ? 
              orders.map(order => <OrderItem key={order.id} order={order} />
          ): !orders ? (
            <div className="flex flex-col justify-center min-h-[50vh] items-center py-10 text-center text-sm font-semibold">
              <div className="relative mb-5">
                <CartOutline2 className="w-9 h-9 fill-none stroke-neutral-400 dark:stroke-white" />
                <InfoCircleFill className="w-8 h-8 fill-[#FEB906] absolute -bottom-2 -right-2" /> 
              </div>

              <h5 className="font-semibold dark:text-white mb-2">
              هنوز سفارشی ثبت نکرده اید!
              </h5>        
              
              <Link href="/" className="w-full">
                <button className="bg-gradient-orange text-xs text-white h-11 w-full rounded-full mt-5 flex gap-3 items-center justify-center">
                  <Home className="w-5 h-5 fill-current" />
                  رفتن به فروشگاه
                </button>
              </Link>

            </div>
          ) : null }

          {!!totalCount && <Pagination onChange={setCurrentPage} currentPage={currentPage} itemsPerPage={10} totalItems={totalCount} wrapperClassName="my-5" />}

        </div>
      </div>

    </div>

    
  );
}

export default Orders;