import { dashboardCourses } from "@/actions/course.action";
import CoursesList from "@/components/CoursesList";
import InfoCard from "@/components/InfoCard";
import { auth } from "@clerk/nextjs";
import { CheckCircle, Clock } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Home',
}
export default async function Dashboard() {

  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  };
  const { completedCourses, coursesInProgress } = await dashboardCourses(userId);
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label='In Progress'
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label='Completed'
          numberOfItems={completedCourses.length}
          variant="success"
        />

      </div>
      <CoursesList
        items={[...coursesInProgress, ...completedCourses]}
      />
    </div>
  )
}
