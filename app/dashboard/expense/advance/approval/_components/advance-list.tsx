"use client"

import { Teacher, TeacherAdvance, TransactionStatus } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { EllipsisVertical, RefreshCcw } from "lucide-react";

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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { EmptyData } from "@/components/empty-stat";
import { cn } from "@/lib/utils";
import { useAdvance } from "@/hooks/use-advance";

interface AdvanceWithTeacher extends TeacherAdvance {
    teacher: Teacher;
}

interface Props {
    advances: AdvanceWithTeacher[]
}

export const AdvanceList = ({ advances }: Props) => {
    const {onOpen} = useAdvance()

    if (advances.length === 0) {
        return <EmptyData title="No Request Found!" />
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
                    <TableHead>Action</TableHead>
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
                            <TableCell className="py-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={advance.status === TransactionStatus.Approve}>
                                            <span className="sr-only">Open menu</span>
                                            <EllipsisVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpen(advance.id)}>
                                            <RefreshCcw className="w-5 h-5" />
                                            Change Status
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