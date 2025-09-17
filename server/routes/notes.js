import db from "../db/connection.js";
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const collection = db.collection("Notes");
    const notes = await collection.find({}).toArray();
    const userNotes = notes.filter((note) => (note.user = req.user.username));
    res.status(200).send(userNotes);
  } catch (err) {
    res.status(500).send("Server Error");
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
