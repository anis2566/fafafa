import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ContentLayout } from "../_components/content-layout";
import { Card, CardContent } from "@/components/ui/card";

import { ProfileForm } from "./_components/profile-form"; 
import { GET_USER } from "@/services/user.service";

export const metadata: Metadata = {
    title: "BEC | Profile",
    description: "Basic Education Care",
};

const Profile = async () => {
    const { user } = await GET_USER()

    return (
        <ContentLayout title="Profile">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/teacher">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Profile</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4 space-y-8">
                <Card>
                    <CardContent className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
                        <Image
                            alt="Avatar"
                            className="rounded-full"
                            height="100"
                            src={user?.image || ""}
                            style={{
                                aspectRatio: "100/100",
                                objectFit: "cover",
                            }}
                            width="100"
                        />
                        <div className="space-y-1">
                            <div className="font-semibold text-xl text-primary">{user.name}</div>
                            <div>{user.email}</div>
                        </div>
                    </CardContent>
                </Card>

                <ProfileForm user={user} />
            </div>
        </ContentLayout>
    )
}

export default Profile