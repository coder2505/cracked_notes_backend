require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const user_model = require("../models/user_model");
const router = express.Router();
const secret = process.env.JWT_SECRET;


router.post("/signup", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
  
    try {
      if (email === "" || password === "") {
        return res
          .status(400)
          .json({ message: "error", desc: "both fields are required" });
      }
  
      const isPresent = await user_model.findOne({ email: email });
  
      if (isPresent) {
        return res
          .status(409)
          .json({ message: "error", desc: "user already exists" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = await user_model.create({
        email: email,
        password: hashedPassword,
      });
  
      const token = jwt.sign({ email: email }, secret);
  
      return res
        .status(201)
        .json({ message: "successful", token: token, user: user });
    } catch (e) {
      console.log("error" + e);
      return req.statusCode(500).json({ message: "server error" });
    }
  });
  
  router.post("/login", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
  
    try {
      const user = await user_model.findOne({ email: email });
  
      if (!user) {
        return res.status(404).json({ message: "error", desc: "user not found" });
      }
  
      const right = bcrypt.compareSync(password, user.password);
  
      if (right) {
        const token = jwt.sign({ email: email }, secret);
  
        return res
          .status(200)
          .json({ message: "successfully logged in", token: token });
      }
  
      return res.status(401).json({ message: "error", desc: "incorrect password" });
    } catch (e) {
      console.log("error" + e);
      return res.status(500).json({ message: "server error" });
    }
  });

  module.exports = router;
  