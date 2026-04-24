/* eslint-disable  @typescript-eslint/no-explicit-any */

import MoreIcon from "@/components/icons/MoreIcon";
import ModalPortal from "../ModalPortal";
import { useEffect, useState } from "react";
import { setBodyScrollPosition, setBodyScrollable } from "@/redux/stylesSlice";
import { useAppDispatch } from "@/hooks/use-store";
import CloseSimple from "@/components/icons/CloseSimple";
import More from "./More";
import { useIsDesktop } from "@/hooks/use-is-desktop";

type Props = {
  productId: number;
  variantId?: number;
};

const MoreWrapper: React.FC<Props> = (props) => {

  const dispatch = useAppDispatch();

  const {isDesktop} = useIsDesktop();

  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [slideInDetails, setSlideInDetails] = useState<boolean>(false);

  useEffect(() => {
    if (openDetails) {
      setSlideInDetails(true);
      dispatch(setBodyScrollable(false));
      dispatch(setBodyScrollPosition(window?.pageYOffset || 0));
    } else {
      dispatch(setBodyScrollable(true));
    }
  }, [openDetails]);

  useEffect(() => {
    if (!slideInDetails) {
      setTimeout(() => {
        setOpenDetails(false);
      }, 300);
    }
  }, [slideInDetails]);

  if(isDesktop){
    return(
      <div className="absolute top-3 right-3 bg-black/60 flex flex-col gap-3 rounded-lg p-3 lg:text-white">
        <More productId={props.productId} variantId={props.variantId} />
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        aria-label="بیشتر"
        onClick={() => {
          setOpenDetails(true);
        }}
      >
        <MoreIcon className="w-7 h-7 stroke-current fill-none stroke-2" />
      </button>
      <ModalPortal show={openDetails} selector="modal_portal">
        <div
          className="bg-black/50 backdrop-blur-sm fixed top-0 left-0 right-0 bottom-0"
          onClick={() => {
            setSlideInDetails(false);
          }}
        />

        <div
          className={`bg-white dark:bg-[#192a39] text-neutral-800 pb-10 dark:text-white rounded-t-2xl max-h-95-screen hidden-scrollbar overflow-y-auto fixed w-full md:max-w-lg safePadding-b transition-all left-0 max-md:right-0 md:right-1/2 md:translate-x-1/2 ${slideInDetails ? "bottom-0" : "-bottom-[80vh]"}`}
        >
          <div className="flex flex-col justify-between text-xs">
            <div className="flex justify-enf items-center pt-5 px-4 mb-4">
              <button
                type="button"
                onClick={() => {
                  setSlideInDetails(false);
                }}
              >
                <CloseSimple className="w-6 h-6 fill-current" />
              </button>
            </div>

            <div className="px-4">              
              <More productId={props.productId} variantId={props.variantId} />
            </div>
          </div>
        </div>
      </ModalPortal>
    </>
  );
};

export default MoreWrapper;
