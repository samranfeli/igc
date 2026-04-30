import Image from "next/image";

const FooterNamad = () => {
  return (
    <div className="flex gap-4 justify-center bg-[#f0eff2] rounded-xl p-5">
      <a
        referrerPolicy="origin"
        target="_blank"
        href="https://trustseal.enamad.ir/?id=665612&Code=KA7pgQKtQ7wh1GDHIjmy2QSoVfv9WZou"
      >
        <Image
          referrerPolicy="origin"
          src="/images/enamad.png"
          alt="نماد اعتماد"
          width={80}
          height={96}
          className="h-24 w-auto"
        />
      </a>

      <Image
        referrerPolicy="origin"
        id="rgvjsizpfukzapfufukzrgvj"
        className="h-24 w-auto cursor-pointer"
        onClick={() => {
          window.open(
            "https://logo.samandehi.ir/Verify.aspx?id=396563&p=xlaopfvlgvkadshwgvkaxlao",
            "Popup",
            "toolbar=no, scrollbars=no, location=no, statusbar=no, menubar=no, resizable=0, width=450, height=630, top=30",
          );
        }}
        alt="logo-samandehi"
        src="/images/resaneh.jpg"
        width={81}
        height={96}
      />

      <a
        referrerPolicy="origin"
        target="_blank"
        href="https://qr.mojavez.ir/track/19893812"
      >
        <Image
          referrerPolicy="origin"
          src="/images/kasbokar.png"
          alt="نماد کسب و کار های مجازی"
          width={80}
          height={96}
          className="h-24 w-auto"
        />
      </a>

      <a href="https://emalls.ir/Shop/74254/" target="_blank">
        <Image
          className="h-20 w-auto cursor-pointer"
          width={54}
          height={80}
          alt="نشان اعتباری ایمالز"
          referrerPolicy="origin"
          src="/images/emalls-neshan.svg"
        />
      </a>
    </div>
  );
};

export default FooterNamad;
