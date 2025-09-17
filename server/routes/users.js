import express from "express";

import db from "../db/connection.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(500).send("Username, password and email required");
    }
    const newUser = {
      username,
      password,
      email,
    };
    const collection = db.collection("Users");
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(409).send("Username already exists");
    }
    const existingEmail = await collection.findOne({ email });
    if (existingEmail) {
      return res.status(409).send("Already an account with that email");
    }
    const result = await collection.insertOne(newUser);
    res.status(204).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding user");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Username and password required");
    }

    const collection = db.collection("Users");
    const user = await collection.findOne({ username });
    if (user && password === user.password) {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).send({ accessToken: accessToken });
    } else {
      res.status(401).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

export default router;
