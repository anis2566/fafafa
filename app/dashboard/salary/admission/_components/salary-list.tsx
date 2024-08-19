"use client"

import { format } from "date-fns";
import { Edit, EllipsisVertical } from "lucide-react";
import { AdmissionPayment, PaymentStatus, Student } from "@prisma/client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { cn, formatString } from "@/lib/utils";
import { useAddmission } from "@/hooks/use-admission";

interface AdmissionWithStudent extends AdmissionPayment {
    student: Student
}

interface Props {
    payments: AdmissionWithStudent[]
}

export const SalaryList = ({ payments }: Props) => {
    const {onOpen} = useAddmission()

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    payments.map(item => (
                        <TableRow key={item.studentId}>
                            <TableCell>{item.student.studentId}</TableCell>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={item.student.imageUrl} />
                                    <AvatarFallback>{item.student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>{item.student.name}</TableCell>
                            <TableCell>{formatString(item.student.class)}</TableCell>
                            <TableCell>{format(item.createdAt, "dd MMM yyyy")}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>
                                <Badge>{formatString(item.method)}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className={cn(
                                        "text-white",
                                        item.status === PaymentStatus.Unpaid && "bg-rose-500",
                                    )}
                                >
                                    {item.status}
                                </Badge>
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
                                        <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpen(item.id, item)}>
                                            <Edit className="w-5 h-5" />
                                            Update
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