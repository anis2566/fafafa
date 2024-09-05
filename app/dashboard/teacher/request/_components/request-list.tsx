import { Teacher, TeacherRequest, User } from "@prisma/client";

interface RequestWithTeacherAndUser extends TeacherRequest {
    user: User;
    teacher: Teacher
}

interface Props {
    requests: RequestWithTeacherAndUser[]
}

export const RequestList = ({ requests }: Props) => {
    return (
        <div>List</div>
    )
}