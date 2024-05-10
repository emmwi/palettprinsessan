import cors from "cors";
import * as dotenv from "dotenv";
import { Client } from "pg";
import express from "express";
import { request } from "http";
import path from "path";

__dirname = path.dirname(__filename);

const app = express();

app.use(cors());

app.use(express.static(path.join(path.resolve(), "pictures")));
app.use("/pictures", express.static(path.join(__dirname, "pictures")));
dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

client.connect();

app.get("/", async (_request, response) => {
  const { rows } = await client.query("SELECT * FROM cities WHERE name = $1", [
    "Stockholm",
  ]);

  response.send(rows);
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
      image: `/pictures/${project.image}`,
    })
  );
  return response.send(projectData);
});

app.listen(8080, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.  http://localhost:8080/");
});

// INSERT INTO projects (name, description, image) VALUES  ('baby blancet',  'stickat i baby alpacka, garn från adlibris', 'babyblanket.jpg');
