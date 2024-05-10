"use client";
import { LogoImg, HeaderSyle, LogoName } from "./HeaderStyles";

export default function Header() {
  return (
    <>
      <HeaderSyle>
        <LogoImg
          src="/palett2Small.jpg"
          alt="logo, black cat with rainbowcolor on maine"
        />
        <LogoName>Palettprinsessan</LogoName>
      </HeaderSyle>
    </>
  );
}
