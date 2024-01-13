import { getChapterById } from "@/actions/chapter.action";
import { auth } from "@clerk/nextjs";
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


    const  requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl
    ]                                                                                

    return (
        <div>

        </div>
    )
}

export default ChapterDetailsPage


























































































































































































