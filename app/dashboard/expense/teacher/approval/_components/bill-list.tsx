"use client"

import { Teacher, TeacherFee, TeacherPayment, TeacherPaymentStatus } from "@prisma/client"
import Link from "next/link"
import { EllipsisVertical, RefreshCcw } from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import { EmptyData } from "@/components/empty-stat"
import { useTeacherBill } from "@/hooks/use-teacher-bill"

interface TeacherWithFee extends Teacher {
    fee: TeacherFee | null
}

interface PaymentWithTeacher extends TeacherPayment {
    teacher: TeacherWithFee
}

interface Props {
    payments: PaymentWithTeacher[]
}

export const BillList = ({ payments }: Props) => {
    const {onOpen} = useTeacherBill()

    if (payments.length === 0) {
        return <EmptyData title="No Bill Found!" />
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Per Class</TableHead>
                    <TableHead>Class Unit</TableHead>
                    <TableHead>Incentive</TableHead>
                    <TableHead>Deduction Unit</TableHead>
                    <TableHead>Deduction</TableHead>
                    <TableHead>Advance Paid</TableHead>
                    <TableHead>Net Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    payments.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell className="py-2">{payment.teacher.teacherId}</TableCell>
                            <TableCell className="py-2 hover:underline">
                                <Link href={`/dashboard/teacher/${payment.teacher.id}`}>{payment.teacher.name}</Link>
                            </TableCell>
                            <TableCell className="py-2">{payment.month}</TableCell>
                            <TableCell className="py-2">{payment.teacher.fee?.perClass}</TableCell>
                            <TableCell className="py-2">{payment.classUnit}</TableCell>
                            <TableCell className="py-2">{payment.incentive}</TableCell>
                            <TableCell className="py-2">{payment.deductionUnit}</TableCell>
                            <TableCell className="py-2">{payment.deduction}</TableCell>
                            <TableCell className="py-2">{payment.advance}</TableCell>
                            <TableCell className="py-2">{payment.amount}</TableCell>
                            <TableCell className="py-2">
                                <Badge className={cn(
                                    "text-white",
                                    payment.status === TeacherPaymentStatus.Pending && "bg-indigo-500",
                                    payment.status === TeacherPaymentStatus.Dismiss && "bg-amber-500",
                                    payment.status === TeacherPaymentStatus.Approve && "bg-green-500",
                                    payment.status === TeacherPaymentStatus.Reject && "bg-rose-500",
                                )}>{payment.status}</Badge>
                            </TableCell>
                            <TableCell className="py-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={payment.status === TeacherPaymentStatus.Dismiss || payment.status === TeacherPaymentStatus.Approve}>
                                            <span className="sr-only">Open menu</span>
                                            <EllipsisVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpen(payment.id)}>
                                            <RefreshCcw className="w-5 h-5" />
                                            Change Status
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}