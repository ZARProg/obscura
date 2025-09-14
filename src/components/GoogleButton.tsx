"use client";

import React, { useState } from "react";
import Image from "next/image";

type Props = {
  onClick?: () => void;
  text?: string;
  className?: string;
};

export default function GoogleButton({ onClick, text = "Sign in with Google", className = "" }: Props) {
  const LOCAL_LOGO = "/google.svg";
  const EXTERNAL_LOGO = "https://developers.google.com/identity/images/g-logo.png";

  const [logo, setLogo] = useState<string>(LOCAL_LOGO);
  const [useImgTag, setUseImgTag] = useState<boolean>(false);

  // Jika Image gagal load (mis. file corrupt / 404) kita switch ke <img> dengan link external
  const handleImageError = () => {
    setLogo(EXTERNAL_LOGO);
    setUseImgTag(true);
  };

  return (
    <button
      onClick={onClick}
      className={
        "mt-4 w-full py-3 bg-white text-black rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 " +
        className
      }
    >
      {/* pakai next/image hanya untuk asset lokal; pakai <img> untuk external */}
      {!useImgTag && logo.startsWith("/") ? (
        <Image
          src={logo}
          alt="Google"
          width={20}
          height={20}
          className="w-5 h-5"
          onError={handleImageError}
        />
      ) : (
        <img
          src={logo}
          alt="Google"
          className="w-5 h-5"
          // kalau external gagal (sangat jarang), tetap pakai external sebagai fallback
          onError={() => setLogo(EXTERNAL_LOGO)}
        />
      )}
      <span>{text}</span>
    </button>
  );
}
