import { LeaveApp, LeaveStatus } from "@prisma/client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface LeaveWithClasses extends LeaveApp {
    classes: { id: string }[]
}

interface Props {
    leaves: LeaveWithClasses[]
}

export const LeaveList = ({ leaves }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#SL</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>No of Class</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    leaves?.map((leave, i) => (
                        <TableRow key={leave.id}>
                            <TableCell className="py-3">{i + 1}</TableCell>
                            <TableCell className="py-3">{leave.days[0]} - {leave.days[leave.days.length - 1]}</TableCell>
                            <TableCell className="py-3">{leave.classes.length}</TableCell>
                            <TableCell className="py-3">
                                <Badge variant={leave.status === LeaveStatus.Approved ? "default" : leave.status === LeaveStatus.Rejected ? "destructive" : "outline"}>
                                    {leave.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}