"use client";
import { useCartContext } from "../shopping-cart/CartContext";
import axios from "axios";
import { Key, useEffect, useState, useContext } from "react";
import {
  Card,
  Img,
  Container,
  Info,
  OderButton,
  Price,
} from "../general-css/GeneralStyles";

export default function PatternContent() {
  const { cartItems, addToCart, doesCartExists } = useCartContext();
  console.log("cartcontext hittas");

  const [items, setItem] = useState([]);

  async function fetchItems() {
    try {
      const response = await axios.get("http://localhost:8080/getItems", {});
      if (response.data) {
        console.log(response.data, "vad får jag");
        const filteredItems = response.data.filter(
          (fItem: { type: any }) => fItem.type === "pattern"
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
  };

  return (
    <>
      <Container>
        <h1>Mönster</h1>
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

                <OderButton
                  type="button"
                  value="Handla"
                  onClick={() => handleClick(item)}
                />
              </Card>
            )
          )}
      </Container>
    </>
  );
}

// https://stackoverflow.com/questions/30887225/use-special-characters-%C3%A5%C3%A4%C3%B6-in-the-postgresql-shell
