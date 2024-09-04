import { Teacher, TeacherAdvance } from "@prisma/client";
import { format } from "date-fns";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AdvanceWithTeacher extends TeacherAdvance {
    teacher: Teacher;
}

interface Props {
    advances: AdvanceWithTeacher[]
}

export const AdvanceList = ({ advances }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    advances.map((advance) => (
                        <TableRow key={advance.id}>
                            <TableCell className="py-3">{advance.teacher.teacherId}</TableCell>
                            <TableCell className="py-3">
                                <Avatar>
                                    <AvatarImage src={advance.teacher.imageUrl} />
                                    <AvatarFallback>{advance.teacher.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="py-3">{advance.teacher.name}</TableCell>
                            <TableCell className="py-3">{format(advance.createdAt, "dd MMM yyyy")}</TableCell>
                            <TableCell className="py-3">{advance.month}</TableCell>
                            <TableCell className="py-3">{advance.amount}</TableCell>
                            <TableCell className="py-3">
                                <Badge>{advance.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}