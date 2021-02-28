const cors = require("cors");
const express = require('express');
const path = require("path");
const cookies = require("cookie-parser");
const bodyParser = require("body-parser");

const forumRoutes = require("./routes/forums");
const cartRoutes = require("./routes/cart");
const authRoutes = require("./routes/auth");

require('dotenv').config({
  path: path.join(__dirname, ".env"),
});

const app = express();

app.use(cors({
  origin: ["http://localhost:3005"]
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookies());

app.use("/forum", forumRoutes);
app.use("/cart", cartRoutes);
app.use("/auth", authRoutes);

module.exports = {
  path: "api/",
  handler: app,
};
