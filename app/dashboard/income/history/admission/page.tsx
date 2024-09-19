import Link from "next/link";
import { Metadata } from "next";
import { Class, PaymentStatus } from "@prisma/client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { db } from "@/lib/prisma";
import { SalaryList } from "./_components/salary-list";
import { Header } from "../monthly/_components/header";
import { CustomPagination } from "@/components/custom-pagination";
import { ContentLayout } from "../../../_components/content-layout"

export const metadata: Metadata = {
    title: "BEC | Income | History | Admission Fee",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        session?: string;
        className?: Class;
        id?: string;
        name?: string;
        status?: PaymentStatus;
        page: string;
        perPage: string;
    }
}

const AdmissionPayment = async ({ searchParams }: Props) => {
    const {
        session,
        className,
        id,
        name,
        status,
        page = "1",
        perPage = "5"
    } = searchParams;

    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);
    const formatedSession = parseInt(session || `${new Date().getFullYear()}`);
    const studentId = id ? parseInt(id) : undefined;

    const [payments, totalPayment] = await Promise.all([
        await db.admissionPayment.findMany({
            where: {
                ...(status && { status }),
                ...(session || className || studentId || name) && {
                    student: {
                        ...(session && { session: formatedSession }),
                        ...(className && { class: className }),
                        ...(studentId && { studentId: { equals: studentId } }),
                        ...(name && { name: { contains: name, mode: "insensitive" } })
                    }
                }
            },
            include: {
                student: true
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        await db.admissionPayment.count({
            where: {
                ...(status && { status }),
                ...(session || className || studentId || name) && {
                    student: {
                        ...(session && { session: formatedSession }),
                        ...(className && { class: className }),
                        ...(studentId && { studentId: { equals: studentId } }),
                        ...(name && { name: { contains: name, mode: "insensitive" } })
                    }
                }
            }
        })
    ])

    const totalPage = Math.ceil(totalPayment / itemsPerPage)

    return (
        <ContentLayout title="Admission Fee">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Admission Fee History</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Fee List</CardTitle>
                    <CardDescription>
                        A collection of admission fee.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <SalaryList payments={payments} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default AdmissionPayment
