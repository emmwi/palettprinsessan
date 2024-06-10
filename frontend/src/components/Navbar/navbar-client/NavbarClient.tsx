"use client";

import Link from "next/link";
import {
  Nav,
  NavList,
  NavUlist,
  CartIcons,
  CartContainer,
  CartSpan,
} from "../Navbar-Styles/NavbarSyles";
import { useCartContext } from "../../shopping-cart/CartContext";
import Burger from "../BurgerMenu/Burger";
import { useBurgerMenuContext } from "../BurgerMenu/BurgerMenuContext";
import { useEffect } from "react";

export default function NavbarClient() {
  //Tar emot värde för isOpen från usecontext för brugermenu
  const { isopen, toggle } = useBurgerMenuContext();
  //Tar emot värde för cartItems från usecontext för cart
  const { cartItems, getCartItems, cartItemNavabar } = useCartContext();

  /*kör getCartItems om cartItemNavabar ändras, den går från true/false varje gång handpayment körs i context. - gör såhär då det inte funkade att lyssna på att cartitems ändrade sig (evig loop)*/
  useEffect(() => {
    getCartItems();
  }, [cartItemNavabar]);

  return (
    <>
      <CartContainer>
        <Link href="/shoppingcart">
          {cartItems.length > 0 ? (
            <CartSpan>{cartItems.length}</CartSpan>
          ) : null}

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
