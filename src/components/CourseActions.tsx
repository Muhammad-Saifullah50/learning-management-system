"use client"
import { useState } from 'react'
import ConfirmModal from './modals/ConfirmModal'
import { Button } from './ui/button'
import { Trash } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useConfettiStore } from '@/hooks/useConfettiStore'

interface CourseActionsProps {
    disabled: boolean
    courseId: string
    isPublished: boolean
}
const CourseActions = ({ disabled, courseId, isPublished }:
    CourseActionsProps) => {
    const confetti = useConfettiStore();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onPublish = async () => {
        try {
            setLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`)
                toast.success('Course unpublished successfully');

            } else {
                await axios.patch(`/api/courses/${courseId}/publish`)
                toast.success('Course published successfully');
                confetti.onOpen();

            }
            router.refresh();
        } catch (error: any) {
            console.error(error)
            toast.error(process.env.NODE_ENV === 'development' ? error?.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }
    const onDelete = async () => {
        try {
            setLoading(true)

            axios.delete(`/api/courses/${courseId}`)
            toast.success("Course deleted successfully");
            router.push(`/teacher/courses`)
            router.refresh();

        } catch (error: any) {
            console.error(error)
            toast.error(process.env.NODE_ENV === 'development' ? error?.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                disabled={disabled}
                onClick={onPublish}
                variant={'outline'}
                size={'sm'}
            >{isPublished ? 'Unpublish' : 'Publish'}
            </Button>
            <ConfirmModal onConfirm={onDelete} >

                <Button size={'sm'} variant={'destructive'} disabled={loading}>
                    <Trash className='h-4 w-4' />
                </Button>
            </ConfirmModal>

        </div>
    )
}

export default CourseActions
