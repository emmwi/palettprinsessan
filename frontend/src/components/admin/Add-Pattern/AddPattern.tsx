import {
  TextInput,
  AddButton,
  UpploadButton,
  AdminCard,
  DescriptionTextArea,
  AdminForm,
  AdminContainer,
} from "../Admin-Syles/AdminStyles";
export default function AddPattern() {
  // function handleSubmit(event: { preventDefault: () => void }) {
  //   // event.preventDefault();
  //   alert("The browser will not reload when the alert box is closed.");
  // }
  return (
    <>
      <AdminContainer>
        <AdminCard>
          <h2>Lägg till Mönster</h2>
          <AdminForm
            action="http://localhost:8080/patterns"
            method="post"
            encType="multipart/form-data"
            // onSubmit={handleSubmit}
          >
            <label>Namn</label>
            <TextInput type="input" name="name" />
            <label>Bild:</label>
            <UpploadButton type="file" accept="image/*" name="image" />
            <label>Pdf:</label>
            <UpploadButton type="file" accept="application/pdf" name="pdf" />
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
