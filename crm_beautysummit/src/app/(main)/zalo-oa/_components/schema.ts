import { z } from "zod";

export const userOASchema = z.object({
  user_id: z.string(),
  alias: z.string(),
  follower: z.string(),
  is_sensitive: z.string(),
  avatar: z.string(),
  phone: z.string(),
  city: z.string(),
  address: z.string(),
  district: z.string(),
});

export type UsersOA = z.infer<typeof userOASchema>;
