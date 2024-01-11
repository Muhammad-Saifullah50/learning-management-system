import { z } from "zod"

export const CourseTitleSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
})

export const CourseDescriptionSchema = z.object({
    description: z.string().min(1, { message: "Description is required" }),
})

export const CourseImageSchema = z.object({
    imageUrl: z.string().min(1, { message: "Image is required" }),
})

export const CourseCategorySchema = z.object({
    categoryId: z.string().min(1, { message: "Please select a category" }),
})

export const CoursePriceSchema = z.object({
    price: z.coerce.number().min(1, { message: "Price is required" }),
})

export const CourseAttachmentSchema = z.object({
    url: z.string().min(1, { message: "Attachment is required" }),
})