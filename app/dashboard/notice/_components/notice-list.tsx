"use client"

import { Notice } from "@prisma/client"
import { format } from "date-fns"
import { EllipsisVertical, Trash2 } from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { useNotice } from "@/hooks/use-notice"
import { EmptyData } from "@/components/empty-stat"

interface Props {
    notices: Notice[]
}

export const NoticeList = ({ notices }: Props) => {
    const { onOpen } = useNotice()

    if(notices.length === 0) {
        return <EmptyData title="No Notice Found!" />
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Notice</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    notices.map((notice) => (
                        <TableRow key={notice.id}>
                            <TableCell className="py-2 truncate">{notice.text}</TableCell>
                            <TableCell className="py-2">
                                <Badge>{notice.type}</Badge>
                            </TableCell>
                            <TableCell className="py-2">{format(notice.createdAt, "dd MMM yyyy")}</TableCell>
                            <TableCell className="py-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <EllipsisVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpen(notice.id)}>
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