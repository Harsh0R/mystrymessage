import {z} from 'zod';

export const verifySchema = z.object({
  token: z.string().min(6, {message: "Varification token must be at least 6 characters long"}),
});