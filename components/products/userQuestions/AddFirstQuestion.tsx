/* eslint-disable  @typescript-eslint/no-explicit-any */

import { createQuestion } from "@/actions/commerce";
import LoginWithPassword from "@/components/authentication/LoginWithPassword";
import Otp from "@/components/authentication/profile/OTP";
import Loading from "@/components/icons/Loading";
import ModalPortal from "@/components/shared/layout/ModalPortal";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { setReduxNotification } from "@/redux/notificationSlice";
import { setBodyScrollable, setBodyScrollPosition } from "@/redux/stylesSlice";
import { useEffect, useState } from "react";

type Props = {
  productId: number;
};

const AddFirstQuestion: React.FC<Props> = (props) => {
  const {isDesktop} = useIsDesktop();

  const dispatch = useAppDispatch();

  const [text, setText] = useState<string>("");

  const isDisabled = !(text.trim().length > 3);

  const [loginType, setLoginType] = useState<"otp" | "password">("otp");

  const [loading, setLoading] = useState(false);

  const [startClicked, setStartClicked] = useState<boolean>(false);

  const submitHandle = async () => {
    const userToken = localStorage.getItem("Token");
    if (!userToken) return;

    if (text.trim().length > 3) {
      setLoading(true);

      const response: any = await createQuestion(
        {
          isAnonymous: true,
          productId: props.productId,
          questionText: text,
        },
        userToken,
      );

      setLoading(false);

      if (response.data?.success) {
        setText("");
        dispatch(
          setReduxNotification({
            status: "success",
            message: "پرسش شما ثبت شده و پس از بررسی نمایش داده میشود.",
            isVisible: true,
          }),
        );
      }
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
      submitHandle();
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
      submitHandle()
    } else {
      setStartClicked(true);
      setOpenLogin(true);
    }
  };

  let loginModalWrapperClass = `bg-white dark:bg-[#011425] z-[50] text-neutral-800 pb-10 dark:text-white rounded-t-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full safePadding-b transition-all left-0 right-0 right-1/2 translate-x-1/2 ${slideInLogin ? "bottom-0" : "-bottom-[80vh]"}`;

  if (isDesktop) {
    loginModalWrapperClass = `bg-white dark:bg-[#011425] z-[50] text-neutral-800 pb-5 dark:text-white rounded-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full max-w-lg transition-all top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${slideInLogin ? "-translate-y-1/2 opacity-100" : "translate-y-0 opacity-0"}`;
  }

  return (
    <>
      <div>
        <h5 className="text-sm font-semibold mb-6"> درباره این بازی چه پرسشی دارید؟ </h5>
        <textarea
          className="mb-5 text-sm outline-none block bg-white dark:bg-transparent w-full resize-none min-h-40 border rounded-t-xl p-3.5 border-neutral-300 dark:border-white/15"
          placeholder="متن پرسش"
          onChange={(e) => {
            setText(e.target.value);
          }}
          value={text}
        ></textarea>
        <button
          type="button"
          className={`font-semibold rounded-xl px-5 w-full lg:w-40 py-3 text-sm text-white ${isDisabled ? "bg-neutral-300 dark:bg-white/15 dark:text-white/20" : "bg-violet-500 hover:bg-violet-600"}`}
          onClick={clickHandle}
        >
          ثبت پرسش
          {loading && (
            <Loading className="inline-block animate-spin w-5 h-5 mr-2 fill-current" />
          )}
        </button>
        <p className="text-xs mt-3">
          ثبت پرسش به معنی موافقت با قوانین انتشار مرکز بازی ایران است.
        </p>
      </div>

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
                    برای ثبت پرسش
                    <br /> ورود یا ثبت‌نام در حساب کاربری لازم است.
                  </h3>
                }
                onLoginSuccess={() => {
                  setOpenLogin(false);
                }}
              />
            ) : (
              <LoginWithPassword
                onLoginSuccess={() => {
                  setOpenLogin(false);
                }}
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
    </>
  );
};

export default AddFirstQuestion;
