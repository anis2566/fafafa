import Link from "next/link";
import { Metadata } from "next";
import { Class, PaymentStatus } from "@prisma/client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ContentLayout } from "../../_components/content-layout";
import { db } from "@/lib/prisma";
import { CustomPagination } from "@/components/custom-pagination";
import { StudentList } from "./_components/student-list";
import { Header } from "../_components/header";

export const metadata: Metadata = {
    title: "BEC | Student | Absent",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        session?: string;
        className?: Class;
        id?: string;
        name?: string;
        page?: string;
        perPage?: string;
    };
}


const AbsentStudents = async ({ searchParams }: Props) => {
    const {
        session,
        className,
        id,
        name,
        page = "1",
        perPage = "5"
    } = searchParams;

    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);
    const formatedSession = parseInt(session || `${new Date().getFullYear()}`);
    const studentId = id ? parseInt(id) : undefined;

    const [students, totalStudent] = await Promise.all([
        db.student.findMany({
            where: {
                session: formatedSession,
                isPresent: false,
                ...(className && { class: className }),
                ...(studentId && { studentId }),
                ...(name && { name: { contains: name, mode: "insensitive" } }),
            },
            include: {
                payments: {
                    where: {
                        status: PaymentStatus.Unpaid,
                    },
                    select: {
                        id: true,
                    },
                },
                batch: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                id: "asc",
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        db.student.count({
            where: {
                session: formatedSession,
                isPresent: false,
                ...(className && { class: className }),
                ...(studentId && { studentId }),
                ...(name && { name: { contains: name, mode: "insensitive" } }),
            },
        }),
    ]);

    const totalPage = Math.ceil(totalStudent / itemsPerPage);

    return (
        <ContentLayout title="Student">
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
                            <Link href="/dashboard/student">Student</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Absent</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Absent List</CardTitle>
                    <CardDescription>
                        A collection of absent student.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <StudentList students={students} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default AbsentStudents
