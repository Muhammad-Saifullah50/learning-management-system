import { z } from "zod"

export const CourseTitleSchema = z.object({
    title: z.string().min(2, { message: "Title is required" }),
})

export const CourseDescriptionSchema = z.object({
    description: z.string().min(2, { message: "Description is required" }),
})

export const CourseImageSchema = z.object({
    imageUrl: z.string().min(2, { message: "Image is required" }),
})