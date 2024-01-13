import { z } from "zod";

export const ChapterAccessSchema = z.object({
    isFree: z.boolean().default(false),
})