import { formatPrice } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface DataCardProps {
    label: string
    value: number
    shouldFormat?: boolean
}
const DataCard = ({ label, value, shouldFormat }: DataCardProps) => {
    return (
        <Card>
            <CardHeader className="space-y-0 pb-2flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {shouldFormat ? formatPrice(value) : value}
                </div>
            </CardContent>
        </Card>
    )
}

export default DataCard
