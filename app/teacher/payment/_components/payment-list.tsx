import { Teacher, TeacherFee, TeacherPayment, TeacherPaymentStatus } from "@prisma/client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { cn } from "@/lib/utils"

interface TeacherWithFee extends Teacher {
    fee: TeacherFee | null
}

interface PaymentWithTeacher extends TeacherPayment {
    teacher: TeacherWithFee
}

interface Props {
    payments: PaymentWithTeacher[]
}

export const PaymentList = ({ payments }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Per Class</TableHead>
                    <TableHead>Class Unit</TableHead>
                    <TableHead>Incentive</TableHead>
                    <TableHead>Deduction Unit</TableHead>
                    <TableHead>Deduction</TableHead>
                    <TableHead>Advance Paid</TableHead>
                    <TableHead>Net Total</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    payments.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell className="py-3">{payment.month}</TableCell>
                            <TableCell className="py-3">{payment.teacher.fee?.perClass}</TableCell>
                            <TableCell className="py-3">{payment.classUnit}</TableCell>
                            <TableCell className="py-3">{payment.incentive ?? 0}</TableCell>
                            <TableCell className="py-3">{payment.deductionUnit ?? 0}</TableCell>
                            <TableCell className="py-3">{payment.deduction}</TableCell>
                            <TableCell className="py-3">{payment.advance}</TableCell>
                            <TableCell className="py-3">{payment.amount}</TableCell>
                            <TableCell className="py-3">
                                <Badge className={cn(
                                    "text-white",
                                    payment.status === TeacherPaymentStatus.Pending && "bg-indigo-500",
                                    payment.status === TeacherPaymentStatus.Dismiss && "bg-amber-500",
                                    payment.status === TeacherPaymentStatus.Approve && "bg-green-500",
                                    payment.status === TeacherPaymentStatus.Reject && "bg-rose-500",
                                )}>{payment.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}