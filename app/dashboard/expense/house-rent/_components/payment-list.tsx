import { HousePayment } from "@prisma/client"
import { Edit, EllipsisVertical } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

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
    payments: HousePayment[]
}

export const PaymentList = ({ payments }: Props) => {

    if (payments.length === 0) {
        return <EmptyData title="No Payment Found!" />
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Paid At</TableHead>
                    <TableHead>Edited</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    payments.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell className="py-2">{payment.houseName}</TableCell>
                            <TableCell className="py-2">{payment.month}</TableCell>
                            <TableCell className="py-2">{payment.amount}</TableCell>
                            <TableCell className="py-2">{formatString(payment.method || "")}</TableCell>
                            <TableCell className="py-2">{format(payment.createdAt, "dd MMM yyyy")}</TableCell>
                            <TableCell className="py-2">
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
                                            <Link href={`/dashboard/expense/house-rent/edit/${payment.id}`} className="flex items-center gap-x-3">
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