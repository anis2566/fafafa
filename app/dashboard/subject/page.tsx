import Link from "next/link";
import { Metadata } from "next";
import { Class } from "@prisma/client";

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
import { AddSubjectButton } from "./_components/add-subject-button";
import { SubjectList } from "./_components/subject-list";
import { Header } from "./_components/header";

export const metadata: Metadata = {
    title: "BEC | Subject",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        className?: Class;
        name?: string;
        page: string;
        perPage: string;
    }
}

const Subject = async ({ searchParams }: Props) => {
    const {
        className,
        name,
        page = "1",
        perPage = "5"
    } = searchParams;

    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);


    const [subjects, totalSubject] = await Promise.all([
        await db.subject.findMany({
            where: {
                ...(className && { class: className }),
                ...(name && { name: { contains: name, mode: "insensitive" } }),
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        await db.batch.count({
            where: {
                ...(className && { class: className }),
                ...(name && { name: { contains: name, mode: "insensitive" } }),
            },
        })
    ])


    const totalPage = Math.ceil(totalSubject / itemsPerPage)

    return (
        <ContentLayout title="Subject">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Subject</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4 space-y-4">
                <AddSubjectButton />
                <Card>
                    <CardHeader>
                        <CardTitle>Subject List</CardTitle>
                        <CardDescription>
                            A collection of subject.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Header />
                        <SubjectList subjects={subjects} />
                        <CustomPagination totalPage={totalPage} />
                    </CardContent>
                </Card>
            </div>
        </ContentLayout>
    )
}

export default Subject
