import { Category, Course } from "@prisma/client"
import CourseCard from "./CourseCard";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
}

interface CoursesListProps {
    items: CourseWithProgressWithCategory[]
}
const CoursesList = ({ items }: CoursesListProps) => {

    return (
        <div>
            {items.length === 0 && (
                <div className="h-[70vh]  w-full flex items-center justify-center text-center text-muted-foreground">
                    No courses found
                </div>)}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-4 ">
                {items.map((item) => (
                    <CourseCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        description={item.description!}
                        category={item?.category?.name!}
                        chaptersLength={item.chapters.length}
                        progress={item.progress!}
                        price={item.price!}
                        imageUrl={item.imageUrl!}
                    />
                ))}
            </div>
        </div>)
}

export default CoursesList
