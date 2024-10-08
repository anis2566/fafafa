import { Expense } from "@prisma/client"
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

import { formatString } from "@/lib/utils"
import { EmptyData } from "@/components/empty-stat"

interface Props {
    expenses: Expense[]
}

export const ExpenseList = ({ expenses }: Props) => {

    if (expenses.length === 0) {
        return <EmptyData title="No Expense Found!" />
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Edited</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    expenses.map((expense) => (
                        <TableRow key={expense.id}>
                            <TableCell className="py-2">{formatString(expense.type)}</TableCell>
                            <TableCell className="py-2">{expense.amount}</TableCell>
                            <TableCell className="py-2">{expense.month}</TableCell>
                            <TableCell className="py-2">
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        {
                                            expense.note ? (
                                                <Badge className="bg-yellow-600">
                                                    YES
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">N/A</Badge>
                                            )
                                        }
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-60">
                                        <p>{expense.note}</p>
                                    </HoverCardContent>
                                </HoverCard>
                            </TableCell>
                            <TableCell className="py-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <EllipsisVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/dashboard/expense/edit/${expense.id}`} className="flex items-center gap-x-3">
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