import { z } from "zod"

export const CourseCreateSchema = z.object({
    title: z.string().min(2, { message: "Title is required" }),
})