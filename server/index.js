import express from "express";
import mysql from "mysql2";
import cors from "cors";
import router from "./routes/route.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/", router);

// MySQL connection
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: ", err.stack);
    return;
  }
  console.log("Connected to database.");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default db;
