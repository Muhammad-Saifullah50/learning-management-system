import { z } from "zod";

export const ChapterAccessSchema = z.object({
    isFree: z.boolean().default(false),
})

export const ChapterVideoSchema = z.object({
    videoUrl: z.string().min(1),
})