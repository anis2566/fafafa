import { Class, Month, MonthlyPayment, PaymentStatus } from "@prisma/client";
import { CalendarCheck, DollarSign, Edit, HandCoins, OctagonAlert, OctagonX } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn, formatString } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button";


interface Props {
    payments: {
        name: string;
        studentId: number;
        class: Class;
        imageUrl: string;
        payments: MonthlyPayment[]
    }[]
}

export const PaymentList = ({ payments }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    {
                        Object.values(Month).map((month, i) => (
                            <TableHead key={i}>{month}</TableHead>
                        ))
                    }
                    <TableHead>Total Due</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    payments.map(item => (
                        <TableRow key={item.studentId}>
                            <TableCell>{item.studentId}</TableCell>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={item.imageUrl} />
                                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{formatString(item.class)}</TableCell>
                            {
                                Object.values(Month).map((month, index) => {
                                    const payment = item.payments.find(p => p.month === month);
                                    return (
                                        <TableCell key={index} className="text-center">
                                            <HoverCard>
                                                <HoverCardTrigger asChild>
                                                    <Badge
                                                        className={cn(
                                                            "text-white",
                                                            payment?.status === PaymentStatus.NA && "bg-amber-500",
                                                            payment?.status === PaymentStatus.Paid && "bg-green-500",
                                                            payment?.status === PaymentStatus.Unpaid && "bg-rose-500",
                                                        )}
                                                    >
                                                        {payment ? payment.status : "-"}
                                                    </Badge>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="w-60">
                                                    {
                                                        payment?.status === PaymentStatus.Paid && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-x-3">
                                                                    <div className="shadow-md shadow-primary/80 w-8 h-8 rounded-full flex items-center justify-center">
                                                                        <DollarSign className="w-5 h-5" />
                                                                    </div>
                                                                    <h3 className="text-md font-semibold text-muted-foreground">{payment.amount}</h3>
                                                                </div>
                                                                <div className="flex items-center gap-x-3">
                                                                    <div className="shadow-md shadow-primary/80 w-8 h-8 rounded-full flex items-center justify-center">
                                                                        <HandCoins className="w-5 h-5" />
                                                                    </div>
                                                                    <h3 className="text-md font-semibold text-muted-foreground">{formatString(payment.method || "")}</h3>
                                                                </div>
                                                                <div className="flex items-center gap-x-3">
                                                                    <div className="shadow-md shadow-primary/80 w-8 h-8 rounded-full flex items-center justify-center">
                                                                        <CalendarCheck className="w-5 h-5" />
                                                                    </div>
                                                                    <h3 className="text-md font-semibold text-muted-foreground">{format(payment.createdAt, "dd MMM yyyy")}</h3>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <Badge>{payment.month}</Badge>
                                                                    <Button variant="outline" asChild>
                                                                        <Link href={`/dashboard/salary/monthly/edit/${payment.id}`} className="flex items-center gap-x-2">
                                                                            <Edit className="w-5 h-5" />
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
                            <TableCell className="py-3">
                                {item.payments.filter(item => item.status === PaymentStatus.Unpaid).length} Months
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}
