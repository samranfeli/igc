import Image from "next/image";
import Link from "next/link";
import FooterNamad from "./FooterNamad";

const DesktopFooter = () => {
  const socialMediaLink: {
    title: string;
    url: string;
    iconUrl: string;
  }[] = [
    {
      title: "تلگرام",
      url: "https://t.me/irangamecenter_official",
      iconUrl: "/images/icons/telegram.svg",
    },
    {
      title: "آپارات",
      url: "https://www.aparat.com/irangamecenter.com ",
      iconUrl: "/images/icons/aparat.svg",
    },
    {
      title: "ایکس",
      url: "https://x.com/irangamecenter ",
      iconUrl: "/images/icons/x.svg",
    },
    {
      title: "اینستاگرام",
      url: "https://www.instagram.com/irangamecenter_official",
      iconUrl: "/images/icons/insta.svg",
    },
  ];

  const contactLinks = [
    {
      url: "/",
      label: "فروشگاه",
    },
    {
      url: "/products",
      label: "پیشنهادهای ویژه",
    },
    {
      url: "/terms",
      label: "قوانین و مقررات",
    },
    {
      url: "/about",
      label: "درباره ما",
    },
    {
      url: "/contact",
      label: "تماس با ما",
    },
  ];

  return (
    <footer className="px-5 border-t border-neutral-300 dark:border-white/15">
      <div className="flex justify-between items-center gap-5 py-10">
        <Link href="/" className="flex gap-4">
          <Image src="/logo.svg" alt="irangamecenter" width={50} height={50} />
          <div>
            <strong className="block text-xl font-bold">ایران گیم سنتر</strong>
            <span className="text-xs">فروشگاه آنلاین اکانت بازی</span>
          </div>
        </Link>

        <div className="flex items-center gap-10">
          <div className="flex gap-5 items-center">
            {contactLinks.map(item => (
              <Link
                prefetch={false}
                key={item.label}
                href={item.url}
                className="text-xs"
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <FooterNamad />

        </div>
      </div>
      <div className="flex justify-between items-center py-3 border-t border-neutral-300 dark:border-white/15">
        <div className="text-[11px]">
          © ۱۴۰۴ - تمام حقوق مربوط به وب سایت ایران گیم سنتر می باشد.
        </div>

          <div className="flex gap-3 items-center">
            {socialMediaLink.map((item) => (
              <Link
                key={item.title}
                title={item.title}
                href={item.url}
                className="block p-2 rounded-full bg-black/10 dark:bg-white/15"
              >
                <Image
                  src={item.iconUrl}
                  alt={item.title}
                  className="w-8 h-8"
                  width={32}
                  height={32}
                />
              </Link>
            ))}
          </div>

      </div>

    </footer>
  );
};
export default DesktopFooter;
