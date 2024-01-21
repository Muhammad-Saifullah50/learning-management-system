"use client"

import { formatPrice } from "@/lib/format"
import { Button } from "./ui/button"
import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"

interface CourseEnrollButtonProps {
    courseId: string
    price: number
}
const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
    const [loading, setLoading] = useState(false)

    const onClick = async () => {
        try {
            setLoading(true);

            const response = await axios.post(`/api/courses/${courseId}/checkout`);
            window.location.assign(response.data.data)
        } catch (error: any) {
            console.error(error)
            toast.error(process.env.NODE_ENV === 'development' ? error?.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }
    return (
        <Button
            size="sm"
            className="w-full md:w-auto"
            onClick={onClick}
            disabled={loading}>Enroll for {formatPrice(price)}</Button>
    )
}

export default CourseEnrollButton
