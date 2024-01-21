import Image from "next/image"
import Link from "next/link"
import IconBadge from "./IconBadge"
import { BookOpen } from "lucide-react"
import { formatPrice } from "@/lib/format"
import CourseProgress from "./CourseProgress"

interface CourseCardProps {
    id: string
    title: string
    description: string
    category: string
    chaptersLength: number
    progress: number
    price: number
    imageUrl: string
}
const CourseCard = ({ id, title, description, category, chaptersLength, progress, price, imageUrl }: CourseCardProps) => {
    return (
        <Link href={`/courses/${id}`}>
            <div className="group hover:shadow-sm trasition overflow-hidden border rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        fill
                        className="object-cover"
                        src={imageUrl}
                        alt={title}
                    />
                </div>
                <div className="flex flex-col p-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 line-clamp-2 transition">
                        {title}
                    </div>
                    <p className="text-sm text-muted-foreground">{category}</p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-1 text-slate-500">
                            <IconBadge icon={BookOpen} variant="default" size="sm" />
                            <span >{chaptersLength} {chaptersLength === 1 ? 'Chapter' : 'Chapters'}</span>
                        </div>
                    </div>
                    {progress !== null ? (
                        <CourseProgress
                            size="sm"
                            value={progress}
                            variant={progress === 100 ? 'success' : 'default'}
                        />
                    ) : (
                        <p className="text-base md:text-sm font-medium text-slate-700">
                            {formatPrice(price)}
                        </p>

                    )}
                </div>
            </div>
        </Link >
    )
}

export default CourseCard
