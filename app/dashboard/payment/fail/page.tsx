import { CircleXIcon } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "APBn Scouts | Payment Failed",
    description: "Apbn scouts group",
}

const PaymentFailed = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Card className="w-full max-w-md">
                <CardContent className="space-y-6 p-6">
                    <div className="flex flex-col items-center justify-center">
                        <CircleXIcon className="h-12 w-12 text-red-500" />
                        <h2 className="mt-4 text-2xl font-bold">Payment Failed</h2>
                        <p className="mt-2 text-muted-foreground text-center">
                            There was an issue processing your payment. Please try again.
                        </p>
                    </div>
                    <Button className="w-full" asChild>
                        <Link href="/dashboard">Go Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default PaymentFailed