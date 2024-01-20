import { getChapterForStudent } from '@/actions/chapter.action';
import Banner from '@/components/Banner';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'
import VideoPlayer from '@/components/VideoPlayer';
const ChapterIdPage = async ({ params }: { params: { courseId: string, chapterId: string } }) => {

    const { userId } = auth();

    if (!userId) return redirect('/')

    const foundChapter = await getChapterForStudent(userId, params.chapterId, params.courseId,)

    const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase } = foundChapter;

    if (!chapter || !course) return redirect('/');

    const isLocked = !chapter.isFree && !purchase;

    const completeOnEnd = !!purchase && !userProgress?.isCompleted
    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    variant={'success'}
                    label='You have already completed this chapter'
                />
            )}
            {isLocked && (
                <Banner
                    label='You need to purchase this course to watch this chapter'
                />
            )}
            <div className='flex flex-col max-w-4xl mx-auto pb-20'>
                <div className='p-4'>
                    <VideoPlayer
                        chapterId={params.chapterId}
                        courseId={params.courseId}
                        title={chapter.title}
                        nextChapterId={nextChapter?.id!}
                        playbackId={muxData?.playbackId}
                        completeOnEnd={completeOnEnd}
                        isLocked={isLocked}
                    />
                </div>

                <div >
                    <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChapterIdPage
