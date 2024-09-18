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
import { NoticeList } from "./_components/notice-list";
import { Header } from "./_components/header";
import { CustomPagination } from "@/components/custom-pagination";
import { NoticeType } from "@prisma/client";

export const metadata: Metadata = {
    title: "BEC | Notice",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        page: string;
        perPage: string;
        type?: NoticeType;
    }
}

const Notices = async ({ searchParams }: Props) => {
    const {
        type,
        page = "1",
        perPage = "5"
    } = searchParams;

    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);

    const [notices, totalNotice] = await Promise.all([
        await db.notice.findMany({
            where: {
                ...(type && { type }),
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        await db.notice.count()
    ])

    const totalPage = Math.ceil(totalNotice / itemsPerPage)

    return (
        <ContentLayout title="Notice">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Notices</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Notice List</CardTitle>
                    <CardDescription>A collection of notice.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <NoticeList notices={notices} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Notices
