import { useIsDesktop } from "@/hooks/use-is-desktop";
import SimplePortal from "../shared/layout/SimplePortal";
import Bell from "../icons/Bell";
import ProductNotificationSetting from "../shared/layout/header/ProductNotificationSetting";

type Props = {
  productId: number;
  variantId?: number;
};

const NotifyWhenAvailable: React.FC<Props> = (props) => {
  const {isDesktop} = useIsDesktop();

  return (
    <SimplePortal
      selector={
        isDesktop ? "variant-footer-desktop-modal" : "fixed_bottom_portal"
      }
    >
      <footer className="max-lg:z-50 max-lg:min-h-20 max-lg:fixed bottom-0 left-0 max-lg:bg-white dark:text-white dark:max-lg:bg-[#192a39] max-lg:px-4 max-lg:py-3 w-full transition-all duration-200">
        <ProductNotificationSetting
          productId={props.productId}
          variantId={props.variantId}
          type="ProductAvailable"
          buttonClassName="bg-violet-500 hover:bg-violet-600 text-white rounded-full px-4 py-3.5 text-xs flex gap-2 items-center justify-center w-full font-semibold transition-all duration-200"
        >
            <Bell className="w-5 h-5 fill-current" />
            موجود شد خبرم کن 
        </ProductNotificationSetting>
      </footer>

      {!isDesktop && <div className="h-20 lg:hidden" />}
      
    </SimplePortal>
  );
};

export default NotifyWhenAvailable;
