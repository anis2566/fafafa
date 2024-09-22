import { Role } from "@prisma/client"
import { redirect } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { ApplyForm } from "./_components/apply-form"
import { GET_USER } from "@/services/user.service"

const Apply = async () => {
    const {role} = await GET_USER()

    if(role === Role.Teacher) redirect("/teacher")

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <Card className="w-full max-w-xl">
                <CardContent className="space-y-4 py-4 pb-8">
                    <div className="space-y-3">
                        <div className="w-[60px] h-[60px] ring-4 ring-primary/80 rounded-full shadow-2xl shadow-primary aspect-square p-1 mx-auto">
                            <img
                                src="/logo.png"
                                alt="logo"
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <h1 className="text-center text-xl tracking-wider text-primary border-b font-semibold">Apply as Teacher</h1>

                    <ApplyForm />
                </CardContent>
            </Card>
        </div>
    )
}

export default Apply
