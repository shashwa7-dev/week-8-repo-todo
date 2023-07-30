import { z } from "zod";

const newTodoProps = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(200),
});
const updateTodoProps = z.object({
  todoId: z.string().min(1).max(100).optional(),
  userId: z.string().min(1).max(100).optional(),
});
const TODOS_PROPS = {
  newTodoProps,
  updateTodoProps,
};

export default TODOS_PROPS;
