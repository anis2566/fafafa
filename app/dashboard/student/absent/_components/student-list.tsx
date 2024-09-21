import { Student } from "@prisma/client"
import { EllipsisVertical, Eye } from "lucide-react";
import Link from "next/link";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatString } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

import { EmptyData } from "@/components/empty-stat";

interface StudentWithProp extends Student {
    payments: { id: string }[]
}

interface Props {
    students: StudentWithProp[]
}

export const StudentList = ({ students }: Props) => {
    if (students.length === 0) {
        return <EmptyData title="No Student Found!" />
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>F. Phone</TableHead>
                    <TableHead>M. Phone</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    students.map(student => (
                        <TableRow key={student.id}>
                            <TableCell className="py-1">{student.studentId}</TableCell>
                            <TableCell className="py-1">
                                <Avatar>
                                    <AvatarImage src={student.imageUrl} />
                                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="py-1 hover:underline">
                                <Link href={`/dashboard/student/${student.id}`}>{student.name}</Link>
                            </TableCell>
                            <TableCell className="py-1">{formatString(student.class)}</TableCell>
                            <TableCell className="py-1">{student.fPhone}</TableCell>
                            <TableCell className="py-1">{student.mPhone}</TableCell>
                            <TableCell className="py-1">{student.payments.length > 0 ? `${student.payments.length} Months` : "Paid"}</TableCell>
                            <TableCell className="py-1">
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <Badge className="text-white dark:text-white/80">
                                            {student.leftReason?.substring(0, 15)}...
                                        </Badge>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-60">
                                        {student.leftReason}
                                    </HoverCardContent>
                                </HoverCard>
                            </TableCell>
                            <TableCell className="py-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <EllipsisVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/dashboard/student/${student.id}`} className="flex items-center gap-x-3">
                                                <Eye className="w-5 h-5" />
                                                View
                                            </Link>
                                        </DropdownMenuItem>

                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}