import { Teacher, TeacherFee, TeacherPayment } from "@prisma/client"
import { Edit, EllipsisVertical } from "lucide-react"
import Link from "next/link"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

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
                    <TableHead>#ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Per Class</TableHead>
                    <TableHead>Class Unit</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Deduction Unit</TableHead>
                    <TableHead>Deduction</TableHead>
                    <TableHead>Incentive</TableHead>
                    <TableHead>Net Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Edited</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    payments.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell className="py-3">{payment.teacher.teacherId}</TableCell>
                            <TableCell className="py-3">{payment.teacher.name}</TableCell>
                            <TableCell className="py-3">{payment.month}</TableCell>
                            <TableCell className="py-3">{payment.teacher.fee?.perClass}</TableCell>
                            <TableCell className="py-3">{payment.classUnit}</TableCell>
                            <TableCell className="py-3">{payment.classUnit * (payment.teacher.fee?.perClass ?? 0)}</TableCell>
                            <TableCell className="py-3">{payment.deductionUnit}</TableCell>
                            <TableCell className="py-3">{(payment.deductionUnit ?? 0) * (payment.teacher.fee?.perClass ?? 0)}</TableCell>
                            <TableCell className="py-3">{payment.incentive}</TableCell>
                            <TableCell className="py-3">{payment.amount}</TableCell>
                            <TableCell className="py-3">{payment.status}</TableCell>
                            <TableCell className="py-3">
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        {
                                            payment.note ? (
                                                <Badge className="bg-yellow-600">
                                                    YES
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">N/A</Badge>
                                            )
                                        }
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-60">
                                        <p>{payment.note}</p>
                                    </HoverCardContent>
                                </HoverCard>
                            </TableCell>
                            <TableCell className="py-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <EllipsisVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/dashboard/expense/teacher/edit/${payment.id}`} className="flex items-center gap-x-3">
                                                <Edit className="w-5 h-5" />
                                                Update
                                            </Link>
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