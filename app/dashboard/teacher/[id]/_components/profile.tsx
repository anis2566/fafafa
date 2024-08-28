"use client"

import { Teacher, TeacherFee } from "@prisma/client"
import { format } from "date-fns";
import { Antenna, Building, Building2, CalendarDays, Edit, Flag, HandCoins, House, Mailbox, PersonStanding, Phone, University, User, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ListBox } from "@/components/list-box";
import { Button } from "@/components/ui/button";
import { useTeacherPaymentUpdate } from "@/hooks/use-teacher-payment";

interface TeacherWithPayment extends Teacher {
    fee: TeacherFee | null
}

interface Props {
    teacher: TeacherWithPayment;
}

export const Profile = ({ teacher }: Props) => {
    const {onOpen} = useTeacherPaymentUpdate()
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ListBox icon={User} title="Name" description={teacher.name} />
                    <ListBox icon={Users} title="Father Name" description={teacher.fName} />
                    <ListBox icon={Users} title="Mother Name" description={teacher.mName} />
                    <div className="grid grid-cols-2 gap-6">
                        <ListBox icon={PersonStanding} title="Gender" description={teacher.gender} />
                        <ListBox icon={CalendarDays} title="Date of Birth" description={format(teacher.dob, "dd MMM yyyy")} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <ListBox icon={Flag} title="Nationality" description={teacher.nationality} />
                        <ListBox icon={University} title="Religion" description={teacher.religion} />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Academic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h1 className="text-lg font-semibold text-muted-foreground">Present</h1>
                    <div className="grid grid-cols-2 gap-6">
                        <ListBox icon={House} title="House No" description={teacher.presentHouseNo} />
                        <ListBox icon={Antenna} title="Moholla" description={teacher.presentMoholla} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">

                        <ListBox icon={Mailbox} title="Post" description={teacher.presentPost} />
                        <ListBox icon={Building} title="Thana" description={teacher.presentThana} />
                    </div>
                    <h1 className="text-lg font-semibold text-muted-foreground">Permanent</h1>
                    <div className="grid grid-cols-2 gap-6">
                        <ListBox icon={House} title="House No" description={teacher.permanentVillage} />
                        <ListBox icon={Mailbox} title="Moholla" description={teacher.permanentPost} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">

                        <ListBox icon={Building} title="Post" description={teacher.permanentThana} />
                        <ListBox icon={Building2} title="Thana" description={teacher.permanentDistrict} />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ListBox icon={Phone} title="Phone" description={teacher.phone} />
                        <ListBox icon={Phone} title="Alternative Phone" description={teacher.altPhone || ""} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Salary</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between">
                        <ListBox icon={HandCoins} title="Per Class" description={teacher.fee?.perClass.toString()} />
                        {teacher.fee && (
                            <Button size="sm" onClick={() => onOpen(teacher.fee!, teacher?.fee?.id || "")}>
                                <Edit />
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}