import { Month } from "@prisma/client";

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface MonthData {
    month: Month;
    amount: number;
}

interface IncomeItem {
    name: string;
    months: MonthData[];
}

interface Props {
    data: IncomeItem[];
}

const getTotalForMonth = (data: IncomeItem[], month: Month): number =>
    data.reduce((total, item) => {
        const monthData = item.months.find(m => m.month === month);
        return total + (monthData?.amount ?? 0);
    }, 0);

const getGrandTotal = (data: IncomeItem[]): number =>
    data.reduce((total, item) =>
        total + item.months.reduce((sum, m) => sum + m.amount, 0), 0);

export const IncomeList = ({ data }: Props) => {
    const grandTotal = getGrandTotal(data);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="bg-slate-100 dark:bg-background/60">Income Type</TableHead>
                    {Object.values(Month).map((month, i) => (
                        <TableHead key={i} className="text-center bg-slate-100 dark:bg-background/60">
                            {month}
                        </TableHead>
                    ))}
                    <TableHead className="bg-slate-100 dark:bg-background/60">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={index} className="py-3">
                        <TableCell className="py-3">{item.name}</TableCell>
                        {Object.values(Month).map((month, i) => {
                            const monthData = item.months.find(m => m.month === month);
                            return (
                                <TableCell key={i} className="text-center py-3">
                                    {monthData?.amount ?? 0}
                                </TableCell>
                            );
                        })}
                        <TableCell className="font-semibold py-3">
                            {item.months.reduce((total, m) => total + m.amount, 0)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell className="font-semibold bg-slate-100 dark:bg-background/60">Total</TableCell>
                    {Object.values(Month).map((month, i) => (
                        <TableCell key={i} className="text-center font-semibold bg-slate-100 dark:bg-background/60">
                            {getTotalForMonth(data, month)}
                        </TableCell>
                    ))}
                    <TableCell className="font-semibold text-center bg-slate-100 dark:bg-background/60">
                        {grandTotal}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
};
