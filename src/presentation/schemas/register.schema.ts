import z from "zod";

export const RegisterSchema = z.object({
  name: z
    .string('The value provided for name is invalid')
    .min(4, 'The name must be at least 4 characters long'),
  password: z
    .string('The value provided for password is invalid')
    .min(8, 'The password must be at least 8 characters long')
})
