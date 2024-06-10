import cors from "cors";
import * as dotenv from "dotenv";
import { Client } from "pg";
import express from "express";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import {
  Project,
  Item,
  Fields,
  RequestBody,
  CartItem,
  Carts,
} from "./backendTypes/types";
dotenv.config();
//connection med databasen
const client = new Client({
  connectionString: process.env.PGURI,
});
client.connect();

__dirname = path.dirname(__filename);

const app = express(),
  port = process.env.PORT || 8080;
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//visar vart static ska kolla på i för mapp
app.use(
  "/uploads/projects",
  express.static(path.join(__dirname, "uploads", "projects"))
);
app.use(
  "/uploads/patternsPDF",
  express.static(path.join(__dirname, "uploads", "patternsPDF"))
);
app.use(
  "/uploads/knitwear",
  express.static(path.join(__dirname, "uploads", "knitwear"))
);

//visar vilken mapp man ska lägga uppladdning av bilder/pdf
const upload = multer({ dest: path.join(__dirname, "uploads", "projects") });
const uploadKnitwear = multer({
  dest: path.join(__dirname, "uploads", "knitwear"),
});
const uploadPattern = multer({
  dest: path.join(__dirname, "uploads", "patternsPDF"),
});

//hämta projekten
app.get("/projects", async (_request, response) => {
  const { rows } = await client.query("SELECT * FROM projects ");
  const projectData = rows.map((project: Project) => ({
    project_id: project.project_id,
    name: project.name,
    description: project.description,
    image: `/uploads/projects/${project.image}`,
  }));
  return response.send(projectData);
});

//hämtar alla items som finns att köpa
app.get("/getItems", async (_request, response) => {
  try {
    const { rows } = await client.query<Item>("SELECT * FROM items");

    const itemData = rows.map((items: Item) => ({
      item_id: items.item_id,
      name: items.name,
      description: items.description,
      image:
        items.type === "knitwear"
          ? `/uploads/knitwear/${items.image}`
          : `/uploads/patternsPDF/${items.image}`,
      price: items.price,
      type: items.type,
      pdf: `/uploads/patternsPDF/${items.pdf}`,
    }));
    response.status(200).send(itemData);
  } catch (error) {
    console.log(error, "gick inte att hämta items");
  }
});

//lägger till ett sessionID i cart
app.post("/createSessionAndCart", async (request, response) => {
  const { sessionId }: RequestBody = request.body;
  //lägger till en cart med sessionId som skapas i localstorage och skickas till backend med post
  await client.query<Carts>(
    "INSERT INTO carts (session_id) VALUES ($1) RETURNING *",
    [sessionId]
  );
  response.status(201).send("ny session skapad");
});

//lägga in saker i cart
app.post("/addToCart", async (request, response) => {
  const { sessionId, quantity, item_id, type }: RequestBody = request.body;
  try {
    const { rows } = await client.query<Carts>(
      "select * from carts where session_id = $1",
      [sessionId]
    );

    if (rows.length !== 0) {
      const cart_id = rows[0].cart_id;
      //om det finns några varor med type knitwear som man försökt lägga till så kollar den i allt som finns i cart_items och items om den varan redan ligger i en annan cart.
      if (type === "knitwear") {
        //jointable som hämtar all information från cart_items, kollar i items och i cart_items om på item_id matchar- att samma item_id finns i båda tabellerna. Om item_id finns i båda tabllerna OCH item är av typen "knitwear" så hämtas dessa items och sparas i knitWearItem. -- kollar om cart_item innehåller
        const knitWearItem = await client.query(
          "SELECT * FROM cart_items JOIN items ON cart_items.item_id = items.item_id WHERE items.type = 'knitwear' AND cart_items.item_id = $1",
          [item_id]
        );
        //om varan ligger i en annan cart så får man ett meddelande om att varan är slut i lager.
        if (knitWearItem.rows.length > 0) {
          return response.status(418).send({
            message: "varan är slut i lager.",
            item: knitWearItem.rows[0],
          });
        }
      }
      //hämtar och kollar om det item man klickat på finns i varukorgen
      const existingItem = await client.query<CartItem>(
        "SELECT * FROM cart_items WHERE cart_id = $1 AND item_id = $2",
        [cart_id, item_id]
      );
      //om det man klickat på inte finns i anvöndarens varukorg eller om den har type "pattern" så läggs den till i cart_items
      if (existingItem.rows.length === 0 || type === "pattern") {
        const result = await client.query<CartItem>(
          "INSERT INTO cart_items ( cart_id, item_id, quantity) VALUES ($1, $2, $3) RETURNING *",
          [cart_id, item_id, quantity]
        );

        response.status(201).send(result.rows[0]);
      } else {
        response
          .status(404)
          .send(
            "bad request, kan inte lägga till flera items av samma id i cart"
          );
      }
    }
  } catch (error) {
    console.error("Det gick inte att lägga till vara i varukorgen:", error);
    response.status(500).send("Internal Server Error");
  }
});

//deleta om man tar bort saker från cart
//ev gör om denna då den har lite mycket kod som kanske inte är helt nödvändig.
app.post("/deleteItemFromCart", async (request, response) => {
  const { item_id, sessionId }: RequestBody = request.body;

  //Kontrollera om både item_id och sessionId finns
  if (!item_id || !sessionId) {
    return response.status(400).send("item_id och sessionId krävs");
  }
  try {
    //hämtar cart_id i carts för att kunna använda senare
    const result = await client.query<Carts>(
      "SELECT cart_id FROM carts WHERE session_id = $1",
      [sessionId]
    );
    //sätter cart_id basserat på sessionId och tidigare hämtade result
    const cart_id = result.rows[0].cart_id;

    //hämtar det item man klickat på och kollar först att det finns ett sådant item om inte får man att kundvagnen inte innehåller det man klickat på.

    //ev kan detta tas bort
    const { rows } = await client.query<CartItem>(
      "SELECT item_id FROM cart_items WHERE item_id = $1",
      [item_id]
    );
    if (rows.length === 0) {
      return response.status(404).send("Kundvagnen innehåller inte denna vara");
    }
    //kollar igenom det man klickat på för att se att det item_id man hämtat från cart_item stämmer överens med det man klickat på

    //ev kan detta tas bort
    const itemExists = rows.find((item) => item.item_id === item_id);
    //om det inte stämmer överens får man ett till felmeddelande att det inte finns i varukorgen
    //ev kan detta tas bort
    if (!itemExists) {
      return response.status(404).send("Artikeln finns inte i kundvagnen");
    }

    //om inga felmeddelande kommer så tar man bort cart_item som passar item_id och cart_id
    await client.query<CartItem>(
      "DELETE FROM cart_items WHERE item_id = $1 AND cart_id = $2",
      [item_id, cart_id]
    );

    response.status(200).send("Artikeln har tagits bort från kundvagnen");
  } catch (error) {
    console.error("Internt serverfel:", error);
    return response.status(500).send("Internt serverfel");
  }
});

//hämta alla objekt som finns i cart_item och tar info från items
//klar 240525
app.get("/getCartItems", async (request, response) => {
  try {
    //här får man den aktiva shoppingcartens sessionsId.
    const activeCartSessionId = request.query.sessionId;
    //om det inte finns ett aktivt sessionId
    if (!activeCartSessionId) {
      return response.status(400).send({ error: "Session ID måste finnas" });
    }
    //hämtar id som finns på aktiv cart
    const cartResult = await client.query<Carts>(
      "SELECT cart_id FROM carts WHERE session_id = $1",
      [activeCartSessionId]
    );
    //om cartResult är en tom arrayså finns det ingen cart för sesssionsid som ät satt
    if (cartResult.rows.length === 0) {
      return response
        .status(404)
        .send({ error: "det finns ingen cart för det satta sessionId" });
    }
    // Hämtar cart_id från den första raden, om den finns
    const cartId: number = cartResult.rows[0].cart_id;
    //kollar igen om det inte finns ett cart-id- (ev överflödig)
    if (!cartId) {
      throw new Error("Cart ID kunde inte hittas");
    }
    //hämtar alla cart_items som finns basserat på det cart_idet man har som hämtas via sessionId som skickas via query.
    const { rows } = await client.query(
      "SELECT * FROM items INNER JOIN cart_items ON items.item_id = cart_items.item_id WHERE cart_items.cart_id = $1;",
      [cartId]
    );

    //mappar ut den itemData
    const itemData = rows.map((items: Item) => ({
      item_id: items.item_id,
      name: items.name,
      description: items.description,
      image:
        items.type === "knitwear"
          ? `/uploads/knitwear/${items.image}`
          : `/uploads/patternsPDF/${items.image}`,
      pdf:
        items.type === "pattern" ? `/uploads/patternsPDF/${items.image}` : null,
      price: items.price,
      type: items.type,
    }));

    return response.status(200).send(itemData);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return response.status(500).send({ error: "Internal Server Error" });
  }
});

//ta bort varor som är köpta och av typen knitwear, tar bort cart_items och tar bort cart. -- senare även lägga till info om beställning i en orders tabell( finns inte än)
app.post("/paymentSuccessful", async (request, response) => {
  const { sessionId, cartItems }: RequestBody = request.body;
  const typedCartItems: Item[] = cartItems as unknown as Item[];
  //hämtar först cart_id som är reggat på aktuellt sessionId
  const cart = await client.query(
    "SELECT cart_id FROM carts WHERE session_id=$1",
    [sessionId]
  );
  if (cart.rows.length === 0) {
    return response.status(404).send("varukorg finns inte ");
  }
  //för att få tag i cart_id från den session_id man har fått från frontend
  const cart_id = cart.rows[0].cart_id;

  //kollar filtrerar cartitems och spara de som har type "knitwear"
  const knitwearItems = typedCartItems.filter(
    (cartItem: { type: string }) => cartItem.type === "knitwear"
  );
  //tar up item_id av de knitwear som finns i cartitems
  const knitwearItemIds = knitwearItems.map(
    (cartItem: { item_id: number }) => cartItem.item_id
  );
  //raderar de som finns i cart_item som är kopplat till den cart man chekcar ut
  await client.query("DELETE FROM cart_items WHERE cart_id=$1", [cart_id]);
  //raderar själva varukorgen basserat på det sessionId som använts
  await client.query("DELETE FROM carts WHERE session_id =$1 ", [sessionId]);
  //loopar igenom och deletar de item som har type "knitwear" från items-tabellen
  for (const item_id of knitwearItemIds) {
    await client.query("DELETE FROM items WHERE item_id=$1", [item_id]);
  }
  response.status(200).send("Payment processed and cart cleared");
});

//post för att kunna göra ett inlogg och skapa ett token för admin --- det ska bara finnas en admin i denna applikationen
app.post("/login", async (request, response) => {
  const { adminName, password }: RequestBody = request.body;
  //hämtar alla admin (finns bara en)
  const { rows } = await client.query("SELECT * FROM admin  WHERE name = $1 ", [
    adminName,
  ]);

  //om user inte finns så sändes felmeddelanden
  if (rows.length === 0) {
    return response.status(400).send("ingen admin hittad");
  }
  const admin = rows[0];

  if (admin.password !== password) {
    return response.status(401).send("401, Unauthorized");
  }
  //tilldelar ett unikt id för Token
  const token = uuidv4();
  //lägger till ett nytt token varje gång användaren loggar in
  await client.query(
    "INSERT INTO admintoken (admin_id, token) VALUES ($1,$2) RETURNING *",
    [admin.id, token]
  );
  response.status(200).send("inloggning lyckades  ");
});

app.post("/logout/", async (_request, response) => {
  try {
    const { rows } = await client.query("SELECT * FROM admintoken ");
    const adminToken: string = rows[0];

    if (adminToken.length === 0) {
      response.status(401).send("finns ingen användare inloggad");
    } else {
      await client.query("DELETE FROM admintoken");
      response.status(200).send("utloggad, och alla tokens deletade ");
    }
  } catch (error) {
    return response.status(500).send("Internal Server Error");
  }
});

//lögga till stickade plagg
app.post(
  "/knitwear",
  uploadKnitwear.single("image"),
  async (request, response) => {
    try {
      const { name, description, price }: RequestBody = request.body;

      if (request.file !== undefined) {
        //lägga in samma sak i items-tabellen också så att de kan nås i cart
        await client.query(
          "INSERT INTO items (name, image, price, description, type) VALUES ($1, $2, $3, $4, $5)",
          [name, request.file.filename, price, description, "knitwear"]
        );

        response.status(201).send("projekt uppladdat");
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Error adding knitwear" });
    }
  }
);
//lägga till nya mönster
app.post(
  "/patterns",
  uploadPattern.fields([{ name: "image" }, { name: "pdf" }]),

  async (request, response) => {
    try {
      const { name, description, price }: RequestBody = request.body;

      if (request.files !== undefined) {
        //lägga in samma sak i items-tabellen också så att de kan nås i cart
        await client.query(
          "INSERT INTO items (name, image, pdf, description, price, type) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            name,
            (request.files as unknown as Fields).image[0].filename,
            (request.files as unknown as Fields).pdf[0].filename,
            description,
            price,
            "pattern",
          ]
        );

        response.status(201).send("projekt uppladdat");
      }
      response.status(200).send();
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Error adding pattern" });
    }
  }
);
//lägga till nya projekt
app.post("/project", upload.single("image"), async (request, response) => {
  try {
    const { name, description }: RequestBody = request.body;

    if (request.file !== undefined) {
      response.status(201).send("projekt uppladdat");
      await client.query(
        "INSERT INTO projects (name, image, description) VALUES ($1, $2, $3) RETURNING *",
        [name, request.file.filename, description]
      );
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Error adding project" });
  }
});

//delete från admin sidan så att jag kan ta bort projekt från databasen via frontend
app.post("/adminDeleteProjects", async (request, response) => {
  try {
    const { project_id }: RequestBody = request.body;
    if (!project_id) {
      throw new Error("ogiltlig project_id");
    }
    //tar bort det item man klickat på
    await client.query("DELETE FROM projects WHERE project_id =$1", [
      project_id,
    ]);
    response
      .status(200)
      .send({ message: "projektet är borttagen från databasen " });
  } catch (error) {
    response
      .status(400)
      .send("det fgick inte att ta bort projekt från backend(databasen");
  }
});

//delete från admin sidan så att jag kan ta bort produkter från databasen via frontend
app.post("/adminDeleteItems", async (request, response) => {
  try {
    const { item_id }: RequestBody = request.body;

    if (!item_id) {
      throw new Error("ogiltlig item_id");
    }
    //tar bort det item man klickat på
    await client.query("DELETE FROM items WHERE item_id =$1", [item_id]);
    response
      .status(200)
      .send({ message: "varan är borttagen från databasen " });
  } catch (error) {
    response
      .status(400)
      .send("det fgick inte att ta bort items från backend(databasen");
  }
});

app.listen(port, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.  http://localhost:${port}/");
});
