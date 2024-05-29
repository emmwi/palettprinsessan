// import PatternContent from "../../../components/Patterns-page/patterns";
// import OrderProduct from "../../../components/order-product/OrderProduct";
// export default function ViewProducts() {
//   return (
//     <>
//       <h1>Översikt Produkter</h1>
//       <PatternContent />
//       <OrderProduct />
//     </>
//   );
// }

"use client";
import axios from "axios";
import { Key, useEffect, useState } from "react";
import {
  Card,
  Img,
  Container,
  Info,
  OderButton,
  Price,
} from "../../../components/general-css/GeneralStyles";

export default function ViewProducts() {
  const [items, setItem] = useState([]);
  const [message, setMessage] = useState("");
  async function fetchItems() {
    try {
      const response = await axios.get("http://localhost:8080/getItems", {});
      if (response.data) {
        setItem(response.data);
      }
    } catch (error) {
      console.log("fel vid hämtning av produkter", error);
    }
  }
  useEffect(() => {
    fetchItems();
  }, [message]);

  const handleClick = (clickedItem: {
    item_id: Key | undefined | null;
    name: string;
    description: string;
    image: string;
    price: number;
    type: string;
  }) => {
    axios
      .post("http://localhost:8080/adminDeleteItems", {
        item_id: clickedItem.item_id,
      })
      .then((response) => {
        setMessage(response.data.message);
        fetchItems();
      })
      .catch((error) => {
        console.log("det gick inte att ta bort projektet", error);
      });
  };

  return (
    <>
      <Container>
        <h1>Översikt Produkter</h1>
        {message.length > 0 ? <p>{message}</p> : null}
        {items !== null &&
          items.map(
            (item: {
              item_id: Key | undefined | null;
              name: string;
              description: string;
              image: string;
              price: number;
              type: string;
              pdf: string;
            }) => (
              <Card key={item.item_id}>
                <h2>Namn: {item.name}</h2>
                <Img
                  src={`http://localhost:8080${item.image}`}
                  alt="bild på projektet"
                />
                <Info>Sort: {item.type}</Info>
                <Info>Beskrivning: {item.description}</Info>
                <Price>Pris: {item.price} kr</Price>
                {/* <embed
                  src={`http://localhost:8080${item.pdf}`}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                /> */}

                <OderButton
                  type="button"
                  value="Ta bort produkt"
                  onClick={() => {
                    handleClick(item);
                  }}
                />
              </Card>
            )
          )}
      </Container>
    </>
  );
}
