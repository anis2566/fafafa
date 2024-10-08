import { Teacher, TeacherAdvance, TransactionStatus } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";

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

import { EmptyData } from "@/components/empty-stat";
import { cn } from "@/lib/utils";

interface AdvanceWithTeacher extends TeacherAdvance {
    teacher: Teacher;
}

interface Props {
    advances: AdvanceWithTeacher[]
}

export const AdvanceList = ({ advances }: Props) => {

    if (advances.length === 0) {
        return <EmptyData title="No Advance Found!" />
    }

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
                            <TableCell className="py-1">{advance.teacher.teacherId}</TableCell>
                            <TableCell className="py-1">
                                <Avatar>
                                    <AvatarImage src={advance.teacher.imageUrl} />
                                    <AvatarFallback>{advance.teacher.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="py-1 hover:underline">
                                <Link href={`/dashboard/teacher/${advance.teacher.id}`}>{advance.teacher.name}</Link>
                            </TableCell>
                            <TableCell className="py-1">{format(advance.createdAt, "dd MMM yyyy")}</TableCell>
                            <TableCell className="py-1">{advance.month}</TableCell>
                            <TableCell className="py-1">{advance.amount}</TableCell>
                            <TableCell className="py-3">
                                <Badge className={cn(
                                    "text-white",
                                    advance.status === TransactionStatus.Pending && "bg-indigo-500",
                                    advance.status === TransactionStatus.Approve && "bg-green-500",
                                    advance.status === TransactionStatus.Reject && "bg-rose-500",
                                )}>{advance.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}