'use server'
import { db } from "@/lib/prisma"

export const getPurchase = async (userId: string, courseId:string) => {
    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        return purchase
    } catch (error) {
        console.error(error)
    }
}