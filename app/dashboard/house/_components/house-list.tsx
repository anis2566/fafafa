"use client"

import { House, HouseStatus } from "@prisma/client"
import { Edit, EllipsisVertical, Trash2 } from "lucide-react"
import Link from "next/link"

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

import { useHouse } from "@/hooks/use-house"
import { EmptyData } from "@/components/empty-stat"

interface HouseWithRooms extends House {
    rooms: { id: string }[]
}

interface Props {
    houses: HouseWithRooms[]
}

export const HouseList = ({ houses }: Props) => {
    const { onOpen } = useHouse()

    if (houses.length === 0) {
        return <EmptyData title="No House Found!" />
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>House Name</TableHead>
                    <TableHead>No of Room</TableHead>
                    <TableHead>Room Booked</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    houses.map((house) => (
                        <TableRow key={house.id}>
                            <TableCell className="py-2">{house.name}</TableCell>
                            <TableCell className="py-2">{house.roomCount}</TableCell>
                            <TableCell className="py-2">{house.rooms.length}</TableCell>
                            <TableCell className="py-2">
                                <Badge variant={house.status === HouseStatus.Deactive ? "destructive" : "default"}>{house.status}</Badge>
                            </TableCell>
                            <TableCell className="py-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <EllipsisVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/dashboard/house/edit/${house.id}`} className="flex items-center gap-x-3">
                                                <Edit className="w-5 h-5" />
                                                Update
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpen(house.id)}>
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