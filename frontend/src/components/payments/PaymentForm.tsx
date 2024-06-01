"use client";
import { useEffect } from "react";
import { useCartContext } from "../shopping-cart/CartContext";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function PaymentForm() {
  const { cartItems, removeFromCart, getCartTotal, getCartItems } =
    useCartContext();

  const router = useRouter();

  useEffect(() => {
    getCartItems();
    console.log("här har vi kört get cart itemsi payment");
  }, []);

  const handlePaymentClick = () => {
    const sessionId = localStorage.getItem("sessionId");
    console.log("cartitems i handlepaymentclick", cartItems);
    console.log("cartitemtype", cartItems[0].type);
    console.log("cartitems i handlepaymend", cartItems);
    const cartItemTypes = cartItems.map((cartItem) => cartItem.type);
    console.log("Alla cartitemtyper:", cartItemTypes);
    axios
      .post("http://localhost:8080/paymentSuccessful", {
        sessionId,
        cartItems,
      })
      .then((response) => {
        console.log("deleteItemFromCart response", response.data);
        //ta brot sessionId från local storage
        localStorage.removeItem("sessionId");
        router.push("/paymentSuccess");
      })
      .catch((error) => {
        console.error("det gick inte att betala i frontend:", error);
      });
  };

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
