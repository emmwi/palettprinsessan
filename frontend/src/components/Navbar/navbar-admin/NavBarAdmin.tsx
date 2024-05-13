"use client";

import Link from "next/link";
import { Nav, NavList, NavUlist } from "../Navbar-Styles/NavbarSyles";

import Burger from "../BurgerMenu/Burger";
import { useBurgerMenuContext } from "../BurgerMenu/BurgerMenuContext";

export default function NavbarAdmin() {
  const { isopen } = useBurgerMenuContext();
  //Tar emot värde för isOpen från usecontext
  return (
    <>
      <Nav>
        <Burger />
        {/* skickar props till styled component för navbar och specifikt navbarul */}

        <NavUlist $isopen={isopen}>
          <NavList>
            <Link href="/admin/vieworders">översikt beställningar</Link>
          </NavList>
          <NavList>
            <Link href="/admin/viewproducts">översikt produkter</Link>
          </NavList>
          <NavList>
            <Link href="/admin/addproducts">lägg till produkt</Link>
          </NavList>
          <NavList>
            <Link href="/admin/viewprojects">översikt projekt</Link>
          </NavList>
          <NavList>
            <Link href="/admin/addprojects">lägg till projekt</Link>
          </NavList>
        </NavUlist>
      </Nav>
    </>
  );
}
