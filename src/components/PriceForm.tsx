"use client"

import { CoursePriceSchema } from "@/validations/CourseCreateSchema"
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
import { formatPrice } from "@/lib/format"


interface PriceFormProps {
    initialData: { price: number }
    courseId: string
}
const PriceForm = ({ initialData, courseId }: PriceFormProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter();

    const form = useForm<z.infer<typeof CoursePriceSchema>>({
        resolver: zodResolver(CoursePriceSchema),
        defaultValues: {
            price: initialData?.price
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof CoursePriceSchema>) => {

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
                Course Price
                <Button variant={'ghost'} onClick={toggleEdit}>
                    {isEditing ? 'Cancel' : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Price
                        </>
                    )}

                </Button>
            </div>

            {!isEditing && (
                <p className={cn('text-sm mt-2',
                    !initialData.price && "text-slate-500 italic"
                )}>
                    {initialData.price
                        ? formatPrice(initialData.price)
                        : 'No price'}</p>
            )}

            {isEditing && (
                <Form {...form}>
                    <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step={0.01}
                                            disabled={isSubmitting}
                                            {...field}
                                            placeholder="Set a price for your course"
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

export default PriceForm
