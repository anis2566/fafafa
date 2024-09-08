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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ContentLayout } from "../_components/content-layout";
import { db } from "@/lib/prisma";
import { BankCard } from "@/app/dashboard/_components/charts/bank-chart";
import { GET_USER } from "@/services/user.service";
import { AdvanceList } from "./_components/advance-list";
import { Header } from "../leave/history/_components/header";
import { CustomPagination } from "@/components/custom-pagination";

export const metadata: Metadata = {
    title: "BEC | Account",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        page: string;
        perPage: string;
    }
}

const Account = async ({ searchParams }: Props) => {
    const { page, perPage } = searchParams;
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;

    const { userId } = await GET_USER()

    const teacher = await db.teacher.findUnique({
        where: {
            userId: userId,
        },
        include: {
            classes: {
                include: {
                    batch: true,
                    subject: true,
                }
            },
            fee: true,
            bank: true,
        }
    })

    if (!teacher) redirect("/teacher")

    const advances = await db.teacherAdvance.findMany({
        where: {
            teacherId: teacher.id,
        },
        orderBy: {
            createdAt: "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalAdvance = await db.teacherAdvance.count({
        where: {
            teacherId: teacher.id,
        },
    })

    const totalPage = Math.ceil(totalAdvance / itemsPerPage)

    return (
        <ContentLayout title="Account">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/teacher">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Account</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="space-y-6 mt-4">
                <div className="grid md:grid-cols-3 gap-6">
                    <BankCard amount={teacher.bank?.current ?? 0} title="Net Balance" />
                    <BankCard amount={teacher.bank?.advance ?? 0} title="Advance" />
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Advance History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Header />
                        <AdvanceList advances={advances} />
                        <CustomPagination totalPage={totalPage} />
                    </CardContent>
                </Card>
            </div>
        </ContentLayout>
    )
}

export default Account
