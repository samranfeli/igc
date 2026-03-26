/* eslint-disable  @typescript-eslint/no-explicit-any */

import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Skeleton from "@/components/shared/Skeleton";
import { getUserWishlist, removeWishlist } from "@/actions/commerce";
import { WishListItemType } from "@/types/commerce";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { toPersianDigits } from "@/helpers";
import WishlistItem from "@/components/authentication/profile/wishlist/WishlistItem";
import { setHeaderParams } from "@/redux/pages";
import ProfileSideBar from "@/components/authentication/profile/ProfileSideBar";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useRouter } from "next/router";
import LoadingFull from "@/components/shared/LoadingFull";

const Wishlist: NextPage = () => {
  const dispatch = useAppDispatch();

  const {isDesktop} = useIsDesktop();

    const router = useRouter();
    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    const userInfo = useAppSelector(state => state.authentication.user);
    const userLoading = useAppSelector(state => state.authentication.getUserLoading);

  const [products, setProducts] = useState<WishListItemType[]>([]);
  const [fetchMode, setFetchMode] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState<number>(1);

  const [deletedItemsId, setDeletedItemsId] = useState<number[]>([]);

  const [totalCount, setTotalCount] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      const userToken = localStorage.getItem("Token");
      if (!userToken) return;

      const res: any = await getUserWishlist({
        skipCount: 0,
        maxResultCount: 10,
        token: userToken,
      });
      if (res?.data?.result) {
        setTotalCount(res.data.result.totalCount || 0);
        setProducts(res.data.result.items);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    dispatch(
      setHeaderParams({
        headerParams: {
          title: "مورد علاقه ها",
        },
      }),
    );

    document.addEventListener("scroll", checkIsInView);
    window.addEventListener("resize", checkIsInView);

    return () => {
      dispatch(setHeaderParams({ headerParams: undefined }));
    };
  }, []);

  const loadMoreWrapper = useRef<HTMLDivElement>(null);

  const removeListener = () => {
    document.removeEventListener("scroll", checkIsInView);
    window.removeEventListener("resize", checkIsInView);
  };

  useEffect(() => {
    if (fetchMode) {
      if (products.length < 50 && page < 6 && (!totalCount || products.length < totalCount)) {
        addItems();
      } else {
        removeListener();
      }
    }
  }, [fetchMode, products.length]);

  const addItems = async () => {
    const userToken = localStorage.getItem("Token");
    if (!userToken) return;

    if (totalCount && products.length >= totalCount) { 

      removeListener();
      return;
    }
    setLoading(true);

    const productsResponse: any = await getUserWishlist({
      maxResultCount: 10,
      skipCount: page * 10,
      token: userToken,
    });

    if (productsResponse?.data?.result.items?.length) {
      setProducts((prevProducts) => [
        ...prevProducts,
        ...productsResponse.data.result.items,
      ]);
      setPage((p) => p + 1);
    } else {
      removeListener();
    }

    setLoading(false);
    setFetchMode(false);
  };

  const checkIsInView = () => {
    const targetTop = loadMoreWrapper.current?.getBoundingClientRect().top;
    const screenHeight = screen.height;
    if ( (!totalCount || products.length < totalCount) && targetTop && targetTop < (3 * screenHeight) / 5 && !fetchMode) {
      setFetchMode(true);
    }
  };

  const deleteItem = async (productId: number) => {
    const userToken = localStorage.getItem("Token");
    if (!userToken) return;

    const response: any = await removeWishlist(
      {
        productId: productId,
      },
      userToken,
    );

    if (response.data?.success) {
      setDeletedItemsId((ids) => [...ids, productId]);
    }
  };

    useEffect(() => {
    let redirectTimout: undefined | NodeJS.Timeout;
    if (!isAuthenticated && !userLoading) {
      redirectTimout = setTimeout(() => {
        router.push("/login");
      }, 500);
    }

    return (() => {
      clearTimeout(redirectTimout);
    })

  }, [isAuthenticated, userLoading, router]);

  if (!userInfo && !userLoading) {
    return null;
  }

  if (userLoading && !isAuthenticated) {
    return (
      <LoadingFull />
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-5 relative max-w-[1000px] mx-auto px-3.5 lg:px-5">
      <div className="max-lg:hidden relative">
        <div className="lg:sticky lg:top-[100px] lg:mb-6">
          {isDesktop && <ProfileSideBar activeItem="wishlist" />}
        </div>
      </div>
      <div className="lg:mt-4 lg:col-span-2 lg:sticky lg:top-5">
        <div className="max-lg:hidden font-semibold mt-1 mb-5 text-[#ff7189] text-sm">
          مورد علاقه ها
        </div>
        <div className="lg:py-5 lg:mb-6 lg:border lg:border-neutral-300 dark:lg:border-white/15 lg:p-4 lg:rounded-xl">
          <div className="border-b border-neutral-300 dark:border-white/15 pb-3 mb-4 text-left text-xs text-[#ca54ff]">
            {!!totalCount && `${toPersianDigits(totalCount.toString())} محصول`}
          </div>

          {products
            ?.filter((x) => !deletedItemsId.includes(x.product.id))
            ?.map((item) => (
              <WishlistItem
                key={item.id}
                product={item}
                onDelete={() => {
                  deleteItem(item.product.id);
                }}
              />
            ))}

          {!!loading &&
            [1, 2, 3, 4, 5].map((item) => (
              <div className="flex gap-3 mb-4" key={item}>
                <Skeleton
                  dark
                  type="image"
                  className="w-18 h-18 block shrink-0 rounded-2xl"
                />
                <div className="w-full">
                  <Skeleton className="h-4 w-full mt-2 mb-4" dark />
                  <Skeleton className="w-1/2" dark />
                </div>
              </div>
            ))}

          {!!(totalCount && products.length < totalCount) && (
            <div ref={loadMoreWrapper} className="h-32" />
          )}
        </div>
      </div>
    </div>
  );
};
export default Wishlist;
