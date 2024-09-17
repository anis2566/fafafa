import { Month } from "@prisma/client"

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface Props {
    data: {
        name: string,
        months: { month: Month, amount: number }[]
    }[]
}

export const IncomeList = ({ data }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">Expense Type</TableHead>
                    {
                        Object.values(Month).map((month, i) => (
                            <TableHead key={i} className="text-center">{month}</TableHead>
                        ))
                    }
                    <TableHead>Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="text-center">{item.name}</TableCell>
                            {
                                Object.values(Month).map((month, i) => {
                                    const monthData = item.months.find(m => m.month === month);
                                    return (
                                        <TableCell key={i} className="text-center">
                                            {monthData ? monthData.amount : 0}
                                        </TableCell>
                                    );
                                })
                            }
                            <TableCell className="font-semibold">
                                {item.months.reduce((total, m) => total + m.amount, 0)}
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell className="text-center font-semibold">Total</TableCell>
                    {
                        Object.values(Month).map((month, i) => {
                            const totalAmountForMonth = data.reduce((total, item) => {
                                const monthData = item.months.find(m => m.month === month);
                                return total + (monthData ? monthData.amount : 0);
                            }, 0);
                            return (
                                <TableCell key={i} className="text-center font-semibold">
                                    {totalAmountForMonth}
                                </TableCell>
                            );
                        })
                    }
                    <TableCell></TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}