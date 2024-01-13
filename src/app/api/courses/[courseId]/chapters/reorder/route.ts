import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
    request: NextRequest,
    { params }: { params: { courseId: string } }) => {

    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401 })
        };

        const { list } = await request.json();

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if (!ownCourse) {
            return NextResponse.json({ error: "Unauthorized", status: 401 })
        };

        for (let item of list) {
            await db.chapter.update({
                where: {
                    id: item.id
                },
                data: {
                    position: item.position
                }
            })
        };

        return NextResponse.json({ message: "Chapters reordered successfully", status: 200 });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error?.message, status: 500 })
    }
}