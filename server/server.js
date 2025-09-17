import express from "express";
import cors from "cors";
import users from "./routes/users.js";
import notes from "./routes/notes.js";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", users);
app.use("/api/notes", notes);

app.listen(PORT, () => {
  console.log(`Server is listening on port:${PORT}`);
});
