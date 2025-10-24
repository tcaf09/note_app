import db from "../db/connection.js";
import express from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import uploadImage from "../uploadImage.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const collection = db.collection("Notes");
    const notes = await collection
      .find({ user: req.user.username })
      .project({ paths: 0, texboxes: 0 })
      .toArray();
    res.status(200).send(notes);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  const noteId = new ObjectId(req.params.id);

  if (!ObjectId.isValid(noteId)) {
    return res.status(400).send({ message: "Invalid note id" });
  }
  try {
    const collection = db.collection("Notes");
    const note = await collection.findOne({
      user: req.user.username,
      _id: noteId,
    });
    if (!note) {
      return res.status(404).send({ message: "Note not found" });
    }
    res.status(200).send(note);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const noteId = req.params.id;

  if (!ObjectId.isValid(noteId)) {
    return res.status(400).send({ message: "Invalid note id" });
  }
  try {
    const collection = db.collection("Notes");
    const results = await collection.deleteOne({ _id: new ObjectId(noteId) });

    if (results.deletedCount === 0) {
      return res.status(404).send({ message: "Note note found" });
    }

    res.status(200).send({ message: "Note Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
});

router.patch("/:id", authenticateToken, async (req, res) => {
  const noteId = req.params.id;

  if (!ObjectId.isValid(noteId)) {
    return res.status(400).send({ message: "Invalid note id" });
  }

  try {
    const query = { _id: new ObjectId(noteId), user: req.user.username };
    const collection = db.collection("Notes");
    const note = await collection.findOne(query);

    if (!note) {
      return res.status(404).send({ message: "Note not found" });
    }

    const imageUrl = await uploadImage(req.body.thumbnailUrl, `note_${noteId}`);

    const boxesToAdd = [];
    const boxesToChange = [];

    for (const textbox of req.body.boxesToSave) {
      const boxExists = note.textboxes.find((box) => box.id === textbox.id);
      if (boxExists) {
        boxesToChange.push(textbox);
      } else {
        boxesToAdd.push(textbox);
      }
    }

    for (const box of boxesToChange) {
      await collection.updateOne(
        { ...query },
        {
          $set: {
            "textboxes.$[elem]": box,
          },
        },
        {
          arrayFilters: [{ "elem.id": box.id }],
        },
      );
    }

    const updateOperation = {};

    if (req.body.pathsToSave && req.body.pathsToSave.length > 0) {
      updateOperation.$push = updateOperation.$push || {};
      updateOperation.$push.paths = { $each: req.body.pathsToSave };
    }

    if (boxesToAdd.length > 0) {
      updateOperation.$push = updateOperation.$push || {};
      updateOperation.$push.textboxes = { $each: boxesToAdd };
    }

    const pullOp = {};
    const boxIdsToDelete = req.body.boxesToDelete?.map((b) => b.id) || [];
    if (
      boxIdsToDelete.length > 0 ||
      (req.body.pathsToDelete && req.body.pathsToDelete.length > 0)
    ) {
      pullOp.$pull = {};
      if (boxIdsToDelete.length > 0) {
        pullOp.$pull.textboxes = { id: { $in: boxIdsToDelete } };
      }
      if (req.body.pathsToDelete && req.body.pathsToDelete.length > 0) {
        pullOp.$pull.paths = { $in: req.body.pathsToDelete };
      }
    }
    if (pullOp.$pull) {
      await collection.updateOne(query, pullOp);
    }

    updateOperation.$set = {
      thumbnailUrl: imageUrl,
    };

    const result = await collection.updateOne(query, updateOperation);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, folderId } = req.body;

    if (!name) {
      return res
        .status(400)
        .send({ message: "Name and folder id are required" });
    }

    if (folderId && !ObjectId.isValid(folderId)) {
      return res.status(400).send({ message: "Invalid folderId" });
    }
    let folderObjectId = null;
    if (folderId) {
      folderObjectId = new ObjectId(folderId);
    }

    const collection = db.collection("Notes");

    const results = await collection.insertOne({
      user: req.user.username,
      name: name,
      paths: [],
      textboxes: [],
      folderId: folderObjectId,
      thumbnailUrl: "",
    });

    res.status(200).send(results);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
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
