import Link from "next/link";
import { Metadata } from "next";
import { Class as PrismaClass } from "@prisma/client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ContentLayout } from "../../_components/content-layout"
import { CreateButton } from "./_components/create-button";
import { FeeList } from "./_components/fee-list";
import { db } from "@/lib/prisma";
import { CustomPagination } from "@/components/custom-pagination";
import { Header } from "./_components/header";

export const metadata: Metadata = {
    title: "BEC | Admission Fee",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        class: PrismaClass;
        page: string;
        perPage: string;
    }
}

const AdmissionFee = async ({ searchParams }: Props) => {
    const { class: classname, page, perPage } = searchParams
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;

    const fees = await db.admissionFee.findMany({
        where: {
            ...(classname && {
                class: {
                    equals: classname
                }
            })
        },
        orderBy: {
            createdAt: "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalFee = await db.admissionFee.count({
        where: {
            ...(classname && {
                class: classname
            })
        }
    })

    const totalPage = Math.ceil(totalFee / itemsPerPage)

    return (
        <ContentLayout title="Fee">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Admission Fee</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <CreateButton />

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Fee List</CardTitle>
                    <CardDescription>
                        A collection of admission fee.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <FeeList fees={fees} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default AdmissionFee
