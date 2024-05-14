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
      <h1>Lägg till Projekt</h1>
      <AdminContainer>
        <AdminCard>
          <h2>Lägg till projekt</h2>
          <AdminForm>
            <label>Namn</label>
            <TextInput type="input" />
          </AdminForm>
          <AdminForm>
            <label>Bild:</label>
            <UpploadButton
              type="file"
              accept="image/png, image/jpeg, image/jpg"
            />
          </AdminForm>
          <AdminForm>
            <label>Beskrivning</label>
            <DescriptionTextArea name="text" placeholder="Beskrivning..." />
          </AdminForm>
          <AddButton type="submit" value="Lägg till projekt " />
        </AdminCard>
      </AdminContainer>
    </>
  );
}
