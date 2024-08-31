import Link from "next/link";
import { Metadata } from "next";

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
import { redirect } from "next/navigation";
import { AttendenceList } from "./_components/attendence-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Month, PaymentStatus } from "@prisma/client";

export const metadata: Metadata = {
    title: "BEC | Attendence | Student | Batch",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    }
}

const AttendenceBatch = async ({ params: { id } }: Props) => {
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
            batchId: id
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

    console.log(students)

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
                <CardContent>
                    <AttendenceList students={students} batchId={id} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default AttendenceBatch
