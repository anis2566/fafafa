import { BatchClass, Subject, Teacher } from "@prisma/client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface BatchClassWithTeacherAndSubject extends BatchClass {
    teacher: Teacher;
    subject: Subject
}

interface Props {
    classes: BatchClassWithTeacherAndSubject[]
}


export const TeacherList = ({ classes }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    classes.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{item.teacher.teacherId}</TableCell>
                            <TableCell>{item.teacher.name}</TableCell>
                            <TableCell>{item.subject.name}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}