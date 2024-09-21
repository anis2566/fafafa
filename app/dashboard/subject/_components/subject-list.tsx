"use client"

import { Subject } from "@prisma/client"
import { Edit, EllipsisVertical, Trash2 } from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { formatString } from "@/lib/utils"
import { useDeleteSubject, useUpdateSubject } from "@/hooks/use-subject"
import { EmptyData } from "@/components/empty-stat"

interface Props {
    subjects: Subject[]
}

export const SubjectList = ({ subjects }: Props) => {
    const { onOpen } = useUpdateSubject()
    const { onOpen: onOpenDelete } = useDeleteSubject()

    if(subjects.length === 0) {
        return <EmptyData title="No Subject Found!" />
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    subjects.map((subject) => (
                        <TableRow key={subject.id}>
                            <TableCell className="py-1">{subject.name}</TableCell>
                            <TableCell className="py-1">{formatString(subject.class)}</TableCell>
                            <TableCell className="py-1">{formatString(subject.level)}</TableCell>
                            <TableCell className="py-1">{formatString(subject.group ? subject.group : "-")}</TableCell>
                            <TableCell className="py-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <EllipsisVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpen(subject.id, subject)}>
                                            <Edit className="w-5 h-5" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpenDelete(subject.id)}>
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