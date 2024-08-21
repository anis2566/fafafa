import { Subject, TeacherSubject } from "@prisma/client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { formatString } from "@/lib/utils";

interface SubjectWithTeacherSubject extends TeacherSubject {
    subject: Subject;
}

interface Props {
    subjects: SubjectWithTeacherSubject[]
}

export const SubjectList = ({ subjects }: Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Subject List</CardTitle>
                <CardDescription>A collection of subject.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Group</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            subjects.map((item) => (
                                <TableRow key={item.subject.id}>
                                    <TableCell>{item.subject.name}</TableCell>
                                    <TableCell>{formatString(item.subject.class)}</TableCell>
                                    <TableCell>{formatString(item.subject.level)}</TableCell>
                                    <TableCell>{formatString(item.subject.group ? item.subject.group : "-")}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}