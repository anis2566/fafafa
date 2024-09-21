import { TeacherAdvance, TransactionStatus } from "@prisma/client"
import { format } from "date-fns"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { EmptyData } from "@/components/empty-stat"

interface Props {
    advances: TeacherAdvance[]
}

export const AdvanceList = ({ advances }: Props) => {

    if(advances.length === 0) {
        return <EmptyData title="No Advance Found!" />
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    advances.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className="py-3">{format(item.createdAt, "dd MMM yyyy")}</TableCell>
                            <TableCell className="py-3">{item.month}</TableCell>
                            <TableCell className="py-3">{item.amount}</TableCell>
                            <TableCell className="py-3">
                                <Badge variant={item.status === TransactionStatus.Reject ? "destructive" : "default"}>{item.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}