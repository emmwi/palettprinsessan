import cors from "cors";
import * as dotenv from "dotenv";

import { Client } from "pg";
import express from "express";

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

client.connect();

const app = express();

app.use(cors());

app.get("/", async (_request, response) => {
  const { rows } = await client.query("SELECT * FROM cities WHERE name = $1", [
    "Stockholm",
  ]);

  response.send(rows);
});

app.listen(8080, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.  http://localhost:8080/");
});
