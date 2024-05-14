"use client";
import AddPattern from "./Add-Pattern/AddPattern";
import AddProduct from "./Add-Poduct/AddProduct";

import { AdminContainer } from "../Admin-Syles/AdminStyles";
export default function addPatternAndProduct() {
  return (
    <>
      <h1>Lägg till Produkt eller Mönster</h1>
      <AdminContainer>
        <AddPattern />
        <AddProduct />
      </AdminContainer>
    </>
  );
}
