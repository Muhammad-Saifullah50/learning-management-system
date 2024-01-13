'use server'

import { db } from "@/lib/prisma"

export const getChapterById = async (chapterId: string, courseId: string) => {
    try {
        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            },
            include: {
                muxData: true
            }
        });

        return chapter
    } catch (error) {
        console.error(error)
    }
}