import z from "zod";

export const StartChatSchema = z.object({
  seekerId: z
    .string('The value provided for seeker id is invalid'),
  soughtName: z
    .string('The value provided for name is invalid')
    .min(4, 'The name must be at least 4 characters long'),
})