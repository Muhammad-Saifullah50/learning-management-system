import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest, { params }: { params: { courseId: string, chapterId: string } }) => {

    try {
        const { userId } = auth();
        const { isCompleted } = await request.json();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401 })
        };

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId
                }
            },
            update: {
                isCompleted
            },
            create: {
                userId,
                chapterId: params.chapterId,
                isCompleted
            }
        });

        return NextResponse.json({ message: "success", data: userProgress, status: 200 })

    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error?.message, status: 500 })
    }
}