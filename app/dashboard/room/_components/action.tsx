"use client"

import { Edit, EllipsisVertical, Trash2 } from "lucide-react"
import Link from "next/link";

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useRoom } from "@/hooks/use-room";


interface Props {
    id: string;
}

export const Action = ({ id }: Props) => {
    const { onOpen } = useRoom()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <EllipsisVertical className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/dashboard/room/edit/${id}`} className="flex items-center gap-x-3">
                        <Edit className="w-5 h-5" />
                        Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpen(id)}>
                    <Trash2 className="w-5 h-5 group-hover:text-rose-600" />
                    <p className="group-hover:text-rose-600">Delete</p>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}