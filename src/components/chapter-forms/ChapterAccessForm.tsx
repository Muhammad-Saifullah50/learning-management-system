"use client"

import { CourseDescriptionSchema } from "@/validations/CourseCreateSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { Button } from "../ui/button"
import { useState } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "../ui/form"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Editor from "../Editor"
import { Chapter } from "@prisma/client"
import Preview from "../Preview"
import { ChapterAccessSchema } from "@/validations/ChapterCreateSchema"
import { Checkbox } from "../ui/checkbox"


interface ChapterAccessFormProps {
    initialData: Chapter
    courseId: string;
    chapterId: string
}
const ChapterAccessForm = ({ initialData, courseId, chapterId }: ChapterAccessFormProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter();

    const form = useForm<z.infer<typeof ChapterAccessSchema>>({
        resolver: zodResolver(ChapterAccessSchema),
        defaultValues: {
            isFree: !!initialData?.isFree
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof ChapterAccessSchema>) => {

        try {
            const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success('Chapter updated successfully');
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
                Chapter Access
                <Button variant={'ghost'} onClick={toggleEdit}>
                    {isEditing ? 'Cancel' : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Chapter Access
                        </>
                    )}

                </Button>
            </div>

            {!isEditing && (
                <p className={cn('text-sm mt-2',
                    !initialData.isFree && "text-slate-500 italic"
                )}>
                    {initialData.isFree
                        ? "This chapter is free for preview"
                        : "This chapter is not free"}

                </p>
            )}

            {isEditing && (
                <Form {...form}>
                    <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="isFree"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormDescription>
                                            Check this box if you want to make this chapter free to view
                                        </FormDescription>
                                    </div>
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

export default ChapterAccessForm
