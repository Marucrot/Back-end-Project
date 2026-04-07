const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config({ path: "./.env" });

console.log("ISI ENV:", process.env.MONGO_URI);

const app = express();
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Server jalan dan MongoDB konek");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});