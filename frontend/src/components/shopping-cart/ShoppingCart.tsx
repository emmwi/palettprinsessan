"use client";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useCartContext } from "./CartContext";
import {
  Card,
  Img,
  Container,
  Info,
  OderButton,
  Price,
} from "../general-css/GeneralStyles";
import axios from "axios";
import { useEffect } from "react";

export default function ShoppingCart() {
  const {
    cartItems,
    setCartItems,
    addToCart,
    doesCartExists,
    clearCart,
    removeFromCart,
    getCartTotal,
    getCartItems,
  } = useCartContext();

  useEffect(() => {
    getCartItems();
    console.log("här har vi kört get cart items");
  }, []);

  return (
    <>
      <div>
        <Container>
          {cartItems.length === 0 && <p> Din kundkorg är tom</p>}
          {cartItems.map((item, index) => (
            <Card key={index}>
              <h3>{item.name}</h3>
              <Img src={`http://localhost:8080${item.image}`} alt={item.name} />

              <p>{item.price} kr</p>

              <button
                onClick={() => {
                  removeFromCart(item);
                }}
              >
                <RiDeleteBin5Line />
              </button>
            </Card>
          ))}
        </Container>
        <p>Summa: {getCartTotal()} kr</p>
        {/* {cartItems.length > 0 ? <p>{cartItems.length}</p> : null} */}
      </div>
    </>
  );
}

// https://dev.to/anne46/cart-functionality-in-react-with-context-api-2k2f
