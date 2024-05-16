"use client";

import Link from "next/link";
import { Nav, NavList, NavUlist } from "../Navbar-Styles/NavbarSyles";

import Burger from "../BurgerMenu/Burger";
import { useBurgerMenuContext } from "../BurgerMenu/BurgerMenuContext";

export default function NavbarAdmin() {
  const { isopen, toggle } = useBurgerMenuContext();
  //Tar emot värde för isOpen från usecontext
  return (
    <>
      <Nav>
        <Burger />
        {/* skickar props till styled component för navbar och specifikt navbarul */}

        <NavUlist $isopen={isopen}>
          <NavList>
            <Link href="/admin/addproducts" onClick={toggle}>
              Lägg till Produkt
            </Link>
          </NavList>
          <NavList>
            <Link href="/admin/addprojects" onClick={toggle}>
              Lägg till Projekt
            </Link>
          </NavList>
          <NavList>
            <Link href="/admin/vieworders" onClick={toggle}>
              Översikt Beställningar
            </Link>
          </NavList>
          <NavList>
            <Link href="/admin/viewproducts" onClick={toggle}>
              Översikt Produkter
            </Link>
          </NavList>
          <NavList>
            <Link href="/admin/viewprojects" onClick={toggle}>
              Översikt Projekt
            </Link>
          </NavList>
        </NavUlist>
      </Nav>
    </>
  );
}
