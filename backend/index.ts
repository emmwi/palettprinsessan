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

// app.get("/", async (_request, response) => {
//   // Property 'queryy' does not exist on type 'Client'. Did you mean 'query'?
//   const { rows } = await client.queryy("SELECT * FROM cities WHERE name = $1", [
//     "Stockholm",
//   ]);

//   response.send(rows);
// });

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});
