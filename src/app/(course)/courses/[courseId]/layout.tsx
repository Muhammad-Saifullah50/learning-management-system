import { getCourseWithPublishedChapters } from '@/actions/course.action'
import { getProgress } from '@/actions/progress.action'
import CourseNavbar from '@/components/CourseNavbar'
import CourseSidebar from '@/components/CourseSidebar'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

const CourseLayout = async ({ children, params }: {
    children: React.ReactNode
    params: { courseId: string }
}
) => {

    const { userId } = auth();
    if (!userId) { redirect('/') }

    const course = await getCourseWithPublishedChapters(userId, params.courseId);

    if (!course) { return redirect('/') }

    const progressCount = await getProgress(userId, course.id)
    return (
        <div className='h-full'>
            <div className='h-[80px] md:pl-80 fixed inset-y-0 w-full z-50'>
                <CourseNavbar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <div className='hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50'>
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <main className='md:pl-80 h-full pt-[80px]'>
                {children}
            </main>
        </div>
    )
}

export default CourseLayout
