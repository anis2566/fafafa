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
                            <TableCell className="py-3">{format(item.createdAt, "dd MMM yyyy")}</TableCell>
                            <TableCell className="py-3">{item.month}</TableCell>
                            <TableCell className="py-3">{item.amount}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}