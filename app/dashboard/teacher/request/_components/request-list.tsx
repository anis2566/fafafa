"use client"

import { Status, Teacher, TeacherRequest, User } from "@prisma/client";
import { Edit, EllipsisVertical, Trash2 } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";

import { useTeacherRequestDelete, useTeacherStatus } from "@/hooks/use-teacher";

interface RequestWithTeacherAndUser extends TeacherRequest {
    user: User;
    teacher: Teacher
}

interface Props {
    requests: RequestWithTeacherAndUser[]
}

export const RequestList = ({ requests }: Props) => {
    const { onOpen } = useTeacherStatus()
    const { onOpen: onOpenDelete } = useTeacherRequestDelete()

    return (
        <Table>
            <TableHeader>
                <TableHead>User Name</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Teacher Name</TableHead>
                <TableHead>Teacher Id</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
            </TableHeader>
            <TableBody>
                {
                    requests.map(request => (
                        <TableRow key={request.id}>
                            <TableCell className="py-3">{request.user.name}</TableCell>
                            <TableCell className="py-3">
                                <Avatar>
                                    <AvatarImage src={request.user.image || ""} />
                                    <AvatarFallback>{request?.user?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="py-3 hover:underline">
                                <Link href={`/dashboard/teacher/${request.teacher.id}`}>{request.teacher.name}</Link>
                            </TableCell>
                            <TableCell className="py-3">{request.teacher.teacherId}</TableCell>
                            <TableCell className="py-3">
                                <Badge variant={request.status === Status.Active ? "default" : request.status === Status.Suspended ? "destructive" : "outline"}>{request.status}</Badge>
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
                                        <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpen(request.id)}>
                                            <Edit className="w-5 h-5" />
                                            Update Status
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpenDelete(request.id)}>
                                            <Trash2 className="w-5 h-5 group-hover:text-rose-600" />
                                            <p className="group-hover:text-rose-600">Delete</p>
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