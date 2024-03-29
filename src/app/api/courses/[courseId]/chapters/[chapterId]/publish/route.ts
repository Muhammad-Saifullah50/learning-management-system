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

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        });

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterId
            }
        });
        if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return NextResponse.json({ error: "Missing required fields", status: 400 })
        };

        const publishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json({ message: "Chapter published", data: publishedChapter, status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error", status: 500 })
    }
}