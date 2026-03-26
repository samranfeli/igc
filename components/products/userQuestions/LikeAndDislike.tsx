/* eslint-disable  @typescript-eslint/no-explicit-any */

import { voteAnswer } from "@/actions/commerce";
import LoginWithPassword from "@/components/authentication/LoginWithPassword";
import Otp from "@/components/authentication/profile/OTP";
import Dislike from "@/components/icons/Dislike";
import Like from "@/components/icons/Like";
import Loading from "@/components/icons/Loading";
import ModalPortal from "@/components/shared/layout/ModalPortal";
import { toPersianDigits } from "@/helpers";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { setReduxNotification } from "@/redux/notificationSlice";
import { setBodyScrollable, setBodyScrollPosition } from "@/redux/stylesSlice";
import { useEffect, useState } from "react";

type Props = {
  likeCount: number;
  dislikeCount: number;
  questionId: number;
  answerId: number;
  initiallyLiked?: boolean;
  initiallyDisLiked?: boolean;
};

const LikeAndDislike: React.FC<Props> = (props) => {
  const {isDesktop} = useIsDesktop();

  const dispatch = useAppDispatch();

  const [loginType, setLoginType] = useState<"otp" | "password">("otp");

  const [clicked, setClicked] = useState<"" | "Like" | "Dislike">("");
  
  const [userSubmittedVote, setUserSubmittedVote] = useState<"" | "Like" | "Dislike">("");

  const [loading, setLoading] = useState(false);

  const submitHandle = async (type: "Like" | "Dislike") => {
    const userToken = localStorage.getItem("Token");
    if (!userToken) return;

    setLoading(true);

    const response: any = await voteAnswer(
      {
        answerId: props.answerId,
        questionId: props.questionId,
        voteType: type,
      },
      userToken,
    );

    setClicked("");
    setLoading(false);

    if (response.data?.success) {
        setUserSubmittedVote(type);
    } else {
      const errorMessage =
        response?.response?.data?.error?.message ||
        "متاسفانه ثبت نظر شما درباره این پاسخ با خطا روبرو شد";

      dispatch(
        setReduxNotification({
          isVisible: true,
          status: "error",
          message: errorMessage,
        }),
      );
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
    if (isAuthenticated && clicked) {
      submitHandle(clicked);
    }
  }, [isAuthenticated, clicked]);

  useEffect(() => {
    if (!slideInLogin) {
      setTimeout(() => {
        setOpenLogin(false);
      }, 300);
    }
  }, [slideInLogin]);

  const clickHandle = (type: "Like" | "Dislike") => {
    const userToken = localStorage.getItem("Token");
    if (userToken) {
      submitHandle(type);
    } else {
      setClicked(type);
      setOpenLogin(true);
    }
  };

  let loginModalWrapperClass = `bg-white dark:bg-[#011425] z-[50] text-neutral-800 pb-10 dark:text-white rounded-t-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full safePadding-b transition-all left-0 right-0 right-1/2 translate-x-1/2 ${slideInLogin ? "bottom-0" : "-bottom-[80vh]"}`;
  if (isDesktop) {
    loginModalWrapperClass = `bg-white dark:bg-[#011425] z-[50] text-neutral-800 pb-5 dark:text-white rounded-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full max-w-lg transition-all top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${slideInLogin ? "-translate-y-1/2 opacity-100" : "translate-y-0 opacity-0"}`;
  }

  let likeCount = props.likeCount;
  let dislikeCount = props.dislikeCount;

  if(userSubmittedVote === "Like"){
    likeCount++;
  }
  if(userSubmittedVote === "Dislike"){
    dislikeCount++;
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="like"
          className="flex gap-1 items-center border-none outline-none"
          onClick={() => {
            clickHandle("Like");
          }}
        >
          {toPersianDigits(likeCount.toString())}

          {loading && clicked === "Like" ? (
            <Loading className="w-4.5 h-4.5 fill-current animate-spin" />
          ):(
            <Like className={`w-4.5 h-4.5 ${userSubmittedVote=== "Like"?"fill-orange-600":"fill-current"}`} />
          )}

        </button>
        <button
          type="button"
          aria-label="dislike"
          className="flex gap-1 items-center border-none outline-none"
          onClick={() => {
            clickHandle("Dislike");
          }}
        >
          {toPersianDigits(dislikeCount.toString())}
          
          {loading && clicked === "Dislike" ? (
              <Loading className="w-4.5 h-4.5 fill-current animate-spin" />
            ):(
              <Dislike className={`w-4.5 h-4.5 ${userSubmittedVote=== "Dislike"?"fill-orange-600":"fill-current"}`} />
          )}

        </button>
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
                    برای ادامه
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

export default LikeAndDislike;
