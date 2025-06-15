const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// API Routes
app.get("/", (req, res) => {
  res.send("Marketplace API is running!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
