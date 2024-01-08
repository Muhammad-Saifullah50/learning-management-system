"use client"

import { CourseImageSchema } from "@/validations/CourseCreateSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { ImageIcon, Pencil, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { Button } from "./ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Course } from "@prisma/client"
import Image from "next/image"
import { FileUpload } from "./FileUpload"

interface ImageFormProps {
    initialData: Course
    courseId: string
}
const ImageForm = ({ initialData, courseId }: ImageFormProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter();

    const form = useForm<z.infer<typeof CourseImageSchema>>({
        resolver: zodResolver(CourseImageSchema),
        defaultValues: {
            imageUrl: initialData.imageUrl || ""
        }
    });

    const onSubmit = async (values: z.infer<typeof CourseImageSchema>) => {

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
                Course Image
                <Button variant={'ghost'} onClick={toggleEdit}>
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Image
                        </>
                    )}

                </Button>
            </div>

            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md ">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="upload"
                            src={initialData.imageUrl}
                            fill
                            className="object-cover rounded-md"
                        />
                    </div>

                )
            )}

            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ imageUrl: url })
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageForm
