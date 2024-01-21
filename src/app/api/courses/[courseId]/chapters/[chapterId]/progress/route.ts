import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest, { params }: { params: { courseId: string, chapterId: string } }) => {

    try {

    } catch (error:any) {
        console.error(error)
        return NextResponse.json({ error: error?.message, status: 500 })
    }
}