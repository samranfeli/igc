/* eslint-disable  @typescript-eslint/no-explicit-any */

import { getCurrentUserProfile, updateCurrentUserProfile } from "@/actions/identity";
import Loading from "@/components/icons/Loading";
import FormikField from "@/components/shared/FormikField";
import { validateEmail, validateRequiedPersianAndEnglish } from "@/helpers/formik-validation";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { setReduxUser } from "@/redux/authenticationSlice";
import { setReduxNotification } from "@/redux/notificationSlice";
import { Form, Formik } from "formik"
import {  useEffect, useState } from "react";
import PhoneInput from "../shared/PhoneInput";
import Image from "next/image";
import LoginSection from "./LoginSection";
import { useCartApi } from "@/actions/cart";
import LoadingFull from "../shared/LoadingFull";
import { useRouter } from "next/router";
import { setGeneralCartInfo, setGeneralCartLoading } from "@/redux/cartSlice";
import { CreateOrderParams } from "@/types/commerce";

const CheckoutSection = () => {
    const dispatch = useAppDispatch();
    
    const router = useRouter();

    const isAuthenticated = useAppSelector((state) => state.authentication.isAuthenticated);
    const userInfo = useAppSelector((state) => state.authentication.user);
    const { createOrder, getCart } = useCartApi();

    const [goToPaymentLoading, setGoToPaymentLoading] = useState(false);

    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const submitHandler = async (parameters: {
        firstname?: string;
        lastname?: string;
        emailAddress?: string;
        phoneNumber?: string
    }) => {

        const token = localStorage.getItem('Token');
        if (!token) return;

        setSubmitLoading(true);

        dispatch(setReduxNotification({
            status: '',
            message: "",
            isVisible: false
        }));

        const response: any = await updateCurrentUserProfile(parameters, token);

        setSubmitLoading(false);

        if (response.data && response.data.success) {

            dispatch(setReduxNotification({
                status: 'success',
                message: "اطلاعات با موفقیت ارسال شد",
                isVisible: true
            }));

            const response: any = await getCurrentUserProfile(token);

            if (response && response.status === 200) {
                dispatch(setReduxUser({
                    isAuthenticated: true,
                    user: response.data?.result,
                    getUserLoading: false
                }));
            } else {
                dispatch(setReduxUser({
                    isAuthenticated: false,
                    user: {},
                    getUserLoading: false
                }));
            }

        } else {
            dispatch(setReduxNotification({
                status: 'error',
                message: "ارسال اطلاعات ناموفق",
                isVisible: true
            }));

        }
    }

    let initialValues = {
        emailAddress:'',
        firstname: '',
        lastname: '',
        phoneNumber:''
    }

    if (isAuthenticated && userInfo) {
        initialValues = {
            firstname: userInfo?.firstName || '',
            lastname: userInfo?.lastName || '',
            emailAddress: userInfo?.emailAddress || '',
            phoneNumber: userInfo?.phoneNumber || ''
        }        
    }

    const getGeneralCartData = async () => {
    dispatch(setGeneralCartLoading(true));
    const response: any = await getCart();
    if (response?.result) {
        dispatch(setGeneralCartInfo(response.result));
    }
    dispatch(setGeneralCartLoading(false));
    };


    const handleCreateOrder = async () => {

        const token = typeof window !== "undefined" ? localStorage.getItem("Token") : null;

        if (!token) return;

        try {

            let basaCookie ="";
            let utmSourceName="";
            const cookies = decodeURIComponent(document?.cookie).split(';');
            for (const item of cookies) {
                if (item.includes("basaUserToken=")) {
                    basaCookie = item.split("=")[1];
                }
                if (item.includes("utmSourceName=")) {
                    utmSourceName = item.split("=")[1];
                }
            }

            const params : CreateOrderParams = {
                gender: userInfo?.gender || false,
                email: userInfo?.emailAddress,
                firstName: userInfo?.firstName,
                lastName: userInfo?.lastName,
                phoneNumber: userInfo?.phoneNumber
            };

            if ( basaCookie){
                params.metaSearchName = "basa";
                params.metaSearchKey = basaCookie;
            }

            if(utmSourceName){
                params.metaSearchName = utmSourceName;
            }

            const res: any = await createOrder(params);

            setGoToPaymentLoading(true);
            await getGeneralCartData();

            const orderId = res.data?.result?.id;
            const orderNumber = res.data?.result?.orderNumber;

            if (orderNumber && orderId) {
            router.push(`/payment?orderNumber=${orderNumber}&orderId=${orderId}`);
            } 

        } catch (error) {
        console.error("Error creating order:", error);
        }
    };

    useEffect(()=>{
        if(userInfo?.lastName && userInfo.isPhoneNumberConfirmed){
            handleCreateOrder()
        }
    }, [userInfo?.lastName]);
    
    if (userInfo?.lastName || goToPaymentLoading) {
        return <LoadingFull /> 
    }
    
    if(!isAuthenticated){
        return( 
            <LoginSection />
        )
    }

    return (
        <Formik
            validate={() => {
                return {}
            }}
            initialValues={initialValues}
            onSubmit={submitHandler}
        >
            {({
                errors,
                touched,
                isValid,
                isSubmitting,
                setFieldValue,
                values,
            }) => {
                
                if (isSubmitting && !isValid) {
                    setTimeout(() => {
                        const formFirstError = document.querySelector(
                            '.has-validation-error',
                        )
                        if (formFirstError) {
                            formFirstError.scrollIntoView({ behavior: 'smooth' })
                        }
                    }, 100)
                }
                return (
                    <Form className="mx-3 pb-1 pt-5 lg:max-w-[1000px] lg:mx-auto lg:rounded-2xl lg:bg-gradient-to-t lg:from-[#eaeaea] lg:dark:from-[#182a38] lg:to-transparent lg:mb-10" autoComplete="off">
                        <div className="lg:max-w-[500px] lg:mx-auto">
                            <FormikField
                                showConfirmedBadge={!validateRequiedPersianAndEnglish(
                                    values.firstname,
                                    "requiredMessage",
                                    "inValidMessage"
                                )}
                                className='mb-6'
                                setFieldValue={setFieldValue}
                                errorText={errors.firstname as string}
                                id="firstname"
                                name="firstname"
                                isTouched={touched.firstname}
                                label="نام"
                                validateFunction={(value: string) =>
                                    validateRequiedPersianAndEnglish(
                                        value,
                                        'لطفا نام خود را وارد کنید!',
                                        'فقط حروف فارسی و انگلیسی مجاز است!',
                                    )
                                }
                                onChange={(value: string) => {
                                    setFieldValue('firstname', value, true)
                                }}
                                value={values.firstname}
                                placeholder=" نام را وارد کنید "
                            />

                            <FormikField
                                showConfirmedBadge={!validateRequiedPersianAndEnglish(
                                    values.lastname,
                                    "requiredMessage",
                                    "inValidMessage"
                                )}
                                className='mb-6'
                                setFieldValue={setFieldValue}
                                errorText={errors.lastname as string}
                                id="lastname"
                                name="lastname"
                                isTouched={touched.lastname}
                                label="نام خانوادگی"
                                validateFunction={(value: string) =>
                                    validateRequiedPersianAndEnglish(
                                        value,
                                        'لطفا نام خود را وارد کنید!',
                                        'فقط حروف فارسی و انگلیسی مجاز است!',
                                    )
                                }
                                onChange={(value: string) => {
                                    setFieldValue('lastname', value, true)
                                }}
                                value={values.lastname}
                                placeholder="نام خانوادگی  را وارد کنید"
                            />

                            <div className="self-stretch ">
                                <PhoneInput
                                    placeholder="شماره موبایل را وارد نمایید"
                                    label={
                                        <div className="w-full flex justify-between items-center">
                                            <div className="flex gap-3 items-center">
                                                <span>موبایل</span>
                                                <Image src={'/images/icons/check-gradient-green.svg'} className="w-5 h-5" width={20} height={20} alt="verified-mobile"/>
                                            </div>
                                            <p className="bg-gradient-to-b from-[#00B59C] to-[#9CFFAC] bg-clip-text text-transparent">
                                                تایید شده
                                            </p>
                                        </div>
                                    }
                                    defaultCountry={
                                        {
                                            countryCode: "ir",
                                            dialCode: "98",
                                            format: "... ... ...."
                                        }
                                    }
                                    onChange={(v: string) => {
                                        setFieldValue('phoneNumber', v)
                                    }}
                                    value={values.phoneNumber}
                                    name='phoneNumber'
                                    isTouched={touched.phoneNumber}
                                    errorText={errors.phoneNumber}
                                    disabled
                                    className="mb-5 "
                                    initialValue={initialValues.phoneNumber}
                                
                                />
        
                            </div>
                            <FormikField

                                    inputWarningIcon={!!(userInfo?.emailAddress && !userInfo.isEmailConfirmed)}
                                    showConfirmedBadge={!validateEmail({
                                        value: values.emailAddress,
                                        invalidMessage: "invalidMessage",
                                        reqiredMessage: "reqiredMessage"
                                    })}
                                    showConfirmedText={!!(userInfo?.emailAddress && userInfo.isEmailConfirmed)}
                                    className='mb-5'
                                    setFieldValue={setFieldValue}
                                    errorText={errors.emailAddress as string}
                                    id="emailAddress"
                                    name="emailAddress"
                                    isTouched={touched.emailAddress}
                                    label="ایمیل (اختیاری)"
                                    validateFunction={(value: string) => validateEmail({ value: value, invalidMessage: "ایمیل وارد شده معتبر نیست" })}
                                    onChange={(value: string) => {
                                        setFieldValue('emailAddress', value, true)
                                    }}
                                value={values.emailAddress}
                                placeholder="ایمیل را وارد نمایید"

                                />

                            <button
                                type="submit"
                                className="h-11 font-semibold px-8 rounded-full bg-[#aa3aff] text-white flex justify-center gap-2 items-center w-full mb-5"
                                disabled={submitLoading}
                            >
                                ذخیره تغییرات
                                {submitLoading ? <Loading className="fill-current w-5 h-5 animate-spin" /> : null}
                            </button>
                        </div>

                    </Form>
                )
            }}
        </Formik>
    )
}

export default CheckoutSection