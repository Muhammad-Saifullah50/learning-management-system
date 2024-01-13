"use client"

import { CourseTitleSchema } from "@/validations/CourseCreateSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { Button } from "../ui/button"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { useRouter } from "next/navigation"


interface ChapterTitleForm {
    initialData: { title: string }
    courseId: string
    chapterId: string
}
const ChapterTitleForm = ({ initialData, courseId, chapterId }: ChapterTitleForm) => {

    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter();

    // using course title schema as it is similar
    const form = useForm<z.infer<typeof CourseTitleSchema>>({
        resolver: zodResolver(CourseTitleSchema),
        defaultValues: {
            title: initialData?.title
        }

    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof CourseTitleSchema>) => {

        try {
            const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success('Course updated successfully');
            toggleEdit();
            router.refresh();
        } catch (error: any) {
            console.log(error)
            toast.error(process.env.NODE_ENV === 'development' ? error?.message : 'Something went wrong')
        }
    }

    const toggleEdit = () => setIsEditing(current => !current)

    return (
        <div className="mt-6 bg-slate-100 border rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Title
                <Button variant={'ghost'} onClick={toggleEdit}>
                    {isEditing ? 'Cancel' : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit title
                        </>
                    )}

                </Button>
            </div>

            {!isEditing && (
                <p className="text-sm mt-2">{initialData.title}</p>
            )}

            {isEditing && (
                <Form {...form}>
                    <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            {...field}
                                            placeholder="e.g Introduction to the course"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={isSubmitting || !isValid}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default ChapterTitleForm
