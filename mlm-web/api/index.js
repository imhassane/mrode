const cors = require("cors");
const express = require('express');
const path = require("path");
const cookies = require("cookie-parser");

const forumRoutes = require("./routes/forums");
const cartRoutes = require("./routes/cart");

require('dotenv').config({
  path: path.join(__dirname, ".env"),
});

const app = express();

app.use(cors({
  origin: ["http://localhost:3005"]
}));
app.use(express.json());
app.use(cookies());

app.use("/forum", forumRoutes);
app.use("/cart", cartRoutes);

module.exports = {
  path: "api/",
  handler: app,
};
