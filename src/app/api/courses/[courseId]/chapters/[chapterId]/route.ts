import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Mux from '@mux/mux-node';

export const PATCH = async (
    request: NextRequest,
    { params }: { params: { courseId: string, chapterId: string } }
) => {
    try {
        const { Video } = new Mux(
            process.env.MUX_TOKEN_ID!,
            process.env.MUX_TOKEN_SECRET!
        );

        const { userId } = auth();
        const { isPublished, ...values } = await request.json();

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

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                ...values,
            }
        });

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            };

            const asset = await Video.Assets.create({
                input: values.videoUrl,
                playback_policy: 'public',
                test: false
            });

            await db.muxData.create({
                data: {
                    assetId: asset.id,
                    chapterId: params.chapterId,
                    playbackId: asset.playback_ids?.[0].id
                }
            });


        }
        return NextResponse.json({ message: "Chapter updated successfully", data: chapter, status: 200 });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error?.message, status: 500 })
    }
}

export const DELETE = async (
    request: NextRequest,
    { params }: { params: { courseId: string, chapterId: string } }
) => {

    try {

        const { userId } = auth();
        const { Video } = new Mux(
            process.env.MUX_TOKEN_ID!,
            process.env.MUX_TOKEN_SECRET!
        );

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401 })
        };

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if (!courseOwner) {
            return NextResponse.json({ error: "Unauthorized", status: 401 })
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },

        });

        if (!deletedChapter) {
            return NextResponse.json({ error: "Chapter not found", status: 404 })
        };

        if (deletedChapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })

            }
        }

        const publishedChaptersInCourse = db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json({ message: "Chapter deleted successfully", data: deletedChapter, status: 200 });

    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error?.message, status: 500 })
    }
}