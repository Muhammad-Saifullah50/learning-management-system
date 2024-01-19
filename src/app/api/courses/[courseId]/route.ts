import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!
)
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

export const DELETE = async (request: NextRequest, { params }: { params: { courseId: string } }) => {

    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401 })
        }

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

        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                await Video.Assets.del(chapter.muxData.assetId);
            }
        };

        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId
            }
        });

        return NextResponse.json({ message: "Course deleted successfully", data: deletedCourse, status: 200 });


    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error?.message, status: 500 })
    }
}

