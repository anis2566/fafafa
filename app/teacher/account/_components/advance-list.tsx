import { TeacherAdvance } from "@prisma/client"
import { format } from "date-fns"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface Props {
    advances: TeacherAdvance[]
}

export const AdvanceList = ({ advances }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    advances.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{format(item.createdAt, "dd MMM yyyy")}</TableCell>
                            <TableCell>{item.month}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}