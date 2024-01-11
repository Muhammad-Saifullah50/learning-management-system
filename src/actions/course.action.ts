'use server'

import { auth } from "@clerk/nextjs";
import { db } from "../lib/prisma"

export const getCourseById = async (courseId: string) => {
    const { userId } = auth();
    const course = await db.course.findUnique({
        where: {
            id: courseId,
            userId: userId
        },
        include: {
            attachments: {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    return course
}

