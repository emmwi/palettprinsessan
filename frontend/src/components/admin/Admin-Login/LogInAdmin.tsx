"use client";
import { useState } from "react";
import {
  TextInput,
  AddButton,
  AdminCard,
  AdminForm,
  AdminContainer,
} from "../../../components/admin/Admin-Syles/AdminStyles";
// import { redirect } from "next/navigation"

// import { useRouter } from "next/router";

export default function LoginAdmin() {
  const [errorMessage, setErrorMessage] = useState("");
  // const router = useRouter();
  function handleSubmit() {
    // event.preventDefault();
    // router.push("/admin/productview");
    // redirect("/admin/productview");
  }

  // async function fetchAdmin(values) {
  //   try {
  //     const response = await fetch("http://localhost:8080/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(values),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();

  //       // navigate(`/profile/${data.token}`);
  //     } else {
  //       const errorData = await response.json();
  //       setErrorMessage(errorData.message);
  //     }
  //   } catch (error) {
  //     setErrorMessage(
  //       "can not find user, are you sure you exist? (Gotta be picky with UPPERCASE and lowercase here).You should make an account if you aint got one! "
  //     );
  //   }
  // }
  return (
    <>
      <AdminContainer>
        <AdminCard>
          <h2>Logga In</h2>
          <AdminForm onSubmit={handleSubmit}>
            <label>Namn</label>
            <TextInput type="input" name="name" />
            <label>Lösenord:</label>
            <TextInput type="password" name="password" />
            <AddButton type="submit" value="logga in" />
            {errorMessage && <p>{errorMessage}</p>}
          </AdminForm>
        </AdminCard>
      </AdminContainer>
    </>
  );
}
