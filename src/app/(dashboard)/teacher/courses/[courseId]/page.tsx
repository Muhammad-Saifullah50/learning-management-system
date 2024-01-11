import DescriptionForm from "@/components/DescriptionForm";
import IconBadge from "@/components/IconBadge";
import ImageForm from "@/components/ImageForm";
import TitleForm from "@/components/TitleForm";
import { getCourseById } from "@/actions/course.action";
import { auth } from "@clerk/nextjs"
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import { getCategories } from "@/actions/category.action";
import CategoryForm from "@/components/CategoryForm";
import { Category } from "@prisma/client";
import PriceForm from "@/components/PriceForm";
import AttachmentForm from "@/components/AttachmentForm";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {

    const { userId } = auth();

    if (!userId || !params.courseId) {
        return redirect('/')
    }

    const course = await getCourseById(params.courseId);
    const categories = await getCategories();

    if (!course) {
        return (<div>Course not found</div>)
    };

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `${completedFields}/${totalFields}`;
    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Course Setup</h1>
                    <span className="text-sm text-slate-700">Complete All fields ({completionText} completed)</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">Customize your course</h2>
                    </div>
                    <TitleForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <DescriptionForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <ImageForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <CategoryForm
                        initialData={course}
                        courseId={course.id}
                        options={categories.map((category: Category) => ({
                            label: category.name,
                            value: category.id
                        }))}
                    />
                </div>

                <div className="space-y-6">
                    <div >
                        <div className="flex items-center gap-x-2">
                            <IconBadge
                                icon={ListChecks}
                            />
                            <h2 className="text-xl">Course chapters</h2>
                        </div>
                        <div>
                            Todo chapters
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge
                                icon={CircleDollarSign}
                            />
                            <h2 className="text-xl">Sell your course </h2>
                        </div>

                        <PriceForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>

                    <div >
                        <div className="flex items-center gap-x-2">
                            <IconBadge
                                icon={File}
                            />
                            <h2 className="text-xl">Resources and attachments</h2>
                        </div>
                        <AttachmentForm
                        initialData={course}
                        courseId={course.id}
                    />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoursePage
