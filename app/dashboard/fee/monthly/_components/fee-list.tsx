"use client"

import { Edit, EllipsisVertical, Trash2 } from "lucide-react"
import { MonthlyFee } from "@prisma/client"

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

import { formatString } from "@/lib/utils"
import { useMonthlyFeeDelete, useMonthlyFeeUpdate } from "@/hooks/use-monthly-fee"

interface Props {
    fees: MonthlyFee[]
}

export const FeeList = ({ fees }: Props) => {
    const { onOpen } = useMonthlyFeeUpdate()
    const { onOpen: onOpenDelete } = useMonthlyFeeDelete()

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#SL</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    fees.map((fee, index) => (
                        <TableRow key={fee.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{formatString(fee.class)}</TableCell>
                            <TableCell>{fee.amount}</TableCell>
                            <TableCell className="py-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <EllipsisVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpen(fee, fee.id)}>
                                            <Edit className="w-5 h-5" />
                                            Update
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpenDelete(fee.id)}>
                                            <Trash2 className="w-5 h-5 group-hover:text-rose-600" />
                                            <p className="group-hover:text-rose-600">Delete</p>
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