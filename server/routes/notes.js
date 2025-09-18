import db from "../db/connection.js";
import express from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const collection = db.collection("Notes");
    const notes = await collection.find({ user: req.user.username }).toArray();
    res.status(200).send(notes);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const noteId = req.params.id;

  if (!ObjectId.isValid(noteId)) {
    return res.status(400).send({message: "Invalid note id"})
  }
  try {
    const collection = db.collection("Notes");
    const results = await collection.deleteOne({_id: new ObjectId(noteId)});

    if (results.deletedCount === 0) {
      return res.status(404).send({message: "Note ntoe found"})
    }

    res.status(200).send({message: "Note Deleted"})
  } catch (err) {
    console.log(err);
    res.status(500).send({message: "Server Error"})
  }
});

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
