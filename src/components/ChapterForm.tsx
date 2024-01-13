"use client"

import { CourseDescriptionSchema, CourseTitleSchema } from "@/validations/CourseCreateSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Loader2, Pencil, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { Button } from "./ui/button"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Chapter, Course } from "@prisma/client"
import ChapterList from "./ChapterList"


interface ChapterFormProps {
    initialData: Course & { chapters: Chapter[] }
    courseId: string
}
const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {

    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const router = useRouter();

    const form = useForm<z.infer<typeof CourseTitleSchema>>({
        resolver: zodResolver(CourseTitleSchema),
        defaultValues: {
            title: ""
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof CourseTitleSchema>) => {

        try {
            const response = await axios.post(`/api/courses/${courseId}/chapters`, values)
            toast.success('Chapter created successfully');
            toggleCreating();
            router.refresh();
        } catch (error: any) {
            console.log(error)
            toast.error(process.env.NODE_ENV === 'development' ? error?.message : 'Something went wrong')
        }
    }

    const toggleCreating = () => setIsCreating(current => !current)

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true)

            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            });

            toast.success('Chapters reordered successfully')
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsUpdating(false)
        }
    }

    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`)
    }

    return (
        <div className="relative mt-6 bg-slate-100 border rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700" />

                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course Chapters
                <Button variant={'ghost'} onClick={toggleCreating}>
                    {isCreating ? 'Cancel' : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a chapter
                        </>
                    )}

                </Button>
            </div>

            {isCreating && (
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
                                            placeholder="e.g Introduction to the course ..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={isSubmitting || !isValid}
                            type="submit"
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            )}

            {!isCreating && (
                <div className={cn("text-sm mt-2",
                    !initialData.chapters.length && 'text-slate-500 italic'
                )}>
                    {!initialData.chapters.length && "No Chapters"}

                    <ChapterList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={initialData.chapters || []}
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-xs mt-4 text-muted-foreground">
                    Drag and drop to reorder the chapters
                </p>
            )}
        </div>
    )
}

export default ChapterForm
