"use client";

import Link from "next/link";
import { MenuImg, NavList } from "./NavbarSyles";

import { useState } from "react";
export default function Navbar() {
  const [isClicked, setIsClicked] = useState(false);

  function toggle() {
    setIsClicked((isClicked) => !isClicked);
  }
  // https://sentry.io/answers/how-do-you-show-or-hide-elements-in-react/
  return (
    <>
      <ul>
        <div onClick={toggle}>
          <MenuImg
            src="openMenu.svg"
            alt="hamburgermenu closed, click to open"
          />
        </div>
        {isClicked && (
          <>
            <div onClick={toggle}>
              <MenuImg
                src="closeMenu.svg"
                alt="hamburgermenu closed, click to open"
              />{" "}
            </div>
            <NavList>
              <Link href="/">Home</Link>
            </NavList>
            <NavList>
              <Link href="/about">About Us</Link>
            </NavList>
            <NavList>
              <Link href="/order">Beställning</Link>
            </NavList>
            <NavList>
              <Link href="/patterns">Mönster</Link>
            </NavList>
          </>
        )}
      </ul>
    </>
  );
}
