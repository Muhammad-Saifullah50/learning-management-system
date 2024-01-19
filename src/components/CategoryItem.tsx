'use client'

import { cn } from "@/lib/utils"
import { IconType } from "react-icons"

interface Props {
    label?: string
    icon?: IconType
    value?: string
}
const CategoryItem = ({ label, icon: Icon, value }: Props) => {
    return (
        <button type="button" className={cn("py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition")}>
            {Icon && <Icon size={20} />}
            <span >
                {label}
            </span>
        </button>
    )
}

export default CategoryItem
