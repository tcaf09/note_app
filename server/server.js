import express from "express";
import cors from "cors";
import users from "./routes/users.js"

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors);
app.use(express.json());
app.use("/api/users", users)


app.listen(PORT, () => {
  console.log(`Server is listening on port:${PORT}`);
});
