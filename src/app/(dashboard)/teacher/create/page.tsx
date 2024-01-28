'use client'

import { useForm } from "react-hook-form"
import { z } from "zod"
import { CourseTitleSchema } from '@/validations/CourseCreateSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControl, FormField, FormItem, FormLabel, Form, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export const metadata = {
  title: 'New Course'
}
const CreateCoursePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof CourseTitleSchema>>(
    {
      resolver: zodResolver(CourseTitleSchema),
      defaultValues: {
        title: ''
      }
    }
  )

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof CourseTitleSchema>) => {
    try {
      const response = await axios.post('/api/courses', values)
      router.push(`/teacher/courses/${response.data.data.id}`)
      toast.success('Course created successfully')
    } catch (error: any) {
      console.log(error)
      toast.error(process.env.NODE_ENV === 'development' ? error?.message : 'Something went wrong')
    }
  }
  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">What would you like to name your course? Dont worry, you can change it later</p>
        <Form
          {...form}
        >
          <form onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8">
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Course title
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='e.g. Advanced Web Development'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>What will you teach in this course</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href={'/'}>
                <Button variant={'ghost'} type="button">Cancel</Button>
              </Link>
              <Button disabled={!isValid || isSubmitting} type="submit">Continue</Button>

            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreateCoursePage
