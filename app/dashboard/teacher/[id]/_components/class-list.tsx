import { Batch, BatchClass, Subject } from "@prisma/client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { adjustTime } from "@/lib/utils";

interface ClassWithSubjectAndBatch extends BatchClass {
    subject: Subject;
    batch: Batch
}

interface Props {
    classes: ClassWithSubjectAndBatch[]
}

export const ClassList = ({ classes }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Batch</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    classes.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{adjustTime(item.time[0])} - {item.time[item.time.length - 1]}</TableCell>
                            <TableCell>
                                {
                                    item.day.map((day, i) => (
                                        <p key={i}>{day}</p>
                                    ))
                                }
                            </TableCell>
                            <TableCell>{item.subject.name}</TableCell>
                            <TableCell>{item.batch.name}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}