import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { PaymentStatus } from "@prisma/client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ContentLayout } from "@/app/dashboard/_components/content-layout";

import { db } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentForm } from "./_components/payment-from";

export const metadata: Metadata = {
    title: "BEC | New Payment",
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
            payments: {
                where: {
                    status: PaymentStatus.Unpaid
                }
            }
        }
    })

    if (!student) redirect("/dashboard")

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
                        <BreadcrumbPage>New Payment</BreadcrumbPage>
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
                            {student.payments.map(payment => (
                                <Badge className="bg-rose-500" key={payment.id}>{payment.month}</Badge>
                            ))}
                        </div>
                        <h1>Monthly Fee: <span className="text-xl font-semibold text-primary">{student.monthlyFee}</span></h1>
                    </CardContent>
                </Card>

                <PaymentForm student={student} />
            </div>
        </ContentLayout>
    )
}

export default Payment
