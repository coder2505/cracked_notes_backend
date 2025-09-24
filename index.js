require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = express();
const connection_string = process.env.CONNECTION_STRING;
const port = process.env.PORT;
const routes = require("./routes/auth.js");
const secret = process.env.JWT_SECRET;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


app.use("/auth",routes);


mongoose.connect(connection_string).then(() => {
  console.log("mongoose connected");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
