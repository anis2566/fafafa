import * as React from "react"
import { DollarSign } from "lucide-react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils";

interface Props {
    amount: number;
    title: string;
}

export function BankCard({ amount, title }: Props) {

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-md font-medium">{title}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <h3 className={cn("text-2xl font-bold", amount < 0 ? "text-rose-500" : "")}>{amount}</h3>
            </CardContent>
        </Card>
    )
}