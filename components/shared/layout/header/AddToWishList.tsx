/* eslint-disable  @typescript-eslint/no-explicit-any */

import {
  addToWishlist,
  existInWishlist,
  removeWishlist,
} from "@/actions/commerce";
import LikeIcon from "@/components/icons/LikeIcon";
import Loading from "@/components/icons/Loading";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { setBodyScrollable, setBodyScrollPosition } from "@/redux/stylesSlice";
import { useEffect, useState } from "react";
import ModalPortal from "../ModalPortal";
import Otp from "@/components/authentication/profile/OTP";
import LoginWithPassword from "@/components/authentication/LoginWithPassword";
import { setReduxNotification } from "@/redux/notificationSlice";

type Props = {
  productId: number;
};

const AddToWishList: React.FC<Props> = (props) => {
  const {isDesktop} = useIsDesktop();

  const dispatch = useAppDispatch();

  const [active, setActive] = useState(false);

  const [loading, setLoading] = useState(false);

  const [loginType, setLoginType] = useState<"otp" | "password">("otp");

  const isAuthenticated = useAppSelector(
    (state) => state.authentication.isAuthenticated,
  );

  useEffect(() => {
    const checkLikeStatus = async () => {
      const userToken = localStorage.getItem("Token");
      if (!userToken) return;

      setLoading(true);
      const response: any = await existInWishlist({
        productId: props.productId,
        token: userToken,
      });
      if (response?.data?.result) {
        setActive(true);
      }
      setLoading(false);
    };

    checkLikeStatus();
  }, []);

  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const [slideInLogin, setSlideInLogin] = useState<boolean>(false);

  useEffect(() => {
    if (openLogin) {
      setSlideInLogin(true);
      dispatch(setBodyScrollable(false));
      dispatch(setBodyScrollPosition(window?.pageYOffset || 0));
    } else {
      dispatch(setBodyScrollable(true));
      setStartClicked(false);
    }
  }, [openLogin]);

  useEffect(() => {
    if (!slideInLogin) {
      setTimeout(() => {
        setOpenLogin(false);
      }, 300);
    }
  }, [slideInLogin]);

  const [startClicked, setStartClicked] = useState<boolean>(false);

  const clickHandle = () => {
    const userToken = localStorage.getItem("Token");
    if (userToken) {
      toggleWishlist(userToken);
    } else {
      setStartClicked(true);
      setOpenLogin(true);
    }
  };

  useEffect(() => {
    if (startClicked && isAuthenticated) {
      const userToken = localStorage.getItem("Token");
      if (userToken) {
        toggleWishlist(userToken);
        setStartClicked(false);
      }
    }
  }, [startClicked, isAuthenticated]);

  const toggleWishlist = async (token: string) => {
    setLoading(true);

    if (active) {
      const response: any = await removeWishlist(
        {
          productId: props.productId,
        },
        token,
      );
      if (response.data?.success) {
        setActive(false);
      }
    } else {
      const response: any = await addToWishlist(
        {
          productId: props.productId,
        },
        token,
      );
      if (response.data?.success) {
        setActive(true);
      }
    }
    setLoading(false);
  };

  const title = active ? "حذف از علاقه مندی ها" : "اضافه به علاقه مندی ها";

  let loginModalWrapperClass = `bg-white dark:bg-[#011425] z-[50] text-neutral-800 pb-10 dark:text-white rounded-t-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full safePadding-b transition-all left-0 right-0 right-1/2 translate-x-1/2 ${slideInLogin ? "bottom-0" : "-bottom-[80vh]"}`;

  if (isDesktop) {
    loginModalWrapperClass = `bg-white dark:bg-[#011425] z-[50] text-neutral-800 pb-5 dark:text-white rounded-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full max-w-lg transition-all top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${slideInLogin ? "-translate-y-1/2 opacity-100" : "translate-y-0 opacity-0"}`;
  }

  const loginSuccess = () => {
    dispatch(
      setReduxNotification({
        status: "success",
        message: "کاربر عزیز، خوش آمدید!",
        isVisible: true,
      }),
    );
    setOpenLogin(false);
  };

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
                onLoginSuccess={loginSuccess}
              />
            ) : (
              <LoginWithPassword
                onLoginSuccess={loginSuccess}
                //initialPhoneNumber={phoneNumber ? "+98" + phoneNumber : undefined}
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

      <div className="relative group flex items-center justify-start lg:justify-center">
        <button
          type="button"
          className="inline-flex items-center gap-3"
          onClick={clickHandle}
          disabled={loading}
        >
          {loading ? (
            <Loading className="w-7 h-7 lg:w-6 lg:h-6 fill-current animate-spin" />
          ) : (
            <LikeIcon
              className={`w-7 h-7 lg:w-6 lg:h-6 stroke-2 transition-all ${active ? "fill-red-500 stroke-red-500" : "stroke-neutral-800 dark:stroke-white lg:stroke-white fill-transparent"}`}
            />
          )}
          <span className="lg:hidden">{title}</span>
        </button>
        <div className="max-lg:hidden opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible absolute right-full top-1/2 -translate-y-1/2 text-xs bg-white/70 p-3 whitespace-nowrap text-black rounded-lg mr-2 group-hover:mr-1 transition-all">
          {title}
        </div>
      </div>
    </>
  );
};

export default AddToWishList;
