import { Income } from "@prisma/client"
import { Edit, EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

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
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface Props {
    incomes: Income[]
}

export const IncomeList = ({ incomes }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Edited</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    incomes.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className="py-2">{item.name}</TableCell>
                            <TableCell className="py-2">{item.amount}</TableCell>
                            <TableCell className="py-2">{item.month}</TableCell>
                            <TableCell className="py-2">{format(item.createdAt, "dd MMM yyyy")}</TableCell>
                            <TableCell className="py-2">
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        {
                                            item.note ? (
                                                <Badge className="bg-yellow-600">
                                                    YES
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">N/A</Badge>
                                            )
                                        }
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-60">
                                        <p>{item.note}</p>
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
                                            <Link href={`/dashboard/income/others/edit/${item.id}`} className="flex items-center gap-x-3">
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