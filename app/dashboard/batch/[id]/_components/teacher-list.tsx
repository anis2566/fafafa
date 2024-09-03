import { BatchClass, Teacher } from "@prisma/client";

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
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    classes.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{item.teacher.teacherId}</TableCell>
                            <TableCell>{item.teacher.name}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}