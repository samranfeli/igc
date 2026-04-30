/* eslint-disable  @typescript-eslint/no-explicit-any */

import {
  getAllTransactionsToExcel,
  getTransactionDeposit,
} from "@/actions/payment";
import ProfileSideBar from "@/components/authentication/profile/ProfileSideBar";
import TransactionItem from "@/components/authentication/profile/transactions/TransactionItem";
import TransactionsFilter from "@/components/authentication/profile/transactions/TransactionsFilter";
import ArrowRight from "@/components/icons/ArrowRight";
import Download from "@/components/icons/Download";
import Filter from "@/components/icons/Filter";
import Loading from "@/components/icons/Loading";
import ModalPortal from "@/components/shared/layout/ModalPortal";
import Pagination from "@/components/shared/Pagination";
import Skeleton from "@/components/shared/Skeleton";
import { ServerAddress } from "@/enum/url";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { Transaction } from "@/types/payment";
import Link from "next/link";
import { useEffect, useState } from "react";

const Transactions = () => {
  const {isDesktop} = useIsDesktop();

  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadExcelLoading, setDownloadExcelLoading] =
    useState<boolean>(false);
  const [openFilters, setOpenFilters] = useState<boolean>(false);
  const [slideInFilters, setSlideInFilters] = useState<boolean>(false);
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [filterType, setFilterType] = useState<string[]>([]);

  useEffect(() => {
    if (openFilters) {
      setSlideInFilters(true);
    }
  }, [openFilters]);

  useEffect(() => {
    if (!slideInFilters) {
      setTimeout(() => {
        setOpenFilters(false);
      }, 300);
    }
  }, [slideInFilters]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async (t: string, p: number) => {
      const MaxResultCount = 10;
      const SkipCount = (p - 1) * 10;

      setLoading(true);
      const response: any = await getTransactionDeposit(
        {
          CurrencyType: "IRR",
          MaxResultCount: MaxResultCount,
          SkipCount: SkipCount,
          CreationTimeFrom: filterStartDate,
          CreationTimeTo: filterEndDate,
          Type: filterType,
        },
        t,
      );
      if (response?.data?.result) {
        setTransactions(response.data.result.items);
        setTotalCount(response.data.result.totalCount);
      }
      setLoading(false);
    };

    const token = localStorage?.getItem("Token");
    if (token && page) {
      fetchData(token, page);
    }
  }, [page, filterEndDate, filterStartDate, filterType]);

  const downloadExcel = async () => {
    const token = localStorage?.getItem("Token");
    if (token) {
      setDownloadExcelLoading(true);
      const response: any = await getAllTransactionsToExcel(token);
      setDownloadExcelLoading(false);
      if (response.data?.result?.fileToken) {
        const url = `${ServerAddress.Type}${ServerAddress.Payment}/File/DownloadTempFile?fileName=${response.data.result.fileName}&fileType=${response.data.result.fileType}&fileToken=${response.data.result.fileToken}`;
        const a = document.createElement("a");
        a.href = url;
        a.click();
      }
    }
  };

  let modalWrapperClass = `bg-white dark:bg-[#192a39] text-neutral-800 dark:text-white rounded-t-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full safePadding-b transition-all left-0 right-0 ${slideInFilters ? "bottom-0" : "-bottom-[80vh]"}`

  if (isDesktop) {
      modalWrapperClass = `bg-white dark:bg-[#192a39] text-neutral-800 dark:text-white rounded-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full max-w-md transition-all top-1/2 right-1/2 translate-x-1/2 ${slideInFilters ? "-translate-y-1/2 opacity-100" : "translate-y-0 opacity-0"}`
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-5 relative max-w-[1000px] mx-auto px-3.5 lg:px-5">
        <div className="max-lg:hidden relative">
          <div className="lg:sticky lg:top-[100px] lg:mb-6">
            {isDesktop && <ProfileSideBar activeItem="wallet" />}
          </div>
        </div>
        <div className="lg:mt-4 lg:col-span-2 lg:sticky lg:top-5">
          <header className="flex items-center justify-between gap-5 mt-4 lg:mt-1 mb-5">
            <div className="flex items-center gap-5">
              <Link href="/profile/wallet" className="w-6 h-6 lg:hidden">
                <ArrowRight />
              </Link>
              <span className="lg:font-semibold lg:text-[#ff7189] text-xs lg:text-sm">
                تراکنش های من
              </span>
            </div>
            <button
              type="button"
              className="flex gap-1 items-center semibold outline-none text-xs"
              onClick={downloadExcel}
            >
              {downloadExcelLoading ? (
                <Loading className="w-5 h-5 fill-current animate-spin" />
              ) : (
                <Download className="w-5 h-5 fill-current" />
              )}
              خروجی اکسل
            </button>
          </header>

          <div className="lg:py-5 lg:mb-6 lg:border lg:border-neutral-300 dark:lg:border-white/15 lg:p-4 lg:rounded-xl">
            <div className="max-lg:pb-5">
              <button
                type="button"
                className="inline-flex gap-3 mb-3 border border-neutral-300 dark:border-white/25 rounded-full px-4 py-1.5 text-sm"
                onClick={() => {
                  setOpenFilters(true);
                }}
              >
                <Filter className="w-5 h-5 fill-current" />
                فیلترها
              </button>

              {loading && (
                <>
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      className="grid grid-cols-6 gap-2 items-center"
                      key={item}
                    >
                      <Skeleton
                        type="image"
                        className="rounded-full w-12 h-12"
                        dark
                      />
                      <div className="col-span-5 w-full border-b py-6 border-white/25">
                        <Skeleton className="h-3 w-full mb-3" dark />
                        <Skeleton className="h-3 w-full" dark />
                      </div>
                    </div>
                  ))}
                </>
              )}

              {transactions.map((item) => (
                <TransactionItem transaction={item} key={item.id} />
              ))}

              {!transactions.length && (
                <div className="text-sm p-4">تراکنشی یافت نشد.</div>
              )}
              {totalCount > 10 && (
                <Pagination
                  onChange={setPage}
                  totalItems={totalCount}
                  currentPage={page}
                  itemsPerPage={10}
                  wrapperClassName="my-5"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <ModalPortal show={openFilters} selector="modal_portal">
        <div
          className="bg-black/50 backdrop-blur-sm fixed top-0 left-0 right-0 bottom-0"
          onClick={() => {
            setSlideInFilters(false);
          }}
        />

        <div className={modalWrapperClass}>
          <TransactionsFilter
            filterType={filterType}
            filterEndDate={filterEndDate}
            filterStartDate={filterStartDate}
            onFilter={(values) => {
              setFilterStartDate(values.startDate);
              setFilterEndDate(values.endDate);
              setFilterType(values.types);
              setOpenFilters(false);
            }}
            close={() => {
              setOpenFilters(false);
            }}
          />
        </div>
      </ModalPortal>
    </>
  );
};

export default Transactions;
