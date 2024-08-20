import { Batch, Room } from "@prisma/client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { adjustTime } from "@/lib/utils"
import { Action } from "./action"

interface BatchWithRoomAndStudent extends Batch {
    room: Room;
    students: {id: string}[]
}

interface Props {
    batches: BatchWithRoomAndStudent[]
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
                            <TableCell className="py-3">{batch.name}</TableCell>
                            <TableCell className="py-3">{batch.class}</TableCell>
                            <TableCell className="py-3">{batch.capacity}</TableCell>
                            <TableCell className="py-3">{adjustTime(batch.time[0])} - {batch.time[batch.time.length - 1]}</TableCell>
                            <TableCell className="py-3">{batch.room.name}</TableCell>
                            <TableCell className="py-3">{batch.students.length}</TableCell>
                            <TableCell className="py-3">
                                <Action id={batch.id} />
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}