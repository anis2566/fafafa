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
import { HouseList } from "./_components/house-list";
import { Header } from "./_components/header";

export const metadata: Metadata = {
    title: "BEC | House",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        name: string;
        page: string;
        perPage: string;
    }
}

const House = async ({ searchParams }: Props) => {
    const { name, page, perPage } = searchParams;
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;

    const houses = await db.house.findMany({
        where: {
            ...(name && { name: { contains: name, mode: "insensitive" } })
        },
        include: {
            rooms: {
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
    })

    const totalHouse = await db.house.count({
        where: {
            ...(name && { name: { contains: name, mode: "insensitive" } })
        },
    })

    const totalPage = Math.ceil(totalHouse / itemsPerPage)

    return (
        <ContentLayout title="Room">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Room</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>House List</CardTitle>
                    <CardDescription>
                        A collection of house.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <HouseList houses={houses} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default House
