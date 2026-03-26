import ProfileSideBar from "@/components/authentication/profile/ProfileSideBar";
import ArrowRight from "@/components/icons/ArrowRight";
import ArrowTopLeft from "@/components/icons/ArrowTopLeft";
import InfoIcon from "@/components/icons/icons-2-opacity/InfoIcon";
import WalletIcon from "@/components/icons/icons-2-opacity/WalletIcon";
import WalletSearch from "@/components/icons/icons-2-opacity/WalletSearch";
import Loading from "@/components/icons/Loading";
import Plus from "@/components/icons/Plus";
import { numberWithCommas } from "@/helpers";
import { getCurrencyLabelFa } from "@/helpers/currencyLabel";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useAppSelector } from "@/hooks/use-store";
import Link from "next/link";
import { ReactNode } from "react";

const Wallet = () => {
  const {isDesktop} = useIsDesktop();

  const userBalanceLoading = useAppSelector(
    (state) => state.authentication.balanceLoading,
  );
  const userBalance = useAppSelector((state) => state.authentication.balance);
  const balanceCurrency = useAppSelector(
    (state) => state.authentication.balanceCurrency,
  );

  const items: {
    label: string;
    href: string;
    svgIcon: ReactNode;
  }[] = [
    {
      href: "/profile/wallet/transactions",
      label: "تراکنش های من",
      svgIcon: (
        <WalletSearch className="w-7 h-7 fill-none stroke-current grow-0 shrink-0" />
      ),
    },
    {
      href: "/profile/wallet/faq",
      label: "سوالات متداول",
      svgIcon: (
        <InfoIcon className="w-7 h-7 fill-none stroke-current grow-0 shrink-0" />
      ),
    },
  ];

  return (
    <>
      <header className="flex items-center gap-5 p-4 text-xs lg:hidden">
        <Link href="/profile" className="w-6 h-6">
          <ArrowRight />
        </Link>
        کیف پول
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-5 relative max-w-[1000px] mx-auto px-3.5 lg:px-5">
        <div className="max-lg:hidden relative">
          <div className="lg:sticky lg:top-[100px] lg:mb-6">
            {isDesktop && <ProfileSideBar activeItem="wallet" />}
          </div>
        </div>
        <div className="lg:mt-4 lg:col-span-2 lg:sticky lg:top-5">
          <div className="max-lg:hidden font-semibold mt-1 mb-5 text-[#ff7189] text-sm">
            کیف پول
          </div>
          <div className="lg:py-5 lg:mb-6 lg:border lg:border-neutral-300 dark:lg:border-white/15 lg:p-4 lg:rounded-xl">
            <div className="px-3 py-5 bg-gradient-to-t text-white from-[#4b636f] to-[#607d8b] dark:from-[#01212e] dark:to-[#102c33] rounded-xl">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center text-xs">
                  <WalletIcon className="w-7 h-7 fill-none stroke-current grow-0 shrink-0" />
                  موجودی کیف پول
                </div>

                {userBalanceLoading ? (
                  <Loading className="w-5 h-5 fill-current" />
                ) : userBalance ? (
                  <div className="text-green-400 text-xs font-semibold">
                    {numberWithCommas(userBalance)}{" "}
                    {balanceCurrency
                      ? getCurrencyLabelFa(balanceCurrency)
                      : "ریال"}
                  </div>
                ) : (
                  <div className="text-green-400 text-xs font-semibold">
                    0
                  </div>
                )}
              </div>
              <Link
                href="/profile/wallet/charge"
                className="mt-3 h-12 rounded-full bg-gradient-to-t from-[#028d7e] to-[#99feac] text-white text-xs flex gap-2 justify-center items-center"
              >
                <Plus className="w-4 h-4 fill-current" />
                شارژ کیف پول
              </Link>
            </div>

            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex gap-3 items-center rounded-xl"
              >
                {item.svgIcon}

                <div className="grow flex justify-between items-center px-3 py-5 border-b border-neutral-300 dark:border-white/10 text-xs">
                  {item.label}
                  <ArrowTopLeft className="w-3.5 h-3.5 fill-current" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;
