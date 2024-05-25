import cors from "cors";
import * as dotenv from "dotenv";
import { Client } from "pg";
import express, { response } from "express";
import { request } from "http";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
__dirname = path.dirname(__filename);

const app = express();

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
dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

client.connect();

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
  const projectData = rows.map(
    (project: {
      project_id: number;
      name: string;
      description: string;
      image: string;
    }) => ({
      project_id: project.project_id,
      name: project.name,
      description: project.description,
      image: `/uploads/projects/${project.image}`,
    })
  );
  return response.send(projectData);
});

//lägga till nya projekt
app.post("/project", upload.single("image"), async (request, response) => {
  try {
    const name = request.body.name;
    const description = request.body.description;
    if (request.file !== undefined) {
      console.log(request.file);
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

//lägga till nya mönster
interface Fields {
  image: FieldObject[];
  pdf: FieldObject[];
}
interface FieldObject {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}
app.post(
  "/patterns",
  uploadPattern.fields([{ name: "image" }, { name: "pdf" }]),

  async (request, response) => {
    try {
      const name = request.body.name;
      const description = request.body.description;
      const price = request.body.price;

      console.log(request.files);
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
        //lägger till patterns men namn image, pdf description, price
        await client.query(
          "INSERT INTO patterns (name, image, pdf, description, price) VALUES ($1, $2, $3, $4,$5) RETURNING *",
          [
            name,
            (request.files as unknown as Fields).image[0].filename,
            (request.files as unknown as Fields).pdf[0].filename,
            description,
            price,
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

//lögga till stickade plagg
app.post(
  "/knitwear",
  uploadKnitwear.single("image"),
  async (request, response) => {
    try {
      const name = request.body.name;
      const description = request.body.description;
      const price = request.body.price;
      if (request.file !== undefined) {
        //lägga in samma sak i items-tabellen också så att de kan nås i cart
        await client.query(
          "INSERT INTO items (name, image, price, description, type) VALUES ($1, $2, $3, $4, $5)",
          [name, request.file.filename, price, description, "knitwear"]
        );
        await client.query(
          "INSERT INTO knitwear (name, image, price, description) VALUES ($1, $2, $3, $4) RETURNING *",
          [name, request.file.filename, price, description]
        );
        response.status(201).send("projekt uppladdat");
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Error adding knitwear" });
    }
  }
);

//hämtar alla items som finns att köpa
app.get("/getItems", async (_request, response) => {
  try {
    const { rows } = await client.query("SELECT * FROM items");

    const itemData = rows.map(
      (items: {
        item_id: number;
        name: string;
        description: string;
        image: string;
        price: Number;
        type: string;
      }) => ({
        item_id: items.item_id,
        name: items.name,
        description: items.description,
        image:
          items.type === "knitwear"
            ? `/uploads/knitwear/${items.image}`
            : `/uploads/patternsPDF/${items.image}`,
        price: items.price,
        type: items.type,
      })
    );
    response.status(200).send(itemData);
  } catch (error) {
    console.log(error, "gick inte att hämta items");
  }
});

//lägger till ett sessionID i cart
app.post("/createSessionAndCart", async (request, response) => {
  const { sessionId } = request.body;
  console.log(sessionId);
  await client.query("INSERT INTO carts (session_id) VALUES ($1) RETURNING *", [
    sessionId,
  ]);
  response.status(201).send("ny session skapad");
});

//lägga in saker i cart
app.post("/addToCart", async (request, response) => {
  const { sessionId, quantity, item_id } = request.body;
  console.log("Request body:", request.body);
  console.log("sessionId:", sessionId);
  console.log("quantity:", quantity);
  console.log("item_id:", item_id);
  try {
    const { rows } = await client.query(
      "select * from carts where session_id = $1",
      [sessionId]
    );
    console.log(rows);
    if (rows.length !== 0) {
      const cart_id = rows[0].cart_id;
      console.log("itemid", item_id);
      console.log("cartid", cart_id);
      const existingItem = await client.query(
        "SELECT * FROM cart_items WHERE cart_id = $1 AND item_id = $2",
        [cart_id, item_id]
      );
      if (existingItem.rows.length === 0) {
        const result = await client.query(
          "INSERT INTO cart_items ( cart_id, item_id, quantity) VALUES ($1, $2, $3) RETURNING *",
          [cart_id, item_id, quantity]
        );
        response.status(201).send(result.rows[0]);
      } else {
        response.send("kan inte lägga till flera items av samma id i cart");
      }
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    response.status(500).send("Internal Server Error");
  }
});
// //deleta om man tar bort saker från cart
app.post("/deleteItemFromCart", async (request, response) => {
  const { item_id, sessionId } = request.body;
  console.log("session id", sessionId);
  console.log("item_id", item_id);
  // Steg 1: Kontrollera om både item_id och sessionId finns
  if (!item_id || !sessionId) {
    return response.status(400).send("item_id och sessionId krävs");
  }

  try {
    //hämtar cart_id i carts för att kunna använda senare
    const result = await client.query(
      "SELECT cart_id FROM carts WHERE session_id = $1",
      [sessionId]
    );
    //hämtar rätt cart_id basserat på sessionId
    const cart_id = result.rows[0].cart_id;

    const { rows } = await client.query(
      "SELECT item_id FROM cart_items WHERE item_id = $1",
      [item_id]
    );
    if (rows.length === 0) {
      return response
        .status(404)
        .send("Kundvagnen är tom eller sessionId finns inte");
    }
    const itemExists = rows.find((item) => item.item_id === item_id);
    console.log("finns det jag vill ta bort?", itemExists.item_id);

    if (!itemExists) {
      return response.status(404).send("Artikeln finns inte i kundvagnen");
    }

    //tar bort cart_item som passar item_id och cart_id
    await client.query(
      "DELETE FROM cart_items WHERE item_id = $1 AND cart_id = $2",
      [item_id, cart_id]
    );
    response.status(200).send("Artikeln har tagits bort från kundvagnen");
  } catch (error) {
    console.error("Internt serverfel:", error);
    return response.status(500).send("Internt serverfel");
  }
});

// app.put("/updateShoppingCart", async (request, response) => {
//   const cartItems = request.body;
// });
//hämta alla carts som finns
app.get("/shoppingCart", async (request, response) => {
  const { rows } = await client.query("SELECT * FROM carts ");

  return response.status(200).send(rows);
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
    //hämtar id som finns på cart items
    const cartResult = await client.query(
      "SELECT cart_id FROM carts WHERE session_id = $1",
      [activeCartSessionId]
    );
    if (cartResult.rows.length === 0) {
      return response
        .status(404)
        .send({ error: "det finns ingen cart för det satta sessionId" });
    }

    const cartId = cartResult.rows[0].cart_id; // Hämtar cart_id från den första raden, om den finns
    if (!cartId) {
      throw new Error("Cart ID not found");
    }
    //hämtar alla cart_items som finns basserat på det cart_idet man har som hämtas via sessionId som skickas via query.
    const { rows } = await client.query(
      "SELECT * FROM items INNER JOIN cart_items ON items.item_id = cart_items.item_id WHERE cart_items.cart_id = $1;",
      [cartId]
    );
    //mappar ut den itemData
    const itemData = rows.map(
      (items: {
        item_id: number;
        name: string;
        description: string;
        image: string;
        pdf: string | undefined | null;
        price: Number;
        type: string;
      }) => ({
        item_id: items.item_id,
        name: items.name,
        description: items.description,
        image:
          items.type === "knitwear"
            ? `/uploads/knitwear/${items.image}`
            : `/uploads/patternsPDF/${items.image}`,
        pdf:
          items.type === "pattern"
            ? `/uploads/patternsPDF/${items.image}`
            : null,
        price: items.price,
        type: items.type,
      })
    );

    return response.status(200).send(itemData);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return response.status(500).send({ error: "Internal Server Error" });
  }
});

//post för att kunna göra ett inlogg och skapa ett token för admin --- det ska bara finnas en admin i denna applikationen
app.post("/login", async (request, response) => {
  const { adminName, password } = request.body;

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
    const adminToken = rows[0];

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
app.listen(8080, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.  http://localhost:8080/");
});
