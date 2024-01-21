"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon, VideoIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ChapterVideoSchema } from "@/validations/ChapterCreateSchema";
import { CldUploadWidget, CldVideoPlayer } from "next-cloudinary";
import 'next-cloudinary/dist/cld-video-player.css';


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
    const [videoUrl, setVideoUrl] = useState(initialData.videoUrl);

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
    };
    const handleUpload = async (result: any) => {
        setVideoUrl(result.info.secure_url);
        await onSubmit({ videoUrl: result.info.secure_url });
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
                        <CldVideoPlayer
                            src={videoUrl!}
                            width={300}
                            height={100}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        options={{
                            maxFiles: 1,
                            sources: ['local', 'url']

                        }}
                        onUpload={handleUpload}>
                        {({ open }) => {
                            return (
                                <div
                                    className="p-20 flex items-center justify-center border-dashed border-2 border-slate-500"
                                    onClick={() => open()}>
                                    <button className="bg-blue-700 hover:bg-blue-700/90 text-sm text-white py-2 px-3 flex items-center justify-center rounded-md"> Upload a video</button>
                                </div>
                            );
                        }}
                    </CldUploadWidget>
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