import { getCourseForStudent } from '@/actions/course.action'
import { redirect } from 'next/navigation';
import React from 'react'

const CoursePage = async ({ params }: { params: { courseId: string } }) => {

  const course = await getCourseForStudent(params.courseId);

  if (!course) return redirect('/')
  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`)
}

export default CoursePage
