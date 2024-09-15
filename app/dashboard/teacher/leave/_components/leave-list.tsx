"use client"

import { LeaveApp, LeaveClass, LeaveStatus, Teacher } from "@prisma/client"
import Link from "next/link";
import { EllipsisVertical, Eye, RefreshCcw } from "lucide-react";
import { format } from "date-fns";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";

import { useLeaveClassStatus } from "@/hooks/use-leave-class";

interface LeaveWithTeacherAndClass extends LeaveApp {
    teacher: Teacher;
    classes: LeaveClass[]
}

interface Props {
    leaves: LeaveWithTeacherAndClass[]
}

export const LeaveList = ({ leaves }: Props) => {
    const { onOpen } = useLeaveClassStatus()

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Total Class</TableHead>
                    <TableHead>Assigned Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    leaves?.map(leave => (
                        <TableRow key={leave.id}>
                            <TableCell className="py-3">{leave.teacher.teacherId}</TableCell>
                            <TableCell className="py-3">
                                <Avatar>
                                    <AvatarImage src={leave.teacher.imageUrl} />
                                    <AvatarFallback>{leave.teacher.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="py-3 hover:underline">
                                <Link href={`/dashboard/teacher/${leave.teacherId}`}>{leave.teacher.name}</Link>
                            </TableCell>
                            <TableCell className="py-3">{format(leave.dates[0], "dd MMM yyyy")} {leave.dates.length > 1 && "-" + format(leave.dates[leave.dates.length - 1], "dd MMM yyyy")}</TableCell>
                            <TableCell className="py-3">{leave.days[0]} {leave.days.length > 1 && "-" + leave.days[leave.days.length - 1]}</TableCell>
                            <TableCell className="py-3">{leave.classes.length}</TableCell>
                            <TableCell className="py-3">{leave.classes.filter(item => item.teacherId !== null).length}</TableCell>
                            <TableCell className="py-3">
                                <Badge variant={leave.status === LeaveStatus.Approved ? "default" : leave.status === LeaveStatus.Rejected ? "destructive" : "secondary"}>{leave.status}</Badge>
                            </TableCell>
                            <TableCell className="py-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <EllipsisVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/dashboard/teacher/leave/${leave.id}`} className="flex items-center gap-x-3">
                                                <Eye className="w-5 h-5" />
                                                View
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpen(leave.id)}>
                                            <RefreshCcw className="w-5 h-5" />
                                            Update Status
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