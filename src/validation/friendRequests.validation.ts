import { z } from "zod";

const getFriendRequestsSchema = z.object({
  params: z.object({
    username: z.string()
  })
});

const sendFriendRequestSchema = z.object({
  body: z.object({
    from: z.string(),
    to: z.string()
  })
});

export { getFriendRequestsSchema, sendFriendRequestSchema };
