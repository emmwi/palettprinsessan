"use client";
import { Key, useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  Img,
  Container,
  Info,
  OderButton,
  Price,
} from "../general-css/GeneralStyles";

export default function OrderProduct() {
  type knitwears = {
    knitwear_id: number;
    name: string;
    description: string;
    image: string;
    price: number;
  };
  const [knitwears, setKnitwears] = useState<knitwears[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/knitwears")
      .then((response) => response.json())
      .then((result) => {
        setKnitwears(result);
      });
  }, []);

  return (
    <>
      <Container>
        <h1>Stickade plagg</h1>
        {knitwears !== null &&
          knitwears.map(
            (knitwear: {
              knitwear_id: Key | undefined | null;
              name: string;
              description: string;
              image: string;
              price: number;
            }) => (
              <Card key={knitwear.knitwear_id}>
                <h2>{knitwear.name}</h2>
                <Img
                  src={`http://localhost:8080${knitwear.image}`}
                  alt="bild på stickat plagg"
                />
                <Info>{knitwear.description}</Info>
                <Price>{knitwear.price} kr </Price>
                <OderButton type="button" value="Handla" />
              </Card>
            )
          )}
      </Container>
    </>
  );
}
