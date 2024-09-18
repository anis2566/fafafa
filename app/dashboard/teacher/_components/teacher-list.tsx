import { Status, Teacher } from "@prisma/client";
import { Edit, EllipsisVertical, Eye } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";

import { EmptyData } from "@/components/empty-stat";

interface Props {
    teachers: Teacher[]
}

export const TeacherList = ({ teachers }: Props) => {

    if (teachers.length === 0) {
        return <EmptyData title="No Teacher Found" />
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    teachers.map(teacher => (
                        <TableRow key={teacher.id}>
                            <TableCell className="py-3">{teacher.teacherId}</TableCell>
                            <TableCell className="py-3">
                                <Avatar>
                                    <AvatarImage src={teacher.imageUrl} />
                                    <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="py-3 hover:underline">
                                <Link href={`/dashboard/teacher/${teacher.id}`}>{teacher.name}</Link>
                            </TableCell>
                            <TableCell className="py-3">{teacher.phone}</TableCell>
                            <TableCell className="py-3">
                                <Badge variant={teacher.status === Status.Active ? "default" : teacher.status === Status.Suspended ? "destructive" : "secondary"}>{teacher.status}</Badge>
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
                                            <Link href={`/dashboard/teacher/${teacher.id}`} className="flex items-center gap-x-3">
                                                <Eye className="w-5 h-5" />
                                                View
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/dashboard/teacher/edit/${teacher.id}`} className="flex items-center gap-x-3">
                                                <Edit className="w-5 h-5" />
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        {/* <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpenDelete(fee.id)}>
                                            <Trash2 className="w-5 h-5 group-hover:text-rose-600" />
                                            <p className="group-hover:text-rose-600">Delete</p>
                                        </DropdownMenuItem> */}
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