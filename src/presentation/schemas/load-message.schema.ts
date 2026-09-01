import z from "zod";

export const LoadMessageSchema = z.object({
  userId: z
    .string('The value provided for user id is invalid'),
})