import cors from "cors";
import * as dotenv from "dotenv";
import { Client } from "pg";
import express from "express";
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
// app.use(express.static(path.join(path.resolve(), "projects")));

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

//hämta mönster
app.get("/patterns", async (_request, response) => {
  const { rows } = await client.query("SELECT * FROM patterns ");
  const patternData = rows.map(
    (pattern: {
      pattern_id: number;
      name: string;
      description: string;
      image: string;
      pdf: string;
      price: Number;
    }) => ({
      pattern_id: pattern.pattern_id,
      name: pattern.name,
      description: pattern.description,
      image: `/uploads/patternsPDF/${pattern.image}`,
      pdf: pattern.pdf,
      price: pattern.price,
    })
  );
  return response.send(patternData);
});
//lägga till nya mönster
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
        console.log(request.files.image[0].filename);
        console.log(request.files.pdf[0].filename);
        response.status(201).send("projekt uppladdat");
        await client.query(
          "INSERT INTO patterns (name, image, pdf, description, price) VALUES ($1, $2, $3, $4,$5) RETURNING *",
          [
            name,
            request.files.image[0].filename,
            request.files.pdf[0].filename,
            description,
            price,
          ]
        );
      }
      response.status(200).send();
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Error adding pattern" });
    }
  }
);
//hömta produketer/stickade plagg
app.get("/knitwears", async (_request, response) => {
  const { rows } = await client.query("SELECT * FROM knitwear ");
  const knitwearData = rows.map(
    (knitwear: {
      knitwear_id: number;
      name: string;
      description: string;
      image: string;
      price: Number;
    }) => ({
      knitwear_id: knitwear.knitwear_id,
      name: knitwear.name,
      description: knitwear.description,
      image: `/uploads/knitwear/${knitwear.image}`,
      price: knitwear.price,
    })
  );
  return response.send(knitwearData);
});
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
        console.log(request.file);
        response.status(201).send("projekt uppladdat");
        await client.query(
          "INSERT INTO knitwear (name, image, price, description) VALUES ($1, $2, $3, $4) RETURNING *",
          [name, request.file.filename, price, description]
        );
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Error adding knitwear" });
    }
  }
);

//post för att kunna göra ett inlogg och skapa ett token för admin --- det ska bara finnas en admin i denna applikationen
app.post("/login", async (request, response) => {
  const { name, password } = request.body;

  const { rows } = await client.query("SELECT * FROM admin  WHERE name = $1 ", [
    name,
  ]);

  //om user inte finns så sändes felmeddelanden
  if (rows.length === 0) {
    return response.status(400).send("ingen admin hittad");
  }
  const admin = rows[0];
  //ger felmeddelande om lösenordet är fel
  if (admin.password !== password) {
    return response.status(401).send("401, Unauthorized");
  }
  //tilldelar ett unikt id för Token
  const token = uuidv4();
  //lägger till ett nytt token varje gång användaren loggar in
  await client.query(
    "INSERT INTO adminTokens (admin_id, token) VALUES ($1,$2) ?)",
    [admin.id, token]
  );
});

// app.post("/logout/:token", async (request, response) => {
//   try {
//     const userToken = request.params.token;

//     if (!userToken) {
//       response.status(401).send("Unauthorized ");
//     } else {
//       await client.query("DELETE FROM adminTokens WHERE token = $1", [userToken]);
//       response.status(200).send("utloggad ");
//     }
//   } catch (error) {
//     return response.status(500).send("Internal Server Error");
//   }
// });

app.listen(8080, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.  http://localhost:8080/");
});

// [Object: null prototype] {
//   [0]   image: [
//   [0]     {
//   [0]       fieldname: 'image',
//   [0]       originalname: 'fÃ¤rger.png',
//   [0]       encoding: '7bit',
//   [0]       mimetype: 'image/png',
//   [0]       destination: 'C:\\Users\\emmam\\OneDrive\\Mappar\\programmering\\IT_Högskolan2023\\fullstack\\Labb3\\rollback\\palettprinsessan\\backend\\uploads\\patternsPDF',
//   [0]       filename: 'e4822d0586b8c950d6406156afb2233a',
//   [0]       path: 'C:\\Users\\emmam\\OneDrive\\Mappar\\programmering\\IT_Högskolan2023\\fullstack\\Labb3\\rollback\\palettprinsessan\\backend\\uploads\\patternsPDF\\e4822d0586b8c950d6406156afb2233a',
//   [0]       size: 44592
//   [0]     }
//   [0]   ],
//   [0]   pdf: [
//   [0]     {
//   [0]       fieldname: 'pdf',
//   [0]       originalname: 'hol(e)y.pdf',
//   [0]       encoding: '7bit',
//   [0]       mimetype: 'application/pdf',
//   [0]       destination: 'C:\\Users\\emmam\\OneDrive\\Mappar\\programmering\\IT_Högskolan2023\\fullstack\\Labb3\\rollback\\palettprinsessan\\backend\\uploads\\patternsPDF',
//   [0]       filename: 'e4a05834089ec3521a9fffc5ece6979d',
//   [0]       path: 'C:\\Users\\emmam\\OneDrive\\Mappar\\programmering\\IT_Högskolan2023\\fullstack\\Labb3\\rollback\\palettprinsessan\\backend\\uploads\\patternsPDF\\e4a05834089ec3521a9fffc5ece6979d',
//   [0]       size: 170313
//   [0]     }
//   [0]   ]
//   [0] }
