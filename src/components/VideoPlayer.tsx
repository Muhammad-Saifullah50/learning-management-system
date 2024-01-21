"use client";

import axios from "axios";
import { CldVideoPlayer } from 'next-cloudinary';
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import 'next-cloudinary/dist/cld-video-player.css';
import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/useConfettiStore";

interface VideoPlayerProps {
  videoUrl: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
  isCompleted?: boolean;
};

const VideoPlayer = ({
  videoUrl,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
  isCompleted
}: VideoPlayerProps) => {
  const router = useRouter();
  const confetti = useConfettiStore()

  const onEnd = async () => {
    try {
      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        isCompleted: true
      });

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success("Progress updated");
      router.refresh();

    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="relative aspect-video">
      {!isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">
            This chapter is locked
          </p>
        </div>
      )}
      {!isLocked && (
        <div className="relative aspect-video mt-2">
          <CldVideoPlayer
            onEnded={onEnd}
            src={videoUrl!}
            width={300}
            height={100}
            autoPlay
          />
        </div>
      )}

    </div>
  )
}

export default VideoPlayer