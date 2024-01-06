'use server'

import { db } from "./prisma"

export const getCourseById = async (courseId: string) => {
    const course = await db.course.findUnique({
        where: {
            id: courseId
        }
    });

    return course
}