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
import { RoomList } from "./_components/room-list";
import { Header } from "./_components/header";
import { CustomPagination } from "@/components/custom-pagination";

export const metadata: Metadata = {
    title: "BEC | Room",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        room?: string;
        page: string;
        perPage: string;
    }
}

const Room = async ({ searchParams }: Props) => {
    const {
        room,
        page = "1",
        perPage = "5"
    } = searchParams;

    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);
    const formatedRoom = room ? parseInt(room) : undefined;

    const [rooms, totalRoom] = await Promise.all([
        await db.room.findMany({
            where: {
                ...(formatedRoom && { name: formatedRoom })
            },
            include: {
                batches: true,
                house: true
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        await db.room.count({
            where: {
                ...(formatedRoom && { name: formatedRoom })
            },
        })
    ])

    const totalPage = Math.ceil(totalRoom / itemsPerPage)

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
                        <BreadcrumbPage>Rooms</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Room List</CardTitle>
                    <CardDescription>
                        A collection of room.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <RoomList rooms={rooms} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Room
