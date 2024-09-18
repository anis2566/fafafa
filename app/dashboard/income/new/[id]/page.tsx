import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Month, PaymentStatus } from "@prisma/client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ContentLayout } from "@/app/dashboard/_components/content-layout";
import { db } from "@/lib/prisma";
import { PaymentForm } from "./_components/payment-from";

export const metadata: Metadata = {
    title: "BEC | Salary | New",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    }
}

const Payment = async ({ params: { id } }: Props) => {
    const student = await db.student.findUnique({
        where: {
            id
        },
        include: {
            payments: true
        }
    })

    if (!student) redirect("/dashboard")

    const currentMonths = Object.values(Month).slice(0, new Date().getMonth() + 1)

    const unPaidMonth = currentMonths.filter(month =>
        !student.payments.some(payment =>
            payment.month === month &&
            (payment.status === PaymentStatus.NA || payment.status === PaymentStatus.Paid)
        )
    )

    return (
        <ContentLayout title="Payment">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>New Salary</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4 space-y-6">
                <Card>
                    <CardContent className="space-y-2">
                        <div className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
                            <Image
                                alt="Avatar"
                                className="rounded-full"
                                height="100"
                                src={student.imageUrl}
                                style={{
                                    aspectRatio: "100/100",
                                    objectFit: "cover",
                                }}
                                width="100"
                            />
                            <div className="space-y-1">
                                <div className="font-semibold text-xl text-primary">{student.name}</div>
                                <div>{student.class}</div>
                                <div>{student.studentId}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <h1 className="text-lg font-semibold">Payment Due:</h1>
                            {unPaidMonth.map((month, index) => (
                                <Badge className="bg-rose-500" key={index}>{month}</Badge>
                            ))}
                        </div>
                        <h1>Monthly Fee: <span className="text-xl font-semibold text-primary">{student.monthlyFee}</span></h1>
                    </CardContent>
                </Card>

                <PaymentForm student={student} unpaidMonth={unPaidMonth} />
            </div>
        </ContentLayout>
    )
}

export default Payment
