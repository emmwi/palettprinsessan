import cors from "cors";
import * as dotenv from "dotenv";
import { Client } from "pg";
import express from "express";
import { request } from "http";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

__dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(express.static(path.join(path.resolve(), "projects")));

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

const upload = multer({ dest: path.join(__dirname, "uploads", "projects") });
const uploadKnitwear = multer({
  dest: path.join(__dirname, "uploads", "knitwear"),
});
const uploadPattern = multer({
  dest: path.join(__dirname, "uploads", "patternsPDF"),
});

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

// app.post(
//   "/patterns",
//   uploadPattern.fields([{ name: "image" }, { name: "pdf" }]),

//   async (request, response) => {
//     try {
//       const name = request.body.name;
//       const description = request.body.description;
//       const price = request.body.price
//       console.log(request.files);
//       if (request.files !== undefined) {
//         const uploadedFiles = request.files[]
//           ? request.files[name][0].filename
//           : null;
//         if (uploadedFiles) {
//           console.log(request.files);
//           response.status(201).send("projekt uppladdat");
//           await client.query(
//             "INSERT INTO patterns (name, image, pdf, description, price) VALUES ($1, $2, $3, $4) RETURNING *",
//             [name, request.files["image"], request.files["pdf"], description, price]
//           );
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       response.status(500).json({ error: "Error adding pattern" });
//     }
//   }
// ); //behöver hjälp på denna

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
app.listen(8080, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.  http://localhost:8080/");
});
