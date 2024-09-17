import { Role, Status } from "@prisma/client"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { Pending } from "./_components/pending"
import { TeacherLayoutComp } from "./_components/teacher-layout"
import { AppKnockProviders } from "@/providers/knock-provider"
import { WebPushProvider } from "@/providers/web-push-provider"

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth()

    if (!session?.status || !session.userId) {
        redirect("/")
    }

    const isTeacher = session.role === Role.Teacher

    return (
        <WebPushProvider>
            <AppKnockProviders userId={session.userId}>
                <TeacherLayoutComp>
                    {
                        isTeacher && session.status === Status.Pending ? <Pending /> : children
                    }
                </TeacherLayoutComp>
            </AppKnockProviders>
        </WebPushProvider>
    )
}

export default TeacherLayout
