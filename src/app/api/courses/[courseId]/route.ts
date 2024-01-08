import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (request: NextRequest, { params }: { params: { courseId: string } }) => {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401 })
        }

        const values = await request.json();
        const { courseId } = params;

        const course = await db.course.update({
            where: {
                id: courseId,
                userId: userId
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json({ message: "Course updated successfully", data: course, status: 200 });

    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error?.message, status: 500 })
    }
}