import express from "express";

import db from "../db/connection.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).send({message:"Username, password and email required" });
    }
    const newUser = {
      username,
      password,
      email,
    };
    const collection = db.collection("Users");
    const existingUser = await collection.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).send({message: "Username already exists"});
      }
      if (existingUser.email === email) {
        return res.status(409).send({message: "Email is in use"});
      }
    }
    const result = await collection.insertOne(newUser);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({message: "Error adding user"});
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send({message: "Username and password required"});
    }

    const collection = db.collection("Users");
    const user = await collection.findOne({ username });
    if (user && password === user.password) {
      const payload = { username: user.username };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).json({ accessToken });
    } else {
      res.status(401).send({message: "Invalid Credentials"});
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({message: "Server error"});
  }
});

export default router;
