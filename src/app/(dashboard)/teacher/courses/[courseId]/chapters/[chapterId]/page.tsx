import { getChapterById } from "@/actions/chapter.action";
import IconBadge from "@/components/IconBadge";
import ChapterAccessForm from "@/components/chapter-forms/ChapterAccessForm";
import ChapterDescriptionForm from "@/components/chapter-forms/ChapterDescriptionForm";
import ChapterTitleForm from "@/components/chapter-forms/ChapterTitleForm";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const ChapterDetailsPage = async ({ params }: {
    params: {
        courseId: string,
        chapterId: string
    }
}) => {

    const { userId } = auth();
    if (!userId) return redirect("/");

    const chapter = await getChapterById(params.chapterId, params.courseId);

    if (!chapter) return redirect("/");


    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completetionText = `(${completedFields}/${totalFields})`

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Button variant="ghost" className="flex items-center text-sm  transition mb-6">
                        <Link href={`/teacher/courses/${params.courseId}`}
                            className="flex"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to course setup
                        </Link>
                    </Button>

                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">Chapter Creation</h1>
                            <span>Complete all fields {completetionText} completed</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 mt-16 gap-6">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">Customize your chapter</h2>
                        </div>
                        <ChapterTitleForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                        <ChapterDescriptionForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                    </div>

                    <div className="">
                        <div className="flex items-center gap-x-2">
                            <IconBadge
                                icon={Eye}
                            />
                            <h2 className="text-xl">Access Settings</h2>
                        </div>

                        <ChapterAccessForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChapterDetailsPage

























































































































































































