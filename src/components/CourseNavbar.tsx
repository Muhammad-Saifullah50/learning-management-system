import { Chapter, Course, UserProgress } from "@prisma/client"
import NavbarRoutes from "./NavbarRoutes"
import CourseMobileSidebar from "./CourseMobileSidebar"

interface CourseNavbarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null
        })[]
    }
    progressCount: number
}
const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
    return (
        <div className="p-4 border-b flex items-center bg-white shadow-sm">
            <CourseMobileSidebar
                course={course}
                progressCount={progressCount}
            />
            <NavbarRoutes />
        </div>
    )
}

export default CourseNavbar
