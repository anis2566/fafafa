import { ClockIcon } from "lucide-react"

import { CardTitle, CardDescription, CardHeader, Card } from "@/components/ui/card"

import { ContentLayout } from "./content-layout"

export function Pending() {

    return (
        <ContentLayout title="Dashboard">
            <div className="flex items-center justify-center h-[80vh]">
                <Card className="w-full max-w-md p-6 shadow-lg rounded-lg">
                    <CardHeader className="text-center">
                        <ClockIcon className="h-12 w-12 text-yellow-500 mb-4 mx-auto" />
                        <CardTitle className="text-2xl font-bold">Pending Account</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400 mt-2">
                            Your account is currently pending approval. Please contact HR to resolve this issue.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </ContentLayout>
    )
}