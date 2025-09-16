import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors);
app.use(express.json());

let users = [];

app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const newUser = {
    id: Date.now().toString(),
    username,
    password,
  };

  users.push(newUser);
  res.status(200).json({ message: "User Creates", userId: newUser.id });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port:${PORT}`);
});
