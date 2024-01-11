import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
    request: NextRequest,
    { params }: { params: { courseId: string } }) => {

    try {
        const { userId } = auth();
        const { title } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401 })
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if (!courseOwner) {
            return NextResponse.json({ error: "Unauthorized", status: 401 })
        };

        const lastChapter = await db.chapter.findFirst({
            where:{
                courseId: params.courseId
            },
            orderBy:{
                position: 'desc'
            },

        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title,
                position: newPosition,
                courseId: params.courseId
            }
        });

        return NextResponse.json({ message: "Chapter created successfully", data: chapter, status: 201 })

    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error?.message, status: 500 })
    }
}