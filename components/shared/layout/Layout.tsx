/* eslint-disable  @typescript-eslint/no-explicit-any */

import { PropsWithChildren, useEffect } from "react";
import Header from "./header/Index";
import Footer from "./footer/Index";
import { useRouter } from "next/router";
import Error from "../Error";
import Notification from "../Notification";
import { setReduxBalance, setReduxUser } from "@/redux/authenticationSlice";
import { getCurrentUserProfile, loginUtm } from "@/actions/identity";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import FooterNavigation from "./footer/FooterNavigation";
import { getUserBalance } from "@/actions/payment";
import PageLoadingBar from "./PageLoadingBar";
import { setMode, setProgressLoading } from "@/redux/stylesSlice";
import { addDeviceId, setGeneralCartInfo, setGeneralCartLoading } from "@/redux/cartSlice";
import { GetCookieDeviceId } from "@/helpers/order";
import { useCartApi } from "@/actions/cart";
import { GetCookieMode } from "@/helpers";
import { setReduxNotification } from "@/redux/notificationSlice";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import DesktopFooter from "./footer/DesktopFooter";
import LoadingFull from "../LoadingFull";

type Props = {
    className?: string;
}

const Layout: React.FC<PropsWithChildren<Props>> = props => {

    const router = useRouter();

    const {isDesktop, initializing} = useIsDesktop();

    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    const userLoading = useAppSelector(state => state.authentication.getUserLoading);

    const isBodyScrollable = useAppSelector(state => state?.styles?.bodyScrollable);
    const lastScrollPosition = useAppSelector(state => state?.styles?.lastScrollPosition);
    const deviceId = useAppSelector((state) => state.cart.deviceId);

    const reduxMode = useAppSelector(state => state.styles.mode);

    const {getCart} = useCartApi(); 

    const queryBasaUserToken = router.query?.ut;
    const queryUtmSource = router.query?.utm_source;
  
    useEffect(() => {
        if(queryBasaUserToken){
            
            const expDate = new Date();
            expDate.setTime(expDate.getTime() + (20 * 60 * 1000)); //save in cookie only 20 minutes.    

            const loginByUtm = async () => {

                const response: any = await loginUtm({
                    utmName:"basa",
                    utmToken:queryBasaUserToken as string
                })

                if (response.status == 200) {

                    const token = response.data?.result?.accessToken;
                    localStorage.setItem('Token', token);     
                    localStorage.setItem('TokenExpire', expDate.toString());               

                    dispatch(setReduxUser({
                        isAuthenticated: true,
                        user: response.data?.result?.user,
                        getUserLoading: false
                    }));

                    const userFirstName = response.data?.result?.user?.firstName || "کاربر";

                    dispatch(setReduxNotification({
                        status: 'success',
                        message: userFirstName + '  عزیز،  خوش آمدید.',
                        isVisible: true
                    }));

                } else {
                    const errorMessage = response?.response?.data?.error?.message;
    
                    let message = "";
                    if (errorMessage) {
                        message = response.response.data.error.message;
                    }
    
                    if(errorMessage === "UserNotFound"){
                        dispatch(setReduxUser({
                            isAuthenticated: false,
                            user: {},
                            getUserLoading: false
                        }));
                    }else{
                        dispatch(setReduxNotification({
                            status: 'error',
                            message: message,
                            isVisible: true
                        }));
                        dispatch(setReduxUser({
                            isAuthenticated: false,
                            user: {},
                            getUserLoading: false
                        }));
                    }
                    
                }
            } 

            loginByUtm();

            if (document) {
                document.cookie = `basaUserToken=${queryBasaUserToken}; expires=${expDate.toUTCString()};path=/`;
            }        
        }
        if(queryUtmSource){
            const expDate = new Date();
            expDate.setTime(expDate.getTime() + (20 * 60 * 1000)); //save in cookie only 20 minutes.
            if (document) {
                document.cookie = `utmSourceName=${queryUtmSource}; expires=${expDate.toUTCString()};path=/`;
            } 
        }
    }, [queryBasaUserToken, queryUtmSource]);
    
    useEffect(()=>{
        const id = GetCookieDeviceId();
        if(id){
            dispatch(addDeviceId(id));
        }

        const cookieMode = GetCookieMode();

        const isSystemDark = window?.matchMedia('(prefers-color-scheme: dark)').matches;
        if(cookieMode==="dark"){
            dispatch(setMode("dark"));
        }else if (cookieMode === "light"){
            dispatch(setMode("light"));
        }else if(isSystemDark){
            dispatch(setMode("dark"));
        }else{
            dispatch(setMode("light"));
        }

    },[]);

    useEffect(()=>{

        const root = document.documentElement;

        if(reduxMode === "dark"){
            root.classList.add('dark');
        }else {
            root.classList.remove('dark');
        }        

    },[reduxMode]);

    useEffect(() => {
        const getGeneralCartData = async () => {
            dispatch(setGeneralCartLoading(true));
            const response: any = await getCart();
            if(response?.result){
                dispatch(setGeneralCartInfo(response.result));
            }
            dispatch(setGeneralCartLoading(false));
        }

        if(!userLoading){            
            getGeneralCartData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deviceId, userLoading]);

    useEffect(() => {
        if (isBodyScrollable && lastScrollPosition) {
            window.scrollTo({
                top: lastScrollPosition,
                left: 0,
                behavior: "instant"
            });
        }
    }, [isBodyScrollable, lastScrollPosition]);

    const loading = useAppSelector(state => state.styles.progressLoading);
    
    useEffect(() => {
        const handleStart = (url: string) => {
            const pureCurrent = router.asPath.split('?')[0].split('#')[0];
            const pureNext = url.split('?')[0].split('#')[0];

            if (pureCurrent !== pureNext) {
                dispatch(setProgressLoading(true));
            }
        };

        const handleComplete = () => {
            setTimeout(() => {            
                dispatch(setProgressLoading(false));
            }, 300);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router.asPath]);

    let showHeader = true;
    let showMobileFooter = true;
    let showDesktopFooter = true;
    let showFixedNav = true;
    let hasInternalFixedFooter = false;

    if (
        [
            "/login",
            "/forget-password"
        ].includes(router.pathname)) {
        showMobileFooter = false;
        showHeader = false;
        showDesktopFooter = false;
        showFixedNav = false;
    }

    if([
            "/profile/change-password",
            "/profile//profile/edit",
            "/profile/wallet",
            "/profile/wallet/charge",
            "/profile/wallet/faq",
            "/profile/wallet/transactions"
        ].includes(router.pathname)){
        showMobileFooter = false;
        showFixedNav = false;
    }

    if (router.pathname === "/profile") {
        showMobileFooter = false;
    }

    if (router.pathname === "/terms") {
        showMobileFooter = false;
        showFixedNav = false;
    }
    if (router.pathname === "/about") {
        showHeader = true;
        showMobileFooter = true;
        showFixedNav = false;
    }
    if (router.pathname === "/contact") {
        showHeader = true;
        showMobileFooter = false;
        showFixedNav = false;
    }

    if (router.pathname.startsWith("/faq")) {
        showMobileFooter = false;
        showFixedNav = false;
    }
    if (router.pathname === "/profile/wishlist") {
        showMobileFooter = false;
        showFixedNav = true;
    }

    if (router.pathname.includes("/orders")) {
        showMobileFooter = false;
        showFixedNav = true;
    }

    if (router.pathname.startsWith("/blog/")) {
        showMobileFooter = true;
        showHeader = true;
        showFixedNav = false;
    }

    if (router.pathname === "/blogs") {
        showMobileFooter = true;
        showHeader = true;
        showFixedNav = false;
    }

    if (router.pathname.startsWith("/product/")) {
        showMobileFooter = true;
        showHeader = true;
        showFixedNav = false;
        hasInternalFixedFooter = true;
    }

    if (router.pathname === "/categories"){
        showMobileFooter = false;
        showHeader = true;
        showFixedNav = true;
    }
    if (router.pathname === '/cart') {
        showMobileFooter = false;
        showHeader = true;
        showFixedNav = false;
        hasInternalFixedFooter = true;
    }
    if (router.pathname === '/payment') {
        showMobileFooter = false;
        showHeader = true;
        showFixedNav = false;
        hasInternalFixedFooter = true;
    }
    if (router.pathname === '/confirm') {
        showMobileFooter = false;
        showHeader = true;
        showFixedNav = false;
        hasInternalFixedFooter = false;
    }
    
    if (router.pathname === '/checkout') {
        showMobileFooter = false;
        showHeader = true;
        showFixedNav = false;
        hasInternalFixedFooter = false;
    }

    useEffect(() => {

        function getToken() {        

            const user_token = localStorage?.getItem('Token');
            const user_expireTime = localStorage?.getItem('TokenExpire');

            if (!user_token) {
                localStorage.removeItem('TokenExpire');
                return null;
            }

            const now = new Date().getTime();
            const expireTime = user_expireTime ? new Date(user_expireTime).getTime() : undefined;
            if ( !expireTime ||  now > expireTime) {
                localStorage.removeItem('Token');
                localStorage.removeItem('TokenExpire');
                return null;
            }

            return user_token;
        }

        const token = getToken();

        if (token) {
            const getUserData = async () => {
                dispatch(setReduxUser({
                    isAuthenticated: false,
                    user: {},
                    getUserLoading: true
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

            }
            getUserData();
        }else{
            dispatch(setReduxUser({
                isAuthenticated: false,
                user: {},
                getUserLoading: false
            }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchBalance = async () => {

            const token = localStorage?.getItem('Token');
            if (!token) return;

            dispatch(setReduxBalance({ balance: undefined, loading: true, currency:"" }));
            const response: any = await getUserBalance(token);
            if (response.data?.result?.amount !== null) {
                dispatch(setReduxBalance({ balance: response?.data?.result?.amount, loading: false, currency: response?.data?.result?.currencyType }))
            } else {
                dispatch(setReduxBalance({ balance: undefined, loading: false,  currency:"" }));
            }
        }
        if (isAuthenticated) {
            fetchBalance();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    let mainHeightClass : string = "";
    if(showMobileFooter){
         mainHeightClass = "";
    }else if (showFixedNav || hasInternalFixedFooter){
        if(showHeader){
            mainHeightClass = "min-h-screen-nav-header";
        }else{
            mainHeightClass = "min-h-screen-nav";
        }
    }else if(showHeader){
        mainHeightClass = "min-h-screen-header";
    }else{
          mainHeightClass = "min-h-screen";
    }

    let footerElement = null;

    if(isDesktop && showDesktopFooter){
        footerElement =  <DesktopFooter />;
    }else if (showMobileFooter){
        footerElement = <Footer />;
    }

    if(initializing) return(
        <LoadingFull />
    )
    return (
        <>
            <Error />
            <Notification />
            <div className={`bg-[#fafafa] text-[#333333] dark:bg-[#011425] dark:text-white lg:min-h-screen ${isBodyScrollable ? "" : "overflow-hidden h-screen"}`}>
                <PageLoadingBar active={loading} />
                {showHeader && <>
                    <Header />
                    <div className="pt-[84px]" />
                </>}
                <main 
                    className={isDesktop ? "mainDesktopHeightClass": mainHeightClass}
                    style={{
                        position: (!isBodyScrollable && lastScrollPosition) ?"relative": "static",
                        top: -lastScrollPosition+"px"
                    }}
                >
                    {props.children}
                </main>
                
                {footerElement}

                {showFixedNav && !isDesktop && <FooterNavigation />}
            </div>
        </>


    )
}
export default Layout;