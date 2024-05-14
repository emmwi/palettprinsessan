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
        <h2>Lägg till Stickat Plagg</h2>
        <AdminForm>
          <label>Namn:</label>
          <TextInput type="input" />
        </AdminForm>
        <AdminForm>
          <label>Bild:</label>
          <UpploadButton type="file" accept="image/png, image/jpeg" />
        </AdminForm>
        <AdminForm>
          <label>Beskrivning</label>
          <DescriptionTextArea name="text" placeholder="Beskrivning..." />
        </AdminForm>
        <AdminForm>
          <label>Pris:</label>
          <TextInput type="input" />
        </AdminForm>
        <AddButton type="submit" value="Lägg Till Plagg " />
      </AdminCard>
    </>
  );
}
