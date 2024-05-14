import cors from "cors";
import * as dotenv from "dotenv";
import { Client } from "pg";
import express from "express";
import { request } from "http";
import path from "path";
import multer from "multer";
__dirname = path.dirname(__filename);

const app = express();

app.use(cors());

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

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.body.event == "patternsPDF") {
      cb(null, "uploads/patternsPDF"); // it will upload inside test under images
    } else if (req.body.event == "projects") {
      cb(null, "uploads/projects");
    } else {
      cb(null, "uploads/knitwear"); // it will upload inside try under images
    }
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

// app.get("/", async (_request, response) => {
//   const { rows } = await client.query("SELECT * FROM cities WHERE name = $1", [
//     "Stockholm",
//   ]);

//   response.send(rows);
// });

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

app.listen(8080, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.  http://localhost:8080/");
});
