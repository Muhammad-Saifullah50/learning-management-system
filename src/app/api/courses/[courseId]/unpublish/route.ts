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
        });

        if (!course) {
            return NextResponse.json({ error: "Course not found", status: 401 })

        };

        const unpublishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId: userId
            },
            data: {
                isPublished: false
            }
        });

        return NextResponse.json({ message: "Course published successfully", data: unpublishedCourse, status: 200 });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error?.message, status: 500 })
    }
}