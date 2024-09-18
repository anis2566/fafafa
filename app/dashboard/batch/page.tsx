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
import { BatchList } from "./_components/batch-list";
import { Header } from "./_components/header";

export const metadata: Metadata = {
    title: "BEC | Batch",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        className?: Class;
        name?: string;
        page: string;
        perPage: string;
        room?: string;
    }
}

const Batch = async ({ searchParams }: Props) => {
    const {
        className,
        room,
        name,
        page = "1",
        perPage = "5"
    } = searchParams;

    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);
    const formatedRoom = room ? parseInt(room) : undefined

    const [batches, totalBatch] = await Promise.all([
        await db.batch.findMany({
            where: {
                ...(className && { class: className }),
                ...(name && { name: { contains: name, mode: "insensitive" } }),
                ...(formatedRoom && {
                    room: {
                        name: formatedRoom
                    }
                })
            },
            include: {
                room: true,
                students: {
                    select: {
                        id: true
                    }
                }
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
                ...(formatedRoom && {
                    room: {
                        name: formatedRoom
                    }
                })
            },
        })
    ])

    const totalPage = Math.ceil(totalBatch / itemsPerPage)

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
                        <BreadcrumbPage>Batch</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Batch List</CardTitle>
                    <CardDescription>
                        A collection of batch.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <BatchList batches={batches} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Batch
