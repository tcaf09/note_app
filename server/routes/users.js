import express from "express";

import db from "../db/connection.js"

import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  let collection = await db.collection("Users");
  let results = await collection.find({}).toArray();
  res.status(200).send(results);
})

router.post("/register", async (req, res) => {
  try {
    const {username, password, email} = req.body;
    if (!username || !password || !email) {
      return res.status(500).send("Username, password and email required")
    }
    let newUser = {
      username,
      password,
      email,
    }
    let collection = await db.collection("Users");
    const existingUser = await collection.findOne({username});
    if (existingUser) {
      return res.status(409).send("Username already exists")
    }
    const existingEmail = await collection.findOne({email});
    if (existingEmail) {
      return res.status(409).send("Already an account with that email");
    }
    let result = await collection.insertOne(newUser);
    res.status(204).send(result)
  } catch(err) {
    console.log(err)
    res.status(500).send("Error adding user");
  }
})

export default router;
