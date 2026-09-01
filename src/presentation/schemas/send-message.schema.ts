import z from "zod";

export const SendMessageSchema = z.object({
  idChat: z
    .string('The value provided for chat id is invalid'),
  idSender: z
    .string('The value provided for sender id is invalid'),
  content: z
    .string('The value provided for content is invalid')
    .min(1, 'The content must be at least 1 characters long'),
})