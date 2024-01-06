import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const POST = async (request: NextRequest) => {
    try {
        const { userId } = auth();
        const { title } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401 })
        }

        const course = await db.course.create({
            data: {
                userId,
                title
            }
        })

        return NextResponse.json({ message: "Course created successfully", data: course, status: 201 })
    } catch (error: any) {
        console.error(error?.message)
        return NextResponse.json({ error: error?.message, status: 500 })
    }
} 