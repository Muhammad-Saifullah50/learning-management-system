import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
    request: NextRequest,
    { params }: { params: { courseId: string, chapterId: string } }
) => {
    try {

        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401 })
        };

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if (!ownCourse) {
            return NextResponse.json({ error: "Unauthorized", status: 401 })
        };



        const unpublishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPublished: false
            }
        });

        const publishedChaptersinCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        });

        if (publishedChaptersinCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false
                }
            })
        }
        return NextResponse.json({ message: "Chapter unpublished", data: unpublishedChapter, status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error", status: 500 })
    }
}