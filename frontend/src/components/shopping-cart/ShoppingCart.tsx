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

export default function ShoppingCart() {
  const { cartItems, addToCart, doesCartExists, clearCart, removeFromCart } =
    useCartContext();

  return (
    <>
      <Container>
        {cartItems.length === 0 && <p> Din kundkorg är tom</p>}
        {cartItems.map((item) => (
          <Card key={item.id}>
            <h3>{item.name}</h3>
            <Img src={`http://localhost:8080${item.image}`} alt={item.name} />

            <p>{item.price} kr</p>

            {/* <button
              onClick={() => {
                clearCart();
              }}
            >
              Clear cart
            </button> */}
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
    </>
  );
}

// https://dev.to/anne46/cart-functionality-in-react-with-context-api-2k2f
