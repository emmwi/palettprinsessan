"use client";
import { useBurgerMenuContext } from "./BurgerMenuContext";
import { BurgerMenu } from "./BurgerSyle";

export default function Burger() {
  const { isopen, toggle } = useBurgerMenuContext();

  console.log("Props in BurgerMenu:", { isopen, toggle });
  return (
    <BurgerMenu $isopen={isopen} onClick={toggle}>
      <div />
      <div />
      <div />
    </BurgerMenu>
  );
}

//källa: https://www.youtube.com/watch?v=GGkBwpxV7AI&t=1255s
