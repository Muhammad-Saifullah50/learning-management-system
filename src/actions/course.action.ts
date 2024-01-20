'use server'

import { auth } from "@clerk/nextjs";
import { db } from "../lib/prisma"
import { Category, Course } from "@prisma/client";
import { getProgress } from "./progress.action";
import { notFound } from "next/navigation";

export const getCourseById = async (courseId: string) => {
    const { userId } = auth();

    const course = await db.course.findUnique({
        where: {
            id: courseId,
            userId: userId
        },
        include: {
            attachments: {
                orderBy: {
                    createdAt: 'desc'
                }
            },
            chapters: {
                orderBy: {
                    position: 'asc'
                }
            },
        }
    });
    return course
}

export const getCoursesByUserId = async (userId: string) => {
    try {
        const courses = await db.course.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return courses
    } catch (error) {
        console.error(error)
        return []
    }
}

type CourseWithProgressWithCategory = Course & {
    category: Category | null
    chapters: { id: string }[]
    progress: number | null
}

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
}

export const getCourses = async ({ userId, title, categoryId }: GetCourses) => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title
                },
                categoryId: categoryId,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
                purchases: {
                    where: {
                        userId
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const coursesWIthProgress: CourseWithProgressWithCategory[] = await Promise.all(courses.map(async (course: Course & { purchases: [] }) => {
            if (course.purchases.length === 0) {
                return {
                    ...course,
                    progress: null
                }
            }
            const progressPercentage = await getProgress(userId, course.id)
            return {
                ...course,
                progress: progressPercentage
            }
        }));

        return coursesWIthProgress
    } catch (error) {
        console.error(error)
        return []
    }
}

export const getCourseWithPublishedChapters = async (userId: string, courseId: string) => {
    try {
        const course = await db.course.findUnique({
            where: {
                id: courseId
            },
            include: {
                chapters: {
                    where: {
                        isPublished: true
                    },
                    include: {
                        userProgress: {
                            where: {
                                userId
                            }
                        }
                    },
                    orderBy: {
                        position: 'asc'
                    }
                },

            }
        });

        return course
    } catch (error) {
        console.error(error)
        return notFound();
    }
}