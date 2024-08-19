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
    title: "BEC | Student Profile",
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
    })

    if (!student) redirect("/dashboard")

    return (
        <ContentLayout title="Student">
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
                <Card>
                    <CardContent className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
                        <Image
                            alt="Avatar"
                            className="rounded-full"
                            height="100"
                            src={student.imageUrl}
                            style={{
                                aspectRatio: "100/100",
                                objectFit: "cover",
                            }}
                            width="100"
                        />
                        <div className="space-y-1">
                            <div className="font-semibold text-xl text-primary">{student.name}</div>
                            <div>{student.class}</div>
                            <div>{student.mPhone}</div>
                            <Badge>{student.studentId}</Badge>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ListBox icon={User} title="Name" description={student.name} />
                            <ListBox icon={User} title="Name Bangla" description={student.nameBangla} />
                            <ListBox icon={Users} title="Father Name" description={student.fName} />
                            <ListBox icon={Users} title="Mother Name" description={student.mName} />
                            <div className="grid grid-cols-2 gap-6">
                                <ListBox icon={PersonStanding} title="Gender" description={student.gender} />
                                <ListBox icon={CalendarDays} title="Date of Birth" description={format(student.dob, "dd MMM yyyy")} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <ListBox icon={Flag} title="Nationality" description={student.nationality} />
                                <ListBox icon={University} title="Religion" description={student.religion} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Academic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ListBox icon={School} title="School Name" description={student.school} />
                            <ListBox icon={Book} title="Class" description={student.class} />
                            <ListBox icon={Layers} title="Section" description={student.section || ""} />
                            <ListBox icon={SunMoon} title="Shift" description={student.shift || ""} />
                            <ListBox icon={Boxes} title="Group" description={student.group || ""} />
                            <ListBox icon={TrainTrack} title="Roll" description={student.roll.toString()} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Address</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <h1 className="text-lg font-semibold text-muted-foreground">Present</h1>
                            <div className="grid grid-cols-2 gap-6">
                                <ListBox icon={House} title="House No" description={student.presentHouseNo} />
                                <ListBox icon={Antenna} title="Moholla" description={student.presentMoholla} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">

                                <ListBox icon={Mailbox} title="Post" description={student.presentPost} />
                                <ListBox icon={Building} title="Thana" description={student.presentThana} />
                            </div>
                            <h1 className="text-lg font-semibold text-muted-foreground">Permanent</h1>
                            <div className="grid grid-cols-2 gap-6">
                                <ListBox icon={House} title="House No" description={student.permanentVillage} />
                                <ListBox icon={Mailbox} title="Moholla" description={student.permanentPost} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">

                                <ListBox icon={Building} title="Post" description={student.permanentThana} />
                                <ListBox icon={Building2} title="Thana" description={student.permanentDistrict} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ListBox icon={Phone} title="Father Phone" description={student.fPhone} />
                                <ListBox icon={Phone} title="Mother Phone" description={student.mPhone} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Salary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ListBox icon={NotebookPen} title="Admission Fee" description={student.admissionFee.toString()} />
                                <ListBox icon={CalendarDays} title="Monthly Phone" description={student.monthlyFee.toString()} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </ContentLayout>
    )
}

export default StudentDetails
