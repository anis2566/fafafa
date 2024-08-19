import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/app/dashboard/_components/content-layout"
import { db } from "@/lib/prisma";
import { PaymentForm } from "./_components/payment-form";

export const metadata: Metadata = {
    title: "BCE | Payment",
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
            admissionPayment: true
        }
    })

    if (!student || student.admissionPayment) redirect("/dashboard")

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
                        <BreadcrumbPage>Payment</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <PaymentForm student={student} />
        </ContentLayout>
    )
}

export default Payment
