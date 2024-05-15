"use client";
import {
  TextInput,
  AddButton,
  UpploadButton,
  AdminCard,
  DescriptionTextArea,
  AdminForm,
  AdminContainer,
} from "../../Admin-Syles/AdminStyles";
export default function AddPattern() {
  return (
    <>
      <AdminContainer>
        <AdminCard>
          <h2>Lägg till Stickat Plagg</h2>
          <AdminForm
            action="http://localhost:8080/knitwear"
            method="post"
            encType="multipart/form-data"
          >
            <label>Namn</label>
            <TextInput type="input" name="name" />
            <label>Bild:</label>
            <UpploadButton type="file" accept="image/*" name="image" />
            <label>Beskrivning</label>
            <DescriptionTextArea
              name="description"
              placeholder="Beskrivning..."
            />
            <label>Pris:</label>
            <TextInput type="input" name="price" />
            <AddButton type="submit" value="Lägg till projekt " />
          </AdminForm>
        </AdminCard>
      </AdminContainer>
    </>
  );
}
