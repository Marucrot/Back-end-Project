const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config();

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