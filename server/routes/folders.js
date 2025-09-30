import db from "../db/connection.js";
import express from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const collection = db.collection("Folders");
    const folders = await collection.find({ user: req.user.username }).toArray()
    if (!folders) {
      return res.status(404).send({ message: "This user has no folders" })
    }
    res.status(200).send(folders);
  } catch (err) {
    console.log(err)
    res.status(500).send({message: "Server Error"})
  }
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

export default router;
