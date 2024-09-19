import Link from "next/link";
import { Metadata } from "next";
import { Month, PaymentStatus } from "@prisma/client";
import { redirect } from "next/navigation";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ContentLayout } from "@/app/dashboard/_components/content-layout";
import { db } from "@/lib/prisma";
import { AttendenceList } from "./_components/attendence-list";
import { Header } from "./_components/header";

export const metadata: Metadata = {
    title: "BEC | Attendence | Student | Batch",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    },
    searchParams: {
        id?: string;
        name?: string;
    }
}

const AttendenceBatch = async ({ params: { id }, searchParams }: Props) => {
    const { name } = searchParams;
    const studentId = searchParams.id ? parseInt(searchParams.id) : undefined

    const batch = await db.batch.findUnique({
        where: {
            id
        },
        include: {
            attendences: true
        }
    })

    if (!batch) redirect("/dashboard")

    const students = await db.student.findMany({
        where: {
            batchId: id,
            isPresent: true,
            ...(studentId && { studentId }),
            ...(name && { name: { contains: name, mode: "insensitive" } })
        },
        select: {
            id: true,
            name: true,
            studentId: true,
            imageUrl: true,
            mPhone: true,
            attendences: {
                where: {
                    session: new Date().getFullYear(),
                    month: Object.values(Month)[new Date().getMonth()]
                },
            },
            payments: {
                where: {
                    status: PaymentStatus.Unpaid
                },
                select: {
                    id: true
                }
            }
        },
        orderBy: {
            studentId: "asc"
        }
    })

    return (
        <ContentLayout title="Attendence">
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
                            <Link href="/dashboard/attendence/student">Student</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Batch</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Attendences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Header />
                    <AttendenceList students={students} batchId={id} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default AttendenceBatch
