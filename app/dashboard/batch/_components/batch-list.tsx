import { Batch, Room } from "@prisma/client"

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

// import { Action } from "./action"

interface Props {
    batches: Batch[]
}

export const BatchList = ({ batches }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Batch Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    batches.map((batch, index) => (
                        <TableRow key={batch.id}>
                            <TableCell className="py-1">{batch.name}</TableCell>
                            <TableCell className="py-1">{batch.class}</TableCell>
                            <TableCell className="py-1">{batch.capacity}</TableCell>
                            <TableCell className="py-1">{batch.time[0]} - {batch.time[batch.time.length - 1]}</TableCell>
                            {/* <TableCell className="py-1">
                                <TableCell key={index} className="text-center">
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <Badge>
                                                {(batch.availableTime.length - batch.bookTime.length) / 2} Unit
                                            </Badge>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-60">
                                            <div className="grid grid-cols-2 gap-2">
                                                {
                                                    batch.availableTime.map(time => (
                                                        <Badge variant="outline" key={time} className="flex justify-center bg-slate-500 text-white">{time}</Badge>
                                                    ))
                                                }
                                            </div>
                                            {
                                                batch.availableTime.length === 0 && (
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
                                                {(batch.bookTime.length) / 2} Unit
                                            </Badge>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-60">
                                            <div className="grid grid-cols-2 gap-2">
                                                {
                                                    batch.bookTime.map(time => (
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
                            </TableCell> */}
                            <TableCell className="py-1">{3}</TableCell>
                            <TableCell className="py-1">
                                {/* <Action id={room.id} /> */}
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}