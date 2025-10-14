import express from "express";
import cors from "cors";
import users from "./routes/users.js";
import notes from "./routes/notes.js";
import folders from "./routes/folders.js";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/api/users", users);
app.use("/api/notes", notes);
app.use("/api/folders", folders);

app.listen(PORT, () => {
  console.log(`Server is listening on port:${PORT}`);
});
