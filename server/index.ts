import express from "express";
import mongoose from "mongoose";
const app = express();

const port = 3000;
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todo";
import cors from "cors";

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);
app.get("/", (req, res) => {
  res.send("Todo App");
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

mongoose.connect(
  "mongodb+srv://shashwa7dev:srt123@cluster0.piqkefh.mongodb.net/",
  { dbName: "todos" }
);
