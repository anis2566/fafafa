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
import { EditPaymentForm } from "./_components/edit-payment-form";

export const metadata: Metadata = {
    title: "BEC | Edit Salary",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    }
}

const EditPayment = async ({ params: { id } }: Props) => {
    const payment = await db.monthlyPayment.findUnique({
        where: {
            id
        }
    })

    if (!payment) redirect("/dashboard")

    return (
        <ContentLayout title="Salary">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/salary/monthly">Salary</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <EditPaymentForm payment={payment} />
        </ContentLayout>
    )
}

export default EditPayment
