"use client";
import Image from "next/image";

export default function Header() {
  return (
    <>
      <header>
        <div
          style={{
            position: "relative",
            width: "20em",
            height: "auto",
            aspectRatio: "1/1",
          }}
        >
          <Image
            src="/palett2.jpg"
            alt="logo, black cat with rainbowcolor on maine"
            layout="fill"
            objectFit="contain"
          />
        </div>
        {/* <img
          src="/palett2.jpg"
          alt="logo, black cat with rainbowcolor on maine"
        /> */}
        <h1>Palettprinsessan</h1>
        <ul>
          <li>om</li>
          <li>beställning</li>
          <li>mönster</li>
        </ul>
      </header>
    </>
  );
}
