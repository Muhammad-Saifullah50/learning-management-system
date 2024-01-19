'use client'

import { Category } from "@prisma/client"
import { FcAutomatic, FcSalesPerformance, FcWebcam, FcAlarmClock, FcOvertime, FcGlobe, FcCamcorder, FcApproval } from "react-icons/fc"

import { FaComputer } from "react-icons/fa6";
import { IconType } from "react-icons";
import CategoryItem from "./CategoryItem";


interface Props {
    items: Category[]
}

const iconMap: Record<Category["name"], IconType> = {
    "Time Management": FcAlarmClock,
    "Marketing Strategies": FcSalesPerformance,
    "Computer Science": FaComputer,
    "Web Development": FcWebcam,
    "Financial Management": FcOvertime,
    "Foreign Languages": FcGlobe,
    "Communication Skills": FcAutomatic,
    "Generative AI": FcCamcorder,
    "Leadership Skills": FcApproval
}
const Categories = ({ items }: Props) => {
    return (
        <div className="flex items-center overflow-x-auto gap-x-2 pb-2">
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    )
}

export default Categories
