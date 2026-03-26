import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAppSelector } from "@/hooks/use-store";

import EdiPersonalInfo from "@/components/authentication/profile/EdiPersonalInfo";
import Tab from "@/components/shared/Tab";
import EditContactInfo from "@/components/authentication/profile/EditContactInfo";
import ProfileSideBar from "@/components/authentication/profile/ProfileSideBar";
import { useIsDesktop } from "@/hooks/use-is-desktop";

export default function ProfileEdit() {
  const router = useRouter();
  const {isDesktop} = useIsDesktop();

  const isAuthenticated = useAppSelector(
    (state) => state.authentication.isAuthenticated,
  );
  const userInfo = useAppSelector((state) => state.authentication.user);

  const userLoading = useAppSelector(
    (state) => state.authentication.getUserLoading,
  );

  useEffect(() => {
    let redirectTimout: undefined | NodeJS.Timeout;

    if (!isAuthenticated && !userLoading) {
      redirectTimout = setTimeout(() => {
        router.push("/login");
      }, 1000);
    }

    return () => {
      clearTimeout(redirectTimout);
    };
  }, [isAuthenticated, userLoading, router]);

  if (!userInfo && !userLoading) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-5 relative max-w-[1000px] mx-auto px-3.5 lg:px-5">
      <div className="max-lg:hidden relative">
        <div className="lg:sticky lg:top-[100px] lg:mb-6">
          {isDesktop && <ProfileSideBar activeItem="edit" />}
        </div>
      </div>
      <div className="lg:mt-4 lg:col-span-2 lg:sticky lg:top-5">
        <div className="max-lg:hidden font-semibold mt-1 mb-5 text-[#ff7189] text-sm">
          اطلاعات کاربری
        </div>
        <div className="lg:py-5 lg:mb-6 lg:border lg:border-neutral-300 dark:lg:border-white/15 lg:p-4 lg:rounded-xl">
          {!!isAuthenticated && (
            <div>
              <Tab
                items={[
                  {
                    key: 1,
                    children: <EdiPersonalInfo />,
                    label: "اطلاعات شخصی",
                  },
                  {
                    key: 2,
                    children: <EditContactInfo />,
                    label: "اطلاعات تماس",
                  },
                ]}
                style="3"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
