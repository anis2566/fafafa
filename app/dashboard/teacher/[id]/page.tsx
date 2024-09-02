import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Month, TransactionStatus } from "@prisma/client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ContentLayout } from "../../_components/content-layout";
import { db } from "@/lib/prisma";
import { AddPaymentButton } from "./_components/add-payment-button,";
import { ClassList } from "./_components/class-list";
import { Profile } from "./_components/profile";
import { BankCard } from "../../_components/charts/bank-chart";
import { AdvanceList } from "./_components/advance-list";
import { Header } from "./_components/header";
import { CustomPagination } from "@/components/custom-pagination";

export const metadata: Metadata = {
    title: "BEC | Teacher | Profile",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    },
    searchParams: {
        month: Month,
        session: string;
        page: string;
        perPage: string;
    }
}

const TeacherDetails = async ({ params: { id }, searchParams: { session, month, page, perPage } }: Props) => {
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;
    const formatedSession = session ? parseInt(session) : new Date().getFullYear()

    const teacher = await db.teacher.findUnique({
        where: {
            id,
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

    if (!teacher) redirect("/dashboard")

    const netBalance = (teacher.bank?.current ?? 0) - (teacher.bank?.advance ?? 0)

    const pendingBalance = await db.teacherPayment.aggregate({
        where: {
            status: TransactionStatus.Pending
        },
        _sum: {
            amount: true
        }
    })

    const advances = await db.teacherAdvance.findMany({
        where: {
            teacherId: id,
            session: formatedSession,
            ...(month && { month })
        },
        orderBy: {
            createdAt: "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalAdvance = await db.teacherAdvance.count({
        where: {
            teacherId: id,
            session: formatedSession,
            ...(month && { month })
        },
    })

    const totalPage = Math.ceil(totalAdvance / itemsPerPage)

    return (
        <ContentLayout title="Teacher">
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
                            <Link href="/dashboard/teacher">Teacher</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4 space-y-6">
                <Card>
                    <CardContent>
                        <div className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
                            <Image
                                alt="Avatar"
                                className="rounded-full"
                                height="100"
                                src={teacher.imageUrl}
                                style={{
                                    aspectRatio: "100/100",
                                    objectFit: "cover",
                                }}
                                width="100"
                            />
                            <div className="space-y-1">
                                <div className="font-semibold text-xl text-primary">{teacher.name}</div>
                                <div>{teacher.phone}</div>
                                <Badge>{teacher.teacherId}</Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <AddPaymentButton id={id} />
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="class" className="w-full">
                    <TabsList className="flex justify-center mb-4">
                        <TabsTrigger value="class">Class</TabsTrigger>
                        <TabsTrigger value="bank">Bank</TabsTrigger>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                    </TabsList>
                    <TabsContent value="class">
                        <Card>
                            <CardHeader>
                                <CardTitle>Class List</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ClassList classes={teacher.classes} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="bank" className="space-y-6">
                        <div className="grid md:grid-cols-4 gap-6">
                            <BankCard amount={netBalance} title="Net balance" />
                            <BankCard amount={teacher.bank?.current ?? 0} title="Balance" />
                            <BankCard amount={teacher.bank?.advance ?? 0} title="Advance" />
                            <BankCard amount={pendingBalance._sum.amount ?? 0} title="Pending" />
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
                    </TabsContent>
                    <TabsContent value="profile">
                        <Profile teacher={teacher} />
                    </TabsContent>
                </Tabs>
            </div>
        </ContentLayout>
    )
}

export default TeacherDetails
