"use client"
import ConfirmModal from './modals/ConfirmModal'
import { Button } from './ui/button'
import { Trash } from 'lucide-react'

interface ChapterActionsProps {
    disabled: boolean
    courseId: string
    chapterId: string
    isPublished: boolean
}
const ChapterActions = ({ disabled, courseId, chapterId, isPublished }: ChapterActionsProps) => {
    return (
        <div className="flex items-center gap-x-2">
            <Button
                disabled={disabled}
                onClick={() => { }}
                variant={'outline'}
                size={'sm'}
            >{isPublished ? 'Unpublish' : 'Publish'}
            </Button>
            <ConfirmModal onConfirm={() => { }}>
                <Button size={'sm'}>
                    <Trash className='h-4 w-4' />
                </Button>
            </ConfirmModal>

        </div>
    )
}

export default ChapterActions
