"use client";

import Link from "next/link";
import { Nav, NavList, NavUlist } from "./NavbarSyles";

import Burger from "./BurgerMenu/Burger";
import { useBurgerMenuContext } from "./BurgerMenu/BurgerMenuContext";

export default function Navbar() {
  const { isopen } = useBurgerMenuContext();
  //Tar emot värde för isOpen från usecontext
  return (
    <>
      <Nav>
        <Burger />
        {/* skickar props till styled component för navbar och specifikt navbarul */}
        {/* <NavUlist isopen={isopen.toString()}> */}
        <NavUlist $isopen={isopen}>
          <NavList>
            <Link href="/">Start</Link>
          </NavList>
          <NavList>
            <Link href="/about">Om</Link>
          </NavList>
          <NavList>
            <Link href="/order">Beställning</Link>
          </NavList>
          <NavList>
            <Link href="/patterns">Mönster</Link>
          </NavList>
        </NavUlist>
      </Nav>
    </>
  );
}
