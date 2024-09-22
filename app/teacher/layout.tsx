import { Role, Status } from "@prisma/client"

import { Pending } from "./_components/pending"
import { TeacherLayoutComp } from "./_components/teacher-layout"
import { AppKnockProviders } from "@/providers/knock-provider"
import { WebPushProvider } from "@/providers/web-push-provider"
import { GET_USER } from "@/services/user.service"

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
    const { role, status, userId } = await GET_USER()

    const isTeacher = role === Role.Teacher

    return (
        <WebPushProvider>
            <AppKnockProviders userId={userId}>
                <TeacherLayoutComp>
                    {
                        isTeacher && status === Status.Pending ? <Pending /> : children
                    }
                </TeacherLayoutComp>
            </AppKnockProviders>
        </WebPushProvider>
    )
}

export default TeacherLayout
