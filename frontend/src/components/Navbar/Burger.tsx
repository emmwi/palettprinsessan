"use client";
import { useBurgerMenuContext } from "./BurgerMenuContext";
import { BurgerMenu } from "./BurgerSyle";

export default function Burger() {
  const { isOpen, toggle } = useBurgerMenuContext();

  console.log("Props in BurgerMenu:", { isOpen, toggle });
  return (
    <BurgerMenu isopen={isOpen} onClick={toggle}>
      <div />
      <div />
      <div />
    </BurgerMenu>
  );
}

// brugermenu https://www.youtube.com/watch?v=GGkBwpxV7AI
