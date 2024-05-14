"use client";

import Link from "next/link";
import {
  Nav,
  NavList,
  NavUlist,
  CartIcons,
  CartContainer,
} from "../Navbar-Styles/NavbarSyles";

import Burger from "../BurgerMenu/Burger";
import { useBurgerMenuContext } from "../BurgerMenu/BurgerMenuContext";

export default function NavbarClient() {
  const { isopen, toggle } = useBurgerMenuContext();
  //Tar emot värde för isOpen från usecontext
  return (
    <>
      <CartContainer>
        <Link href="/shoppingcart">
          <CartIcons src="cart-shopping-solid.svg" alt="link to shoppingcart" />
        </Link>
      </CartContainer>
      <Nav>
        <Burger />
        {/* skickar props till styled component för navbar och specifikt navbarul */}
        <NavUlist $isopen={isopen}>
          <NavList>
            <Link href="/" onClick={toggle}>
              Projekt
            </Link>
          </NavList>
          <NavList>
            <Link href="/about" onClick={toggle}>
              Om Palettprinsessan
            </Link>
          </NavList>
          <NavList>
            <Link href="/patterns" onClick={toggle}>
              Mönster
            </Link>
          </NavList>
          <NavList>
            <Link href="/order" onClick={toggle}>
              Beställning
            </Link>
          </NavList>
        </NavUlist>
      </Nav>
    </>
  );
}
