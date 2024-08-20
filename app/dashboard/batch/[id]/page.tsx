import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { BookOpen, Building, Clock } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { adjustTime } from "@/lib/utils";
import { AddStudentButton } from "./_components/add-student-button";
import { StudentList } from "./_components/student-list";
import { Header } from "./_components/header";
import { CustomPagination } from "@/components/custom-pagination";
import { db } from "@/lib/prisma";
import { AddClassButton } from "./_components/add-class-button";

export const metadata: Metadata = {
    title: "BEC | Batch Details",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    },
    searchParams: {
        studentId: string;
        name: string;
        page: string;
        perPage: string;
    }
}

const BatchDetails = async ({ params: { id }, searchParams }: Props) => {
    const { studentId, name, page, perPage } = searchParams;
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;
    const formatedId = studentId ? parseInt(studentId) : undefined

    const batch = await db.batch.findUnique({
        where: {
            id
        },
        include: {
            room: true
        }
    })

    if (!batch) redirect("/dashboard")

    const students = await db.student.findMany({
        where: {
            batchId: id,
            ...(formatedId && { studentId: formatedId }),
            ...(name && { name: { contains: name, mode: "insensitive" } })
        },
        include: {
            payments: {
                where: {
                    status: PaymentStatus.Unpaid
                },
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalStudent = await db.student.count({
        where: {
            batchId: id,
            ...(formatedId && { studentId: formatedId }),
            ...(name && { name: { contains: name, mode: "insensitive" } })
        }
    })

    const totalPage = Math.ceil(totalStudent / itemsPerPage)

    return (
        <ContentLayout title="Batch">
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
                            <Link href="/dashboard/batch">Batch</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="space-y-6">
                <Card className="pt-4 mt-4">
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold">{batch.name}</h1>
                            <div className="flex items-center gap-x-3">
                                <Badge className="flex items-center gap-x-1 max-w-fit" variant="outline">
                                    <BookOpen className="w-4 h-4" />
                                    <p>{batch.class}</p>
                                </Badge>
                                <Badge className="flex items-center gap-x-1 max-w-fit" variant="outline">
                                    <Building className="w-4 h-4" />
                                    <p>{batch.room.name}</p>
                                </Badge>
                                <Badge className="flex items-center gap-x-1 max-w-fit" variant="outline">
                                    <Clock className="w-4 h-4" />
                                    <p>{adjustTime(batch.time[0])} - {batch.time[batch.time.length - 1]}</p>
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <AddStudentButton id={id} className={batch.class} />
                            <AddClassButton id={id} className={batch.class} />
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="account" className="w-full">
                    <TabsList className="flex justify-center mb-4">
                        <TabsTrigger value="students">Students</TabsTrigger>
                        <TabsTrigger value="class">Class</TabsTrigger>
                        <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="students">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student List</CardTitle>
                                <CardDescription>A collection of batch student.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Header />
                                <StudentList students={students} />
                                <CustomPagination totalPage={totalPage} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="password">Change your password here.</TabsContent>
                </Tabs>

            </div>
        </ContentLayout>
    )
}

export default BatchDetails
