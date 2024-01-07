import { z } from "zod"

export const CourseTitleSchema = z.object({
    title: z.string().min(2, { message: "Title is required" }),
})