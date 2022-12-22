import { z } from "zod";

const file = z.object({
  name: z.string(),
  size: z.number(),
  data: z.instanceof(Buffer),
  truncated: z.literal(false, { description: "Files exceeded maximum size" }),
  mimetype: z.union([
    z.literal("image/jpeg"),
    z.literal("image/png"),
    z.literal("image/webp")
  ])
});

const createPostSchema = z.object({
  body: z.object({
    caption: z.string().min(0).max(2048)
  }),
  files: z.object({
    media: z.array(file).min(1).or(file)
  })
});

export { createPostSchema };
