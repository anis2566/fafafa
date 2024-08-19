import { Room } from "@prisma/client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"

import { Action } from "./action"

interface Props {
    rooms: Room[]
}

export const RoomList = ({ rooms }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Room Name</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Available Times</TableHead>
                    <TableHead>Book Times</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    rooms.map((room, index) => (
                        <TableRow key={room.id}>
                            <TableCell className="py-1">{room.name}</TableCell>
                            <TableCell className="py-1">{room.capacity}</TableCell>
                            <TableCell className="py-1">
                                <TableCell key={index} className="text-center">
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <Badge>
                                                {(room.availableTime.length - room.bookTime.length) / 2} Unit
                                            </Badge>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-60">
                                            <div className="grid grid-cols-2 gap-2">
                                                {
                                                    room.availableTime.map(time => (
                                                        <Badge variant="outline" key={time} className="flex justify-center bg-slate-500 text-white">{time}</Badge>
                                                    ))
                                                }
                                            </div>
                                            {
                                                room.availableTime.length === 0 && (
                                                    <p className="italic text-muted-foreground text-center">No available time!</p>
                                                )
                                            }
                                        </HoverCardContent>
                                    </HoverCard>
                                </TableCell>
                            </TableCell>
                            <TableCell className="py-1">
                                <TableCell key={index} className="text-center">
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <Badge variant="destructive">
                                                {(room.bookTime.length) / 2} Unit
                                            </Badge>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-60">
                                            <div className="grid grid-cols-2 gap-2">
                                                {
                                                    room.bookTime.map(time => (
                                                        <Badge variant="outline" key={time} className="flex justify-center bg-rose-500 text-white">{time}</Badge>
                                                    ))
                                                }
                                            </div>
                                            {
                                                room.bookTime.length === 0 && (
                                                    <p className="italic text-muted-foreground text-center">No book time!</p>
                                                )
                                            }
                                        </HoverCardContent>
                                    </HoverCard>
                                </TableCell>
                            </TableCell>
                            <TableCell className="py-1">{3}</TableCell>
                            <TableCell className="py-1">
                                <Action id={room.id} />
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}