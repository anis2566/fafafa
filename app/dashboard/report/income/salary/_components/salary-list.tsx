import { Class, Month, MonthlyPayment, PaymentStatus } from "@prisma/client";
import { CalendarCheck, DollarSign, Edit, HandCoins, NotebookText, OctagonAlert, OctagonX } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button";

import { cn, formatString } from "@/lib/utils";

export interface PaymentProps {
    payments: {
        name: string;
        studentId: number;
        imageUrl: string;
        payments: MonthlyPayment[]
    }[]
}

export const SalaryList = ({ payments }: PaymentProps) => {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="bg-slate-100 dark:bg-background/60">#ID</TableHead>
                        <TableHead className="bg-slate-100 dark:bg-background/60">Image</TableHead>
                        <TableHead className="bg-slate-100 dark:bg-background/60">Name</TableHead>
                        {
                            Object.values(Month).map((month, i) => (
                                <TableHead key={i} className="bg-slate-100 dark:bg-background/60">{month}</TableHead>
                            ))
                        }
                        <TableHead className="bg-slate-100 dark:bg-background/60">Total Due</TableHead>
                        <TableHead className="bg-slate-100 dark:bg-background/60">Total Paid</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        payments.map(item => (
                            <TableRow key={item.studentId}>
                                <TableCell className="py-1">{item.studentId}</TableCell>
                                <TableCell className="py-1">
                                    <Avatar>
                                        <AvatarImage src={item.imageUrl} />
                                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-1">{item.name}</TableCell>
                                {
                                    Object.values(Month).map((month, index) => {
                                        const payment = item.payments.find(p => p.month === month);
                                        return (
                                            <TableCell key={index} className="text-center py-1">
                                                <HoverCard>
                                                    <HoverCardTrigger asChild>
                                                        <Badge className={cn("", payment?.note && "bg-yellow-600 hover:bg-yellow-700")} variant={payment?.status === PaymentStatus.NA ? "outline" : payment?.status === PaymentStatus.Paid ? "default" : payment?.status === PaymentStatus.Unpaid ? "destructive" : "outline"}>
                                                            {payment ? payment.status === PaymentStatus.Paid ? payment.amount : payment.status : "-"}
                                                        </Badge>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className="w-60">
                                                        {
                                                            payment?.status === PaymentStatus.Paid && (
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-x-3">
                                                                        <div className="shadow-md shadow-primary/80 w-8 h-8 rounded-full flex items-center justify-center">
                                                                            <DollarSign className="w-5 h-5 text-primary" />
                                                                        </div>
                                                                        <h3 className="text-md font-semibold text-muted-foreground">{payment.amount}</h3>
                                                                    </div>
                                                                    <div className="flex items-center gap-x-3">
                                                                        <div className="shadow-md shadow-primary/80 w-8 h-8 rounded-full flex items-center justify-center">
                                                                            <HandCoins className="w-5 h-5 text-primary" />
                                                                        </div>
                                                                        <h3 className="text-md font-semibold text-muted-foreground">{formatString(payment.method || "")}</h3>
                                                                    </div>
                                                                    <div className="flex items-center gap-x-3">
                                                                        <div className="shadow-md shadow-primary/80 w-8 h-8 rounded-full flex items-center justify-center">
                                                                            <CalendarCheck className="w-5 h-5 text-primary" />
                                                                        </div>
                                                                        <h3 className="text-md font-semibold text-muted-foreground">{format(payment.createdAt, "dd MMM yyyy")}</h3>
                                                                    </div>
                                                                    <div className={cn("hidden items-center gap-x-3", payment.note && "flex")}>
                                                                        <div className="shadow-md shadow-primary/80 w-8 h-8 rounded-full flex items-center justify-center">
                                                                            <NotebookText className="w-5 h-5 text-primary" />
                                                                        </div>
                                                                        <p className="text-md text-muted-foreground text-start">{payment.note}</p>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <Badge>{payment.month}</Badge>
                                                                        <Button variant="outline" asChild>
                                                                            <Link href={`/dashboard/salary/monthly/edit/${payment.id}`} className="flex items-center gap-x-2">
                                                                                <Edit className="w-5 h-5 text-primary" />
                                                                                Edit
                                                                            </Link>
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            payment?.status === PaymentStatus.Unpaid && (
                                                                <div className="flex flex-col items-center gap-4">
                                                                    <div className="w-10 h-10 shadow-md shadow-primary rounded-full flex items-center justify-center">
                                                                        <OctagonX className="text-rose-500" />
                                                                    </div>
                                                                    <p className="leading-8">Did not paid for the month of <span className="bg-indigo-500 text-white p-1">{payment.month}</span></p>
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            payment?.status === PaymentStatus.NA && (
                                                                <div className="flex flex-col items-center gap-4">
                                                                    <div className="w-10 h-10 shadow-md shadow-primary rounded-full flex items-center justify-center">
                                                                        <OctagonAlert className="text-amber-500" />
                                                                    </div>
                                                                    <p className="leading-8">Did not attend for the month of <span className="bg-indigo-500 text-white p-1">{payment.month}</span></p>
                                                                </div>
                                                            )
                                                        }
                                                    </HoverCardContent>
                                                </HoverCard>
                                            </TableCell>
                                        );
                                    })
                                }
                                <TableCell className="py-3 italic py-1">
                                    {item.payments.filter(item => item.status === PaymentStatus.Unpaid).length} Months
                                </TableCell>
                                <TableCell className="py-3 font-semibold py-1">
                                    {item.payments.filter(item => item.status === PaymentStatus.Paid).reduce((acc, curr) => acc + curr.amount, 0)}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell className="bg-slate-200/60 dark:bg-background/80"></TableCell>
                        <TableCell className="bg-slate-200/60 dark:bg-background/80"></TableCell>
                        <TableCell className="bg-slate-200/60 dark:bg-background/80"></TableCell>
                        <TableCell className="text-md font-semibold bg-slate-200/60 dark:bg-background/80">Total</TableCell>
                        {
                            Object.values(Month).map((month, i) => {
                                return (
                                    <TableCell key={i} className="text-center font-semibold bg-slate-200/60 dark:bg-background/80">
                                        {
                                            payments.reduce((total, student) => {
                                                const amount = student.payments.filter(item => item.month === month && item.status === PaymentStatus.Paid).reduce((acc, cur) => acc + cur.amount, 0)
                                                return total + amount
                                            }, 0)
                                        }
                                    </TableCell>
                                )
                            }
                            )
                        }
                        <TableCell className="text-center font-semibold bg-slate-200/60 dark:bg-background/80">
                            {
                                payments.reduce((total, student) => {
                                    return total + student.payments.reduce((acc, curr) => acc + (curr.status === PaymentStatus.Paid ? curr.amount : 0), 0);
                                }, 0)
                            }
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    )
}
