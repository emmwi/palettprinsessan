"use client";
import { useEffect } from "react";
import { useCartContext } from "../shopping-cart/CartContext";

export default function PaymentForm() {
  const { cartItems, handlePaymentClick, getCartTotal, getCartItems } =
    useCartContext();

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <>
      {cartItems.length === 0 && <p> Din kundkorg är tom</p>}
      {cartItems.map((item, index) => (
        <dl key={index}>
          <dt>
            {item.name}: <span>{item.price} kr</span>
          </dt>
        </dl>
      ))}
      <p>Summa: {getCartTotal()} kr</p>
      <input type="button" value="Slutför köp" onClick={handlePaymentClick} />
    </>
  );
}
