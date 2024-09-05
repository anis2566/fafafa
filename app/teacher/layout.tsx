import { Status } from "@prisma/client"

import { auth } from "@/auth"
import { Pending } from "./_components/pending"
import { TeacherLayoutComp } from "./_components/teacher-layout"

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth()

    return (
        <div>
            <TeacherLayoutComp>
                {
                    session?.status === Status.Pending ? <Pending /> : children
                }
            </TeacherLayoutComp>
        </div>
    )
}

export default TeacherLayout
