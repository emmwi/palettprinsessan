"use client";
import {
  TextInput,
  AddButton,
  UpploadButton,
  AdminCard,
  DescriptionTextArea,
  AdminContainer,
  AdminForm,
} from "../Admin-Syles/AdminStyles";
export default function AddProject() {
  return (
    <>
      <AdminContainer>
        <AdminCard>
          <h2>Lägg till projekt</h2>
          <AdminForm
            action="http://localhost:8080/project"
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

            <AddButton type="submit" value="Lägg till projekt " />
          </AdminForm>
        </AdminCard>
      </AdminContainer>
    </>
  );
}
