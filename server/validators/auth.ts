import { z } from "zod";

const signupProps = z.object({
  username: z.string().min(8).max(50),
  password: z.string().min(8).max(50),
});

const AUTH_PROPS = {
  signupProps,
  loginProps: signupProps,
};

export default AUTH_PROPS;
