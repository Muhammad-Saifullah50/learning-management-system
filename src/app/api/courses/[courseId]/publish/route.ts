import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { Chapter } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (request: NextRequest, { params }: { params: { courseId: string } }) => {

    try {

        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401 })

        };

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true

                    }
                }
            }
        });

        if (!course) {
            return NextResponse.json({ error: "Course not found", status: 401 })

        };

        const hasPublishedChapter = course.chapters.some((chapter: Chapter) => chapter.isPublished);

        if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter) {

            return NextResponse.json({ error: "Course not ready to publish", status: 401 })
        };

        const publishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId: userId
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json({ message: "Course published successfully", data: publishedCourse, status: 200 });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error?.message, status: 500 })
    }
}