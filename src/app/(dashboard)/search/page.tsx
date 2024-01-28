import { getCategories } from "@/actions/category.action"
import { getCourses } from "@/actions/course.action";
import Categories from "@/components/Categories";
import CoursesList from "@/components/CoursesList";
import SearchInput from "@/components/SearchInput";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: {
    title: string
    categoryId: string
  }
}

export const metadata = {
  title: 'Search Courses'
}
const SearchPage = async ({ searchParams }: SearchPageProps) => {

  const { userId } = auth();

  if (!userId) return redirect('/')
  const categories = await getCategories();
  const courses = await getCourses({ userId, ...searchParams })
  return (
    <>
      <div className="p-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4 ">
        <Categories
          items={categories}
        />
        <CoursesList items={courses} />
      </div>
    </>)
}

export default SearchPage
