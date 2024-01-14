import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
    request: NextRequest,
    { params }: { params: { courseId: string, chapterId: string } }
) => {
    try {
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error", status: 500 })
    }
}