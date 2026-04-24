/* eslint-disable  @typescript-eslint/no-explicit-any */

import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { PropsWithChildren, useEffect, useState } from "react";
import { notificationUpsert } from "@/actions/commerce";
import { setBodyScrollable, setBodyScrollPosition } from "@/redux/stylesSlice";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import CloseSimple from "@/components/icons/CloseSimple";
import ModalPortal from "../ModalPortal";
import LoginWithPassword from "@/components/authentication/LoginWithPassword";
import Otp from "@/components/authentication/profile/OTP";
import Loading from "@/components/icons/Loading";
import { toPersianDigits } from "@/helpers";
import CheckboxGroup from "../../CheckboxGroup";

type Props = {
  className?: string;
  productId: number;
  variantId?: number;
  type: "ProductAvailable" | "AmazingDiscount";
  buttonClassName: string;
};

const ProductNotificationSetting: React.FC<PropsWithChildren<Props>> = (props) => {
  const {isDesktop} = useIsDesktop();

  const dispatch = useAppDispatch();

  type ValidTypes = "Email" | "Sms" | "InAppNotification";

  const [loginType, setLoginType] = useState<"otp" | "password">("otp");

  const userInfo = useAppSelector((state) => state.authentication.user);

  const [selectedTypes, setSelectedTypes] = useState<ValidTypes[]>([]);

  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [slideInForm, setSlideInForm] = useState<boolean>(false);

  useEffect(() => {
    if (openForm) {
      setSlideInForm(true);
      dispatch(setBodyScrollable(false));
      dispatch(setBodyScrollPosition(window?.pageYOffset || 0));
    } else {
      dispatch(setBodyScrollable(true));
    }
  }, [openForm]);

  useEffect(() => {
    if (!slideInForm) {
      setTimeout(() => {
        setOpenForm(false);
      }, 300);
    }
  }, [slideInForm]);

  const [startClicked, setStartClicked] = useState<boolean>(false);

  const submitHandle = async () => {
    const userToken = localStorage.getItem("Token");
    if (!userToken) return;

    setLoading(true);
    const response: any = await notificationUpsert(
      {
        channels: selectedTypes,
        productId: props.productId,
        productVariantId: props.variantId || undefined,
        type: props.type,
      },
      userToken,
    );

    setLoading(false);

    if (response.data) {
      debugger;
    }
  };

  const isAuthenticated = useAppSelector(
    (state) => state.authentication.isAuthenticated,
  );

  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const [slideInLogin, setSlideInLogin] = useState<boolean>(false);

  useEffect(() => {
    if (openLogin) {
      setSlideInLogin(true);
      dispatch(setBodyScrollable(false));
      dispatch(setBodyScrollPosition(window?.pageYOffset || 0));
    } else {
      dispatch(setBodyScrollable(true));
    }
  }, [openLogin]);

  useEffect(() => {
    if (isAuthenticated && startClicked) {
      setOpenForm(true);
      setStartClicked(false);
    }
  }, [isAuthenticated, startClicked]);

  useEffect(() => {
    if (!slideInLogin) {
      setTimeout(() => {
        setOpenLogin(false);
      }, 300);
    }
  }, [slideInLogin]);

  const clickHandle = () => {
    const userToken = localStorage.getItem("Token");
    if (userToken) {
      setOpenForm(true);
    } else {
      setStartClicked(true);
      setOpenLogin(true);
    }
  };

  let formModalWrapperClass = `bg-white dark:bg-[#192a39] text-neutral-800 pb-10 dark:text-white rounded-t-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full safePadding-b transition-all left-0 right-0 right-1/2 translate-x-1/2 ${slideInForm ? "bottom-0" : "-bottom-[80vh]"}`;
  let loginModalWrapperClass = `bg-white dark:bg-[#011425] z-[50] text-neutral-800 pb-10 dark:text-white rounded-t-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full safePadding-b transition-all left-0 right-0 right-1/2 translate-x-1/2 ${slideInLogin ? "bottom-0" : "-bottom-[80vh]"}`;

  if (isDesktop) {
    formModalWrapperClass = `bg-white dark:bg-[#192a39] text-neutral-800 pb-5 dark:text-white rounded-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full max-w-lg transition-all top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  ${slideInForm ? "-translate-y-1/2 opacity-100" : "translate-y-0 opacity-0"}`;
    loginModalWrapperClass = `bg-white dark:bg-[#011425] z-[50] text-neutral-800 pb-5 dark:text-white rounded-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full max-w-lg transition-all top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${slideInLogin ? "-translate-y-1/2 opacity-100" : "translate-y-0 opacity-0"}`;
  }

  return (
    <>
      <ModalPortal show={openLogin} selector="modal_portal">
        <div
          className="bg-black/50 backdrop-blur-sm fixed top-0 left-0 right-0 bottom-0"
          onClick={() => {
            setSlideInLogin(false);
          }}
        />

        <div className={loginModalWrapperClass}>
          <div className="pt-10">
            {loginType === "otp" ? (
              <Otp
                toggleLoginType={() => {
                  setLoginType("password");
                }}
                title={
                  <h3 className="font-semibold text-lg lg:text-xl text-[#ff7189] text-center mb-10">
                    برای ادامه
                    <br /> ورود یا ثبت‌نام در حساب کاربری لازم است.
                  </h3>
                }
                onLoginSuccess={() => {setOpenLogin(false)}}
              />
            ) : (
              <LoginWithPassword
                onLoginSuccess={() => {setOpenLogin(false)}}
                toggleLoginType={() => {
                  setLoginType("otp");
                }}
                title={
                  <h3 className="font-semibold text-lg lg:text-xl text-[#ff7189] text-center mb-10">
                    برای ادامه
                    <br /> ورود یا ثبت‌نام در حساب کاربری لازم است.
                  </h3>
                }
              />
            )}
          </div>
        </div>
      </ModalPortal>

      <ModalPortal show={openForm} selector="modal_portal">
        <div
          className="bg-black/50 backdrop-blur-sm fixed top-0 left-0 right-0 bottom-0"
          onClick={() => {
            setSlideInForm(false);
          }}
        />

        <div className={formModalWrapperClass}>
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <strong> {props.type === "ProductAvailable" ? "نحوه اطلاع رسانی موجود شدن کالا" : "نحوه اطلاع رسانی شگفت انگیز"} </strong>
              <button
                type="button"
                className="border-none outline-none"
                onClick={() => {
                  setSlideInForm(false);
                }}
              >
                <CloseSimple className="w-6 h-6 fill-current" />
              </button>
            </div>

            <div className="text-xs max-lg:pb-5">
              <CheckboxGroup
                items={[
                  {
                    label: `ارسال ایمیل به  ${userInfo?.emailAddress || "no email address founded"}`,
                    value: "Email",
                  },
                  {
                    label: `ارسال پیامک به   ${userInfo?.phoneNumber ? toPersianDigits(userInfo.phoneNumber.replace("+98", "0")) : "no phoneNumber founded"} `,
                    value: "Sms",
                  },
                  {
                    label: "نمایش نوتیفیکیشن در اپلیکیشن",
                    value: "Notification",
                  },
                ]}
                onChange={(v) => {
                  setSelectedTypes(v as ValidTypes[]);
                }}
                values={selectedTypes}
                itemsClassname="mb-2"
              />

              <button
                type="button"
                className="block text-center bg-gradient-violet text-white rounded-full px-3 w-full text-sm py-3 max-lg:my-7 lg:mt-5"
                onClick={submitHandle}
              >
                ثبت
                {loading && (
                  <Loading className="inline-block animate-spin w-5 h-5 mr-2 fill-current" />
                )}
              </button>
            </div>
          </div>
        </div>
      </ModalPortal>

      <button
        type="button"
        className={props.buttonClassName}
        onClick={clickHandle}
      >
        {props.children}

      </button>
    </>
  );
};

export default ProductNotificationSetting;
