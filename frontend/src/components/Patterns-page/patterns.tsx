"use client";

import { Key, useEffect, useState } from "react";
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
  const [patterns, setPatterns] = useState<patterns[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/patterns")
      .then((response) => response.json())
      .then((result) => {
        setPatterns(result);
      });
  }, []);

  return (
    <>
      <Container>
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

                <OderButton type="button" value="Handla" />
              </Card>
            )
          )}
      </Container>
    </>
  );
}

// https://stackoverflow.com/questions/30887225/use-special-characters-%C3%A5%C3%A4%C3%B6-in-the-postgresql-shell
