/* eslint-disable  @typescript-eslint/no-explicit-any */

import { createAnswer } from "@/actions/commerce";
import LoginWithPassword from "@/components/authentication/LoginWithPassword";
import Otp from "@/components/authentication/profile/OTP";
import CloseSimple from "@/components/icons/CloseSimple";
import { DownCaretThick } from "@/components/icons/DownCaretThick";
import Edit from "@/components/icons/Edit";
import Loading from "@/components/icons/Loading";
import ModalPortal from "@/components/shared/layout/ModalPortal";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { setReduxNotification } from "@/redux/notificationSlice";
import { setBodyScrollable, setBodyScrollPosition } from "@/redux/stylesSlice";
import { ReactNode, useEffect, useState } from "react";

type Props = {
  questionId: number;
  questionText?: string;
  buttonHtml?: ReactNode;
  buttonClassName?: string;
};

const AddAnswer: React.FC<Props> = (props) => {
  const {isDesktop} = useIsDesktop();

  const dispatch = useAppDispatch();

  const [text, setText] = useState<string>("");

  const isDisabled = !(text.trim().length > 3);

  const [loginType, setLoginType] = useState<"otp" | "password">("otp");

  const userInfo = useAppSelector((state) => state.authentication.user);

  type DisplayNameType = "userName" | "anonymous";

  const [displayNameType, setDisplayNameType] = useState<DisplayNameType>("userName");

  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [slideInForm, setSlideInForm] = useState<boolean>(false);

  const [openIsAnonymousForm, setOpenIsAnonymousForm] =
    useState<boolean>(false);

  useEffect(() => {
    if (openForm) {
      setSlideInForm(true);
      dispatch(setBodyScrollable(false));
      dispatch(setBodyScrollPosition(window?.pageYOffset || 0));
    } else {
      dispatch(setBodyScrollable(true));
      setText("")
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

    if (text.trim().length > 3) {
      setLoading(true);

      const response: any = await createAnswer(
        {
          answerText: text,
          questionId: props.questionId,
          isAnonymous: displayNameType === "anonymous"
        },
        userToken,
      );

      setLoading(false);

      if (response.data?.success) {
        setSlideInForm(false);
        setText("");
        dispatch(
          setReduxNotification({
            status: "success",
            message: "پاسخ شما ثبت شده و پس از بررسی نمایش داده میشود.",
            isVisible: true,
          }),
        );
      }else{
        setSlideInForm(false);
        const errorMessage = response?.response?.data?.error?.message || "متاسفانه ثبت پاسخ با خطا روبرو شد";

        dispatch(setReduxNotification({
          isVisible: true,
          status:"error",
          message: errorMessage
        }))

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

  const userFullName = userInfo?.firstName + " " + userInfo?.lastName;
  return (
    <>

      <button type="button" className={props.buttonClassName || "text-xs mt-1 flex items-center gap-1"} onClick={clickHandle}>
        <Edit className="w-4 h-4 fill-current" />
        {props.buttonHtml || "ثبت پاسخ"}
      </button>

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
                    برای ثبت پاسخ
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

      <ModalPortal show={openForm} selector="modal_portal">
        <div
          className="bg-black/50 backdrop-blur-sm fixed top-0 left-0 right-0 bottom-0"
          onClick={() => {
            setSlideInForm(false);
          }}
        />

        <div className={formModalWrapperClass}>
          <div className="flex justify-between items-center pt-5 px-4 mb-1">
            <h2 className="text-sm font-semibold block">
              به این پرسش پاسخ دهید
            </h2>
            <button
              type="button"
              onClick={() => {
                setSlideInForm(false);
              }}
            >
              <CloseSimple className="w-6 h-6 fill-current" />
            </button>
          </div>
          
          <p className="text-sm p-4"> {props.questionText} </p>

          <div className="p-4">
            <textarea
              className="text-sm outline-none block bg-white dark:bg-transparent w-full resize-none min-h-40 border rounded-t-xl p-3.5 border-neutral-300 dark:border-white/15"
              placeholder="متن پاسخ"
              onChange={(e) => {
                setText(e.target.value);
              }}
              value={text}
            ></textarea>
            <div className="mb-5 flex px-4 py-3 justify-between items-center border-t-0 border rounded-b-xl border-neutral-300 dark:border-white/15">
              <div className="text-sm font-semibold">
                {displayNameType === "anonymous"
                  ? "کاربر مرکز بازی ایران"
                  : userFullName}
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpenIsAnonymousForm(true);
                }}
                className="bg-gray-100 dark:bg-white/15 px-3 py-2 flex items-center gap-3 rounded-full text-xs"
              >
                {displayNameType === "anonymous"
                  ? "ارسال ناشناس"
                  : "ارسال با نام شما"}
                <DownCaretThick className="w-3 h-3 fill-current" />
              </button>
            </div>

            <button
              type="button"
              className={`font-semibold rounded-xl px-5 w-full lg:w-40 py-3 text-sm text-white ${isDisabled ? "bg-neutral-300 dark:bg-white/15 dark:text-white/20" : "bg-violet-500 hover:bg-violet-600"}`}
              onClick={submitHandle}
            >
              ثبت پاسخ
              {loading && (
                <Loading className="inline-block animate-spin w-5 h-5 mr-2 fill-current" />
              )}
            </button>
            <p className="text-xs mt-3">
              ثبت پاسخ به معنی موافقت با قوانین انتشار مرکز بازی ایران است.
            </p>
          </div>
        </div>

        {!!openIsAnonymousForm && (
          <>
            <div
              className="bg-black/50 backdrop-blur-sm fixed top-0 left-0 right-0 bottom-0"
              onClick={() => {
                setOpenIsAnonymousForm(false);
              }}
            />
            <div className="bg-white dark:bg-[#192a39] text-neutral-800 dark:text-white pb-5 rounded-t-2xl lg:rounded-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full max-w-lg lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 max-lg:bottom-0 max-lg:left-0 max-lg:right-0">
              <div className="flex justify-between items-center p-4 border-b border-neutral-300 dark:border-white/15">
                <h5 className="text-sm font-semibold block">نحوه نمایش</h5>
                <button
                  type="button"
                  onClick={() => {
                    setOpenIsAnonymousForm(false);
                  }}
                >
                  <CloseSimple className="w-6 h-6 fill-current" />
                </button>
              </div>

              <div className="p-5">
                {[
                  {
                    label: "ارسال ناشناس",
                    keyword: "anonymous",
                    description: (
                      <p>
                        پاسخ شما در صفحه محصول با عنوان <strong className="font-semibold"> کاربر مرکز بازی ایران </strong> نمایش داده می‌شود
                      </p>
                    ),
                  },
                  {
                    label: "ارسال با نام شما",
                    keyword: "userName",
                    description: (
                      <p>
                        پاسخ شما در صفحه محصول با نام <strong className="font-semibold"> {userFullName} </strong>نمایش داده می‌شود
                      </p>
                    ),
                  },
                ].map((a) => (
                  <button
                    key={a.keyword}
                    type="button"
                    className={`flex gap-3 mb-5`}
                    onClick={() => {
                      setDisplayNameType(a.keyword as DisplayNameType);
                    }}
                  >
                    <span
                      className={`block mt-1 w-5 h-5 border rounded-full grow-0 shrink-0
                      ${displayNameType === a.keyword ? "border-4 border-violet-500" : "border-neutral-300 dark:border-white/15"}`}
                    />
                    <div>
                      <strong className="semibold block mb-2 text-right">
                        {a.label}
                      </strong>
                      <p className="text-xs"> {a.description} </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </ModalPortal>
    </>
  );
};

export default AddAnswer;
