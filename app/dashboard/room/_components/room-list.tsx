import { Batch, House, Room } from "@prisma/client"

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
import { EmptyData } from "@/components/empty-stat"

interface RoomWithBatch extends Room {
    batches: Batch[];
    house: House;
}

interface Props {
    rooms: RoomWithBatch[]
}

export const RoomList = ({ rooms }: Props) => {

    if (rooms.length === 0) {
        return <EmptyData title="No Room Found!" />
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Room Name</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>House</TableHead>
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
                            <TableCell className="py-0">{room.name}</TableCell>
                            <TableCell className="py-0">{room.capacity}</TableCell>
                            <TableCell className="py-0">{room.house.name}</TableCell>
                            <TableCell className="py-0">
                                <TableCell key={index} className="text-center">
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <Badge>
                                                {(room.availableTime.length - room.bookTime.length) / 2} Hours
                                            </Badge>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-60">
                                            {
                                                room.availableTime.filter(time => room.bookTime.includes(time)).length !== 0 ? (
                                                    <p className="italic text-muted-foreground text-center">No available time!</p>
                                                ) : (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {
                                                            room.availableTime.map(time => (
                                                                <Badge variant="outline" key={time} className="flex justify-center bg-slate-500 text-white">{time}</Badge>
                                                            ))
                                                        }
                                                    </div>
                                                )
                                            }
                                        </HoverCardContent>
                                    </HoverCard>
                                </TableCell>
                            </TableCell>
                            <TableCell className="py-0">
                                <TableCell key={index} className="text-center">
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <Badge variant="destructive">
                                                {(room.bookTime.length) / 2} Hours
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
                            <TableCell className="py-1">{room.batches.length}</TableCell>
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