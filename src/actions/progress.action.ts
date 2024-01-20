import { db } from "@/lib/prisma";
import { Chapter } from "@prisma/client";

export const getProgress = async (userId: string, courseId: string): Promise<number> => {
    try {
        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true
            },
            select:{
                id: true
            }
        });

        const publishedChapterIds = publishedChapters.map((chapter:Chapter) => chapter.id);

        const validCompletedChapters = await db.userProgress.count({
            where: {
                userId,
                chapterId: {
                    in: publishedChapterIds
                },
                isCompleted: true
            }
        });

        const progressPercentage = (validCompletedChapters / publishedChapterIds.length) * 100;

        return progressPercentage
    } catch (error) {
        console.error(error)
        return 0
    }
}