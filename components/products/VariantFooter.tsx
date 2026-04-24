/* eslint-disable  @typescript-eslint/no-explicit-any */

import {   GetCartByProductIdType, ProductVariant } from "@/types/commerce";
import { useEffect, useState} from "react";

import SimplePortal from "../shared/layout/SimplePortal";
import { numberWithCommas } from "@/helpers";
import { addDeviceId, setGeneralCartInfo, setGeneralCartLoading } from "@/redux/cartSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import {  useCartApi } from "@/actions/cart";
import Loading from "../icons/Loading";
import Alert from "../shared/Alert";
import Image from "next/image";
import { useRouter } from "next/router";
import { setProgressLoading } from "@/redux/stylesSlice";
import { getCurrencyLabelFa } from "@/helpers/currencyLabel";
import { addDeviceIdToCookie } from "@/helpers/order";
import CaretLeft from "../icons/CaretLeft";
import Plus from "../icons/Plus";
import Minus from "../icons/Minus";
import Trash from "../icons/Trash";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import NotifyWhenAvailable from "./NotifyWhenAvailable";

const VariantFooter = ({
  currentVariant,
  productId,
  productVariantId
}: {
  currentVariant?: ProductVariant;
  productId: number;
  productVariantId?: number;
}) => {

  const [cartData, setCartData] = useState<GetCartByProductIdType | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const router = useRouter();
  
  const { getCartByProductId, addItem, removeItem, getCart } = useCartApi();

  const {isDesktop} = useIsDesktop();

  const dispatch = useAppDispatch();

  const getGeneralCartData = async () => {
    dispatch(setGeneralCartLoading(true));
    const response: any = await getCart();
    if (response?.result) {
      dispatch(setGeneralCartInfo(response.result));
    }
    dispatch(setGeneralCartLoading(false));
  };

  useEffect(()=>{
    return(()=>{
      setShowSuccessAlert(false)
    })
  },[]);

  const deviceId = useAppSelector((state) => state.cart?.deviceId);

  const loadCartByProductId = (params?:{deviceId?:string;userToken?:string}) => {

    setLoading(true);

    getCartByProductId({
      productId: productId,
      deviceId: params?.userToken ? undefined : params?.deviceId,
      userToken: params?.userToken
    })
      .then((res) => setCartData(res?.result || null))
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCartByProductId();
  }, [deviceId]);

  if (currentVariant?.items?.[0]?.status === "OutOfStock" ){
     return <NotifyWhenAvailable productId={productId} variantId={productVariantId} />
  };

  const variantItem = currentVariant?.items?.[0];

  const currency = getCurrencyLabelFa(variantItem?.currencyType || "IRR")

  const handleAddToCart = async () => {  

    setShowSuccessAlert(false);
    const variantId = variantItem?.id;
    if (!variantId) return;

    setLoading(true);

    try {
      const res = await addItem({variantId});

      addDeviceIdToCookie(res?.result?.deviceId);

      dispatch(addDeviceId(res?.result?.deviceId || ""));

      await Promise.all([
        loadCartByProductId({deviceId: res?.result?.deviceId || ""}),
        getGeneralCartData(),
      ]);

      setLoading(false);
      setShowSuccessAlert(true);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!cartData?.items?.length) return;

    const lastCartItem = cartData.items.at(-1);
    if (!lastCartItem) return;

    setLoading(true);
    
    try {
      await removeItem({ Id: lastCartItem.id });
      await Promise.all([
        loadCartByProductId(),
        getGeneralCartData()
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentVariantAddedQuantity = cartData?.items.find(x => x.variantId === variantItem?.id)?.quantity || 0;
  
  return (
    <>
      {showSuccessAlert && (
        <Alert 
          closable 
          autoClose
          wrapperClassName="fixed max-lg:bottom-[100px] max-lg:left-0 max-lg:right-0 flex justify-center items-center lg:bottom-10 lg:left-1/2 lg:-translate-x-1/2 lg:min-w-[400px] px-4 z-50"
        >
          <div className="flex flex-wrap gap-2 justify-between items-center text-sm">
            <span className="text-gradient-logo-linear">
              کالا به سبد اضافه شد!
            </span>
          <button
            type="button"
            className="w-fit h-full text-white flex items-end"
            onClick={async () => {
              dispatch(setProgressLoading(true)); 
              await router.push("/cart");
              dispatch(setProgressLoading(false));
            }}
          >
            <span>برو به سبد خرید</span>
            <CaretLeft className="fill-current w-4 h-4 inline-block align-middle mr-1" />
          </button>
          </div>
        </Alert>
      )}

      <SimplePortal selector={isDesktop?"variant-footer-desktop-modal":"fixed_bottom_portal"}>
        <footer className="max-lg:z-20 max-lg:min-h-20 max-lg:fixed bottom-0 left-0 max-lg:bg-white dark:text-white dark:max-lg:bg-[#192a39] max-lg:px-4 max-lg:py-3 flex lg:flex-col lg:gap-5 justify-between gap-2 max-lg:items-center w-full transition-all duration-200">
          
          {currentVariantAddedQuantity ? (
          <div className="flex items-center gap-2 h-13 bg-[#EFEFF0]/10 rounded-full lg:order-2">
              <button
              className="text-[#011425] dark:text-white lg:text-white/70 bg-gradient-to-t from-green-600 to-green-300 hover:bg-gradient-to-tr flex justify-center items-center p-2 h-13 w-13 rounded-full"
                onClick={handleAddToCart}
              >
                <Plus className="w-4 h-4 fill-current" />
              </button>

              <span className="text-[#011425] lg:text-white dark:text-white flex justify-center items-center w-8 grow font-medium">
                {loading ? (
                  <Loading className="fill-current w-5 h-5 animate-spin" />
                ) : (
                  currentVariantAddedQuantity
                )}
              </span>

              <button
                className="text-[#5F5F5F] lg:text-white/70  dark:text-white/70 bg-gradient-to-t hover:bg-gradient-to-tr from-[#00B59C]/10 to-[#9CFFAC]/10 flex justify-center items-center p-2 h-13 w-13 rounded-full"
                onClick={handleRemoveFromCart}
                >
                  {
                    currentVariantAddedQuantity  > 1 ? <Minus className="w-4 h-4 fill-current" /> : <Trash className="w-6 h-6 fill-current" />
                  }
              </button>
            </div>
          ) : (
            loading ? (
              <div className="h-10 flex justify-center items-center px-6 bg-gradient-to-t from-green-600 to-green-300 rounded-full lg:order-2">
                <Loading className="fill-current w-5 h-5 animate-spin" />
              </div>
            ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-violet-500 hover:bg-violet-600 text-white rounded-full px-4 py-3 text-xs flex gap-2 items-center justify-center font-semibold transition-all duration-200 lg:order-2"
            >
              <Image
                src="/images/icons/bag.svg"
                alt="shopping bag"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              افزودن به سبد خرید
            </button>
          ))}

          {!!variantItem?.salePrice && (
            <div className="text-left text-white lg:order-1">
              {!!(variantItem?.profitPercentage || variantItem.profitPrice) && (
                <div className="flex flex-wrap justify-end gap-2 mb-1">
                  <span className="text-[#fe9f00] text-2xs font-semibold">
                    {variantItem.profitPercentage ? `${variantItem.profitPercentage} %   تخفیف` : `${numberWithCommas(variantItem.profitPrice! * (currentVariantAddedQuantity || 1))} ${currency} تخفیف `}
                  </span>
                  {!!variantItem.regularPrice && <span className="text-xs text-[#5f5f5f] lg:text-white dark:text-white/70 line-through">
                    {numberWithCommas(variantItem.regularPrice * (currentVariantAddedQuantity || 1))} {currency}
                  </span>}
                </div>
              )}

              <b className="text-[#011425] lg:text-white dark:text-white text-base font-semibold block">
                {numberWithCommas(variantItem.salePrice * (currentVariantAddedQuantity || 1))} {currency}
              </b>
            </div>
          )}
        </footer>
        {!isDesktop && <div className="h-20 lg:hidden" />}
      </SimplePortal>
    </>
  );
};

export default VariantFooter;