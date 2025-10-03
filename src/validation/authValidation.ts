import { z } from "zod";

export const Z_Login = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const Z_Signup = Z_Login.extend({
  name: z.string().min(2, "Name is required"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

export type LoginData = z.infer<typeof Z_Login>;
export type SignupData = z.infer<typeof Z_Signup>;
