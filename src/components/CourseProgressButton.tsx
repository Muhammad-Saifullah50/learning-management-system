"use client"
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { CheckCircle, XCircle } from 'lucide-react'
import { useConfettiStore } from '@/hooks/useConfettiStore'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

interface Props {
    chapterId: string
    courseId: string
    nextChapterId?: string
    isCompleted?: boolean
}
const CourseProgressButton = ({ chapterId, courseId, nextChapterId, isCompleted }: Props) => {


    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const Icon = isCompleted ? XCircle : CheckCircle;

    const onClick = async () => {
        try {
            setIsLoading(true)

            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted
            });

            if (!isCompleted && nextChapterId) {
                confetti.onOpen();
            }

            if (isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
            }

            toast.success('Course progress updated');
            router.refresh();
        } catch (error: any) {
            console.error(error)
            toast.error(process.env.NODE_ENV === 'development' ? error?.message : 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }
    return (

        <Button
            disabled={isLoading}
            type='button'
            variant={isCompleted ? 'outline' : 'success'}
            onClick={onClick}
            className='w-full md:w-auto'
        >
            {isCompleted ? 'Not Completed' : 'Mark as Complete'}
            <Icon className='h-4 w-4 ml-2' />
        </Button>
    )
}

export default CourseProgressButton
