import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Antenna, Book, Boxes, Building, Building2, CalendarDays, Flag, House, Layers, Mailbox, NotebookPen, PersonStanding, Phone, School, SunMoon, TrainTrack, University, User, Users } from "lucide-react";
import { format } from "date-fns";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ListBox } from "@/components/list-box";
import { ContentLayout } from "../../_components/content-layout";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "BEC | Student | Profile",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    }
}

const StudentDetails = async ({ params: { id } }: Props) => {
    const student = await db.student.findUnique({
        where: {
            id
        }
    });

    // Redirect if student not found
    if (!student) return redirect("/dashboard");

    // Destructure student properties for easier use
    const {
        imageUrl,
        name,
        class: studentClass,
        mPhone,
        studentId,
        nameBangla,
        fName,
        mName,
        gender,
        dob,
        nationality,
        religion,
        school,
        section,
        shift,
        group,
        roll,
        presentHouseNo,
        presentMoholla,
        presentPost,
        presentThana,
        permanentVillage,
        permanentPost,
        permanentThana,
        permanentDistrict,
        fPhone,
        admissionFee,
        monthlyFee,
    } = student;

    return (
        <ContentLayout title="Student">
            {/* Memoized Breadcrumb */}
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
                            <Link href="/dashboard/student">Student</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Profile</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4 space-y-8">
                {/* Student Info Card */}
                <Card>
                    <CardContent className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
                        <Image
                            alt="Avatar"
                            className="rounded-full"
                            height="100"
                            src={imageUrl || "/default-avatar.png"}
                            style={{
                                aspectRatio: "100/100",
                                objectFit: "cover",
                            }}
                            width="100"
                        />
                        <div className="space-y-1">
                            <div className="font-semibold text-xl text-primary">{name}</div>
                            <div>{studentClass}</div>
                            <div>{mPhone}</div>
                            <Badge>{studentId}</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal, Academic, and Address Information */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ListBox icon={User} title="Name" description={name} />
                            <ListBox icon={User} title="Name Bangla" description={nameBangla} />
                            <ListBox icon={Users} title="Father Name" description={fName} />
                            <ListBox icon={Users} title="Mother Name" description={mName} />
                            <div className="grid grid-cols-2 gap-6">
                                <ListBox icon={PersonStanding} title="Gender" description={gender} />
                                <ListBox icon={CalendarDays} title="Date of Birth" description={dob ? format(dob, "dd MMM yyyy") : "N/A"} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <ListBox icon={Flag} title="Nationality" description={nationality} />
                                <ListBox icon={University} title="Religion" description={religion} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Academic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Academic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ListBox icon={School} title="School Name" description={school} />
                            <ListBox icon={Book} title="Class" description={studentClass} />
                            <ListBox icon={Layers} title="Section" description={section || "N/A"} />
                            <ListBox icon={SunMoon} title="Shift" description={shift || "N/A"} />
                            <ListBox icon={Boxes} title="Group" description={group || "N/A"} />
                            <ListBox icon={TrainTrack} title="Roll" description={roll?.toString() || "N/A"} />
                        </CardContent>
                    </Card>

                    {/* Address Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Address</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <h1 className="text-lg font-semibold text-muted-foreground">Present</h1>
                            <div className="grid grid-cols-2 gap-6">
                                <ListBox icon={House} title="House No" description={presentHouseNo} />
                                <ListBox icon={Antenna} title="Moholla" description={presentMoholla} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <ListBox icon={Mailbox} title="Post" description={presentPost} />
                                <ListBox icon={Building} title="Thana" description={presentThana} />
                            </div>
                            <h1 className="text-lg font-semibold text-muted-foreground">Permanent</h1>
                            <div className="grid grid-cols-2 gap-6">
                                <ListBox icon={House} title="Village" description={permanentVillage} />
                                <ListBox icon={Mailbox} title="Post" description={permanentPost} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <ListBox icon={Building} title="Thana" description={permanentThana} />
                                <ListBox icon={Building2} title="District" description={permanentDistrict} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact and Salary Information */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ListBox icon={Phone} title="Father Phone" description={fPhone} />
                                <ListBox icon={Phone} title="Mother Phone" description={mPhone} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Fee</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ListBox icon={NotebookPen} title="Admission Fee" description={admissionFee?.toString() || "N/A"} />
                                <ListBox icon={CalendarDays} title="Monthly Fee" description={monthlyFee?.toString() || "N/A"} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
};

export default StudentDetails;
