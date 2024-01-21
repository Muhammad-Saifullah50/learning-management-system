import { getChapterForStudent } from '@/actions/chapter.action';
import Banner from '@/components/Banner';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'
import VideoPlayer from '@/components/VideoPlayer';
import CourseEnrollButton from '@/components/CourseEnrollButton';
import { Separator } from '@/components/ui/separator';
import Preview from '@/components/Preview';
import { FileIcon } from 'lucide-react';
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
                        completeOnEnd={completeOnEnd}
                        isLocked={isLocked}
                        videoUrl={chapter.videoUrl}
                    />
                </div>

                <div >
                    <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
                        <h2 className='text-2xl font-semibold mb-2'>{chapter.title}</h2>
                        {purchase ? (
                            <div>
                                {/* add coyurse oprogrss */}
                            </div>) : (
                            <CourseEnrollButton
                                courseId={params.courseId}
                                price={course.price!}
                            />
                        )}
                    </div>
                    <Separator />
                    <div>
                        <Preview value={chapter.description} />
                    </div>
                    {!!attachments.length && (
                        <>
                            <Separator />
                            <div className={'p-4'}>
                                {attachments.map((attachment) => (
                                    <a
                                        target='_blank'
                                        href={attachment.url}
                                        key={attachment.id}
                                        className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline">
                                        <p className='line-clamp-1'>
                                            <FileIcon className='h-4 w-4 mr-2' />{attachment.name}</p>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChapterIdPage
