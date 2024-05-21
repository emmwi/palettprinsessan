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
  type patterns = {
    pattern_id: number;
    name: string;
    description: string;
    image: string;
    pdf: string;
    price: number;
  };

  const { cartItems, addToCart, doesCartExists } = useCartContext();
  console.log("cartcontext hittas");

  const [patterns, setPatterns] = useState<patterns[]>([]);
  const [items, setItem] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/patterns")
      .then((response) => response.json())
      .then((result) => {
        setPatterns(result);
      });
  }, []);

  // async function fetchItems() {
  //   try {
  //     const response = await axios.get("http://localhost:8080/getItems", {});
  //     if (response.data) {
  //       setItem(response.data);
  //     }
  //   } catch (error) {
  //     console.log("fel vid hämtning av items", error);
  //   }
  // }
  // useEffect(() => {
  //   fetchItems();
  // }, []);

  const handleClick = (clickedItem: {
    pattern_id: Key | undefined | null;
    name: string;
    description: string;
    image: string;
    price: number;
  }) => {
    // addToCart({
    //   id: clickedItem.item_id as number,
    //   image: clickedItem.image,
    //   name: clickedItem.name,
    //   price: clickedItem.price,
    //   quantity: 1,
    // });
    addToCart({
      id: clickedItem.pattern_id as number,
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
        {/* <h1>Mönster</h1>
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
                <h2>{ListItem.name}</h2>
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
          )} */}
        <h1>Mönster</h1>
        {patterns !== null &&
          patterns.map(
            (pattern: {
              pattern_id: Key | undefined | null;
              name: string;
              description: string;
              image: string;
              price: number;
            }) => (
              <Card key={pattern.pattern_id}>
                <h2>{pattern.name}</h2>
                <Img
                  src={`http://localhost:8080${pattern.image}`}
                  alt="bild på projektet"
                />
                <Info>{pattern.description},</Info>
                <Price>{pattern.price} kr</Price>

                <OderButton
                  type="button"
                  value="Handla"
                  onClick={() => handleClick(pattern)}
                />
              </Card>
            )
          )}
      </Container>
    </>
  );
}

// https://stackoverflow.com/questions/30887225/use-special-characters-%C3%A5%C3%A4%C3%B6-in-the-postgresql-shell
