"use client";
import { Key, useEffect, useState } from "react";
import { useCartContext } from "../shopping-cart/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  Card,
  Img,
  Container,
  Info,
  OderButton,
  Price,
} from "../general-css/GeneralStyles";

export default function OrderProduct() {
  const { cartItems, addToCart, doesCartExists, getCartItems } =
    useCartContext();
  console.log("cartcontext hittas");
  const [items, setItem] = useState([]);

  async function fetchItems() {
    try {
      const response = await axios.get("http://localhost:8080/getItems", {});
      if (response.data) {
        console.log(response.data, "vad får jag");
        const filteredItems = response.data.filter(
          (fItem: { type: any }) => fItem.type === "knitwear"
        );

        setItem(filteredItems);
      }
    } catch (error) {
      console.log("fel vid hämtning av patterns", error);
    }
  }
  useEffect(() => {
    fetchItems();
  }, []);

  const handleClick = (clickedItem: {
    item_id: Key | undefined | null;
    name: string;
    description: string;
    image: string;
    price: number;
  }) => {
    addToCart({
      item_id: clickedItem.item_id as number,
      image: clickedItem.image,
      name: clickedItem.name,
      price: clickedItem.price,
      quantity: 1,
    });

    doesCartExists();
    toast(`${clickedItem.name} finns nu varukorgen!`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      style: {
        backgroundColor: "",
        color: "#000",
        border: "1px solid #4CAF50",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "16px",
        fontSize: "16px",
      },
    });
  };

  return (
    <>
      <Container>
        <h1>Stickade plagg</h1>
        <ToastContainer />
        {items !== null &&
          items.map(
            (item: {
              item_id: Key | undefined | null;
              name: string;
              description: string;
              image: string;
              price: number;
            }) => (
              <Card key={item.item_id}>
                <h2>{item.name}</h2>
                <Img
                  src={`http://localhost:8080${item.image}`}
                  alt="bild på projektet"
                />
                <Info>{item.description},</Info>
                <Price>{item.price} kr</Price>
                {/*
                <OderButton
                  type="button"
                  value="Handla"
                  onClick={() => handleClick(item)}
                /> */}
                {!cartItems.some(
                  (cartItem) => cartItem.item_id === item.item_id
                ) ? (
                  <OderButton
                    type="button"
                    value="Handla"
                    onClick={() => handleClick(item)}
                  />
                ) : (
                  <OderButton
                    type="button"
                    value="Tillagd i varukorgen"
                    disabled
                  />
                )}
              </Card>
            )
          )}
      </Container>
    </>
  );
}
