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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ContentLayout } from "../_components/content-layout";
import { db } from "@/lib/prisma";
import { CustomPagination } from "@/components/custom-pagination";
import { TeacherList } from "./_components/teacher-list";
import { Header } from "./_components/header";

export const metadata: Metadata = {
    title: "BEC | Teacher",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        session: string;
        id: string;
        name: string;
        page: string;
        perPage: string;
    }
}


const Teacher = async ({ searchParams }: Props) => {
    const { session, id, name, page, perPage } = searchParams;
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;
    const formatedSession = session ? parseInt(session) : new Date().getFullYear()
    const teacherId = id ? parseInt(id) : undefined

    const teachers = await db.teacher.findMany({
        where: {
            session: formatedSession,
            ...(teacherId && { teacherId }),
            ...(name && { name: { contains: name, mode: "insensitive" } }),
        },
        orderBy: {
            createdAt: "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalTeacher = await db.teacher.count({
        where: {
            session: formatedSession,
            ...(teacherId && { teacherId }),
            ...(name && { name: { contains: name, mode: "insensitive" } }),
        }
    })

    const totalPage = Math.ceil(totalTeacher / itemsPerPage)

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
                        <BreadcrumbPage>Teacher</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Teacher List</CardTitle>
                    <CardDescription>
                        A collection of teacher.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <TeacherList teachers={teachers} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Teacher
