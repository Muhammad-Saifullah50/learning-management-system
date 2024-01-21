"use client"

import { formatPrice } from "@/lib/format"
import { Button } from "./ui/button"

interface CourseEnrollButtonProps {
    courseId: string
    price: number
}
const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
    return (
        <Button size="sm" className="w-full md:w-auto">Enroll for {formatPrice(price)}</Button>
    )
}

export default CourseEnrollButton
