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
import { BatchList } from "./_components/batch-list";

export const metadata: Metadata = {
    title: "BEC | Batch",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        room: string;
        page: string;
        perPage: string;
    }
}

const Batch = async ({ searchParams }: Props) => {
    const { room, page, perPage } = searchParams;
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;
    const formatedRoom = room ? parseInt(room) : undefined

    const batches = await db.batch.findMany({
        where: {
            // ...(formatedRoom && { name: formatedRoom })
        },
        orderBy: {
            createdAt: "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalBatch = await db.batch.count({
        where: {
            // ...(formatedRoom && { name: formatedRoom })
        },
    })

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
                    {/* <Header /> */}
                    {/* <RoomList rooms={rooms} /> */}
                    <BatchList batches={batches} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Batch
