"use client";
import {
  TextInput,
  AddButton,
  UpploadButton,
  AdminCard,
  DescriptionTextArea,
  AdminForm,
} from "../../Admin-Syles/AdminStyles";
export default function AddPattern() {
  return (
    <>
      <AdminCard>
        <h2>Lägg till Mönster</h2>
        <AdminForm>
          <label>Namn:</label>
          <TextInput type="input" />
        </AdminForm>
        <AdminForm>
          <label>Bild:</label>
          <UpploadButton type="file" accept="image/png, image/jpeg" />
        </AdminForm>
        <AdminForm>
          <label>Pdf:</label>
          <UpploadButton type="file" accept="application/pdf" />
        </AdminForm>
        <AdminForm>
          <label>Beskrivning</label>
          <DescriptionTextArea name="text" placeholder="Beskrivning..." />
        </AdminForm>
        <label>Pris:</label>
        <TextInput type="input" />
        <AddButton type="submit" value="Lägg Till Mönster " />
      </AdminCard>
    </>
  );
}
