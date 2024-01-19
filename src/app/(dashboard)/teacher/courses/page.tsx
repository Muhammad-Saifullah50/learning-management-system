import { getCoursesByUserId } from '@/actions/course.action'
import { columns } from '@/components/Columns'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const CoursesPage = async () => {

  const { userId } = auth();

  if (!userId) return redirect('/')

  const courses = await getCoursesByUserId(userId)

  return (
    <div className='p-6'>
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default CoursesPage
