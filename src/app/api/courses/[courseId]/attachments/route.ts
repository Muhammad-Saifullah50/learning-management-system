import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
    request: NextRequest,
    { params }: { params: { courseId: string } }) => {

    try {

        const { userId } = auth();
        const { url } = await request.json();

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
        }

        const attachment = await db.attachment.create({
            data: {
                url: url,
                name: url.split('/').pop(),
                courseId: params.courseId
            }
        });

        return NextResponse.json({ message: "Attachment created successfully", data: attachment, status: 201 })
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error?.message, status: 500 })
    }
}