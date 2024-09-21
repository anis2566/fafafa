import { Class, Month, MonthlyPayment, PaymentStatus } from "@prisma/client";
import { CalendarCheck, DollarSign, Edit, HandCoins, NotebookText, OctagonAlert, OctagonX } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

import {
    Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    HoverCard, HoverCardContent, HoverCardTrigger
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

import { cn, formatString } from "@/lib/utils";

export interface PaymentProps {
    payments: {
        name: string;
        studentId: number;
        imageUrl: string;
        payments: MonthlyPayment[];
    }[];
}

const getTotalPaid = (payments: MonthlyPayment[]) =>
    payments.reduce((acc, payment) => acc + (payment.status === PaymentStatus.Paid ? payment.amount : 0), 0);

const getUnpaidMonths = (payments: MonthlyPayment[]) =>
    payments.filter(payment => payment.status === PaymentStatus.Unpaid).length;

const getMonthlyTotal = (payments: PaymentProps["payments"], month: Month) =>
    payments.reduce((total, student) =>
        total + student.payments.filter(p => p.month === month && p.status === PaymentStatus.Paid).reduce((sum, curr) => sum + curr.amount, 0), 0);

export const SalaryList = ({ payments }: PaymentProps) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="bg-slate-100 dark:bg-background/80">#ID</TableHead>
                    <TableHead className="bg-slate-100 dark:bg-background/80">Image</TableHead>
                    <TableHead className="bg-slate-100 dark:bg-background/80">Name</TableHead>
                    {Object.values(Month).map((month, i) => (
                        <TableHead key={i} className="bg-slate-100 dark:bg-background/80">{month}</TableHead>
                    ))}
                    <TableHead className="bg-slate-100 dark:bg-background/80">Total Due</TableHead>
                    <TableHead className="bg-slate-100 dark:bg-background/80">Total Paid</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {payments.map(({ studentId, imageUrl, name, payments }) => (
                    <TableRow key={studentId}>
                        <TableCell className="py-1">{studentId}</TableCell>
                        <TableCell className="py-1">
                            <Avatar>
                                <AvatarImage src={imageUrl} />
                                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </TableCell>
                        <TableCell className="py-1">{name}</TableCell>
                        {Object.values(Month).map((month, index) => {
                            const payment = payments.find(p => p.month === month);
                            return (
                                <TableCell key={index} className="text-center py-1">
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <Badge
                                                className={cn("", payment?.note && "bg-yellow-600")}
                                                variant={payment?.status === PaymentStatus.Paid ? "default" : payment?.status === PaymentStatus.Unpaid ? "destructive" : "outline"}
                                            >
                                                {payment?.status === PaymentStatus.Paid ? payment.amount : payment?.status ?? "-"}
                                            </Badge>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-60">
                                            {payment && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-x-3">
                                                        <DollarSign className="w-5 h-5 text-primary" />
                                                        <span>{payment.amount}</span>
                                                    </div>
                                                    <div className="flex items-center gap-x-3">
                                                        <HandCoins className="w-5 h-5 text-primary" />
                                                        <span>{formatString(payment.method ?? "")}</span>
                                                    </div>
                                                    <div className="flex items-center gap-x-3">
                                                        <CalendarCheck className="w-5 h-5 text-primary" />
                                                        <span>{format(payment.createdAt, "dd MMM yyyy")}</span>
                                                    </div>
                                                    {payment.note && (
                                                        <div className="flex items-center gap-x-3">
                                                            <NotebookText className="w-5 h-5 text-primary" />
                                                            <p>{payment.note}</p>
                                                        </div>
                                                    )}
                                                    <Button variant="outline" asChild>
                                                        <Link href={`/dashboard/salary/monthly/edit/${payment.id}`}>
                                                            <Edit className="w-5 h-5 text-primary" /> Edit
                                                        </Link>
                                                    </Button>
                                                </div>
                                            )}
                                            {payment?.status === PaymentStatus.Unpaid && (
                                                <p>Did not pay for <Badge>{month}</Badge></p>
                                            )}
                                            {payment?.status === PaymentStatus.NA && (
                                                <p>Did not attend <Badge>{month}</Badge></p>
                                            )}
                                        </HoverCardContent>
                                    </HoverCard>
                                </TableCell>
                            );
                        })}
                        <TableCell className="py-1">{getUnpaidMonths(payments)} Months</TableCell>
                        <TableCell className="py-1">{getTotalPaid(payments)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3} className="bg-slate-100 dark:bg-background/80">Total</TableCell>
                    {Object.values(Month).map((month, i) => (
                        <TableCell key={i} className="text-center bg-slate-100 dark:bg-background/80">
                            {getMonthlyTotal(payments, month)}
                        </TableCell>
                    ))}
                    <TableCell className="bg-slate-100 dark:bg-background/80" />
                    <TableCell className="bg-slate-100 dark:bg-background/80">
                        {payments.reduce((acc, student) => acc + getTotalPaid(student.payments), 0)}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
};
