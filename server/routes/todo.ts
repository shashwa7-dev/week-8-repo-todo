import express from "express";
import { authenticateJwt, SECRET } from "../middleware/index";
import { Todo } from "../db";
import TODOS_PROPS from "../validators/todos";
const router = express.Router();

router.post("/todos", authenticateJwt, (req, res) => {
  const parsedData = TODOS_PROPS.newTodoProps.safeParse(req.body);
  const done = false;
  if (!parsedData.success) {
    return res.status(411).json({
      msg: parsedData.error,
    });
  }
  const userId = req.headers["userId"];
  const newTodo = new Todo({
    title: parsedData.data.title,
    description: parsedData.data.description,
    done,
    userId,
  });

  newTodo
    .save()
    .then((savedTodo) => {
      res.status(201).json(savedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to create a new todo" });
    });
});

router.get("/todos", authenticateJwt, (req, res) => {
  const userId = req.headers["userId"];

  Todo.find({ userId })
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to retrieve todos" });
    });
});

router.patch("/todos/:todoId/done", authenticateJwt, (req, res) => {
  const parsedTodoID = TODOS_PROPS.updateTodoProps.safeParse(req.params);
  const parseUserID = TODOS_PROPS.updateTodoProps.safeParse(
    req.headers["userId"]
  );
  if (!parsedTodoID.success || !parseUserID.success) {
    if (!parseUserID.success && !parsedTodoID.success) {
      return res.status(411).json({
        msg: [parsedTodoID.error, parseUserID.error],
      });
    }
    if (!parseUserID.success) {
      return res.status(411).json({
        msg: parseUserID.error,
      });
    }
    if (!parsedTodoID.success) {
      return res.status(411).json({
        msg: parsedTodoID.error,
      });
    }
  }

  Todo.findOneAndUpdate(
    { _id: parsedTodoID.data.todoId, userId: parseUserID.data.userId },
    { done: true },
    { new: true }
  )
    .then((updatedTodo) => {
      if (!updatedTodo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json(updatedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to update todo" });
    });
});

export default router;
