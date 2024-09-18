import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/app/dashboard/_components/content-layout";
import { db } from "@/lib/prisma";
import { EditRoomForm } from "./_components/edit-room-form";

export const metadata: Metadata = {
    title: "BEC | Room | Edit",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    }
}

const EditRoom = async ({ params: { id } }: Props) => {
    const room = await db.room.findUnique({
        where: {
            id
        }
    })

    if (!room) redirect("/dashboard")

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
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/room">Room</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditRoomForm room={room} />
        </ContentLayout>
    )
}

export default EditRoom
