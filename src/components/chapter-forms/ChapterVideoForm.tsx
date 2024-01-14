"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon, VideoIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course, MuxData } from "@prisma/client";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "../FileUpload";
import { CourseImageSchema } from "@/validations/CourseCreateSchema";
import { ChapterVideoSchema } from "@/validations/ChapterCreateSchema";
interface ChapterVideoProps {
    initialData: Chapter & { muxData?: MuxData | null }
    courseId: string;
    chapterId: string
};

export const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterVideoProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof ChapterVideoSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit video
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <VideoIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer
                        playbackId={initialData.muxData?.playbackId || ""}
                        
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if (url) {
                                console.log(url, 'url')
                                onSubmit({ videoUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this chapter&apos;s video
                    </div>
                </div>
            )}

            {initialData.videoUrl && !isEditing && (
                <p className="text-xs text-muted-foreground mt-2">Videos can take a few minutes to process. Refresh the page if the video does not appear</p>
            )}
        </div>
    )
}

export default ChapterVideoForm