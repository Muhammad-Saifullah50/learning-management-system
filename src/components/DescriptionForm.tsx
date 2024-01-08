"use client"

import { CourseDescriptionSchema } from "@/validations/CourseCreateSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { Button } from "./ui/button"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Textarea } from "./ui/textarea"


interface DescriptionFormProps {
    initialData: { description: string }
    courseId: string
}
const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter();

    const form = useForm<z.infer<typeof CourseDescriptionSchema>>({
        resolver: zodResolver(CourseDescriptionSchema),
        defaultValues: initialData
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof CourseDescriptionSchema>) => {

        try {
            const response = await axios.patch(`/api/courses/${courseId}`, values)
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
                Course Description
                <Button variant={'ghost'} onClick={toggleEdit}>
                    {isEditing ? 'Cancel' : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Description
                        </>
                    )}

                </Button>
            </div>

            {!isEditing && (
                <p className={cn('text-sm mt-2',
                    !initialData.description && "text-slate-500 italic"
                )}>
                    {initialData.description || "No Description"}</p>
            )}

            {isEditing && (
                <Form {...form}>
                    <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}

                                            {...field}
                                            placeholder="e.g This course is about ..."
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

export default DescriptionForm
