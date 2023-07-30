import jwt from "jsonwebtoken";
import express from "express";
import { authenticateJwt, SECRET } from "../middleware/";
import { User } from "../db";
import AUTH_PROPS from "../validators/auth";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const parsedInput = AUTH_PROPS.signupProps.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(411).json({
      msg: parsedInput.error,
    });
  }
  const user = await User.findOne({ username: parsedInput.data.username });
  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({
      username: parsedInput.data.username,
      password: parsedInput.data.password,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "1h" });
    res.json({ message: "User created successfully", token });
  }
});

router.post("/login", async (req, res) => {
  const parsedInput = AUTH_PROPS.loginProps.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(411).json({
      msg: parsedInput.error,
    });
  }
  const user = await User.findOne({
    username: parsedInput.data.username,
    password: parsedInput.data.password,
  });
  if (user) {
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

router.get("/me", authenticateJwt, async (req, res) => {
  const userId = req.headers["userId"];
  const user = await User.findOne({ _id: userId });
  if (user) {
    res.json({ username: user.username });
  } else {
    res.status(403).json({ message: "User not logged in" });
  }
});

export default router;
