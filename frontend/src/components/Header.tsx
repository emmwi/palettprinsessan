"use client";
import LogoImg from "./HeaderStyles";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <>
      <header>
        <LogoImg
          src="/palett2.jpg"
          alt="logo, black cat with rainbowcolor on maine"
        />
        <h1>Palettprinsessan</h1>
        <Navbar />
      </header>
    </>
  );
}
