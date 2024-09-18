"use client"

import { Student, Gender, Nationality, Religion, Class as PrismaClass, Shift, Group } from "@prisma/client"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { toast } from "sonner"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { formatString } from "@/lib/utils"
import { UploadButton } from "@/lib/uploadthing"
import { StudentSchema } from "@/app/dashboard/admission/schema"
import { UPDATE_STUDENT } from "../action"
import { GET_USERS } from "@/app/dashboard/admission/action"

interface Props {
    student: Student;
}

export const EditStudentFrom = ({ student }: Props) => {
    const [dob, setDob] = useState<Date>(new Date(student.dob || Date.now()))
    const router = useRouter()

    const { data } = useQuery({
        queryKey: ["get-user-for-ref"],
        queryFn: GET_USERS
    })

    const { mutate: updateStudent, isPending } = useMutation({
        mutationFn: UPDATE_STUDENT,
        onSuccess: (data) => {
            toast.success(data?.success, { id: "update-student" })
            router.push(`/dashboard/student`)
        },
        onError: (error) => {
            toast.error(error.message, { id: "update-student" })
        }
    })

    const form = useForm<z.infer<typeof StudentSchema>>({
        resolver: zodResolver(StudentSchema),
        defaultValues: {
            name: student.name || "",
            nameBangla: student.nameBangla || "",
            fName: student.fName || "",
            mName: student.mName || "",
            gender: student.gender || undefined,
            dob: student.dob || undefined,
            nationality: student.nationality || undefined,
            religion: student.religion || undefined,
            imageUrl: student.imageUrl || "",
            school: student.school || "",
            class: student.class || undefined,
            section: student.section || "",
            shift: student.shift || undefined,
            group: student.group || undefined,
            roll: student.roll || undefined,
            fPhone: student.fPhone || "",
            mPhone: student.mPhone || "",
            presentHouseNo: student.presentHouseNo || "",
            presentMoholla: student.presentMoholla || "",
            presentPost: student.presentPost || "",
            presentThana: student.presentThana || "",
            permanentVillage: student.permanentVillage || "",
            permanentPost: student.permanentPost || "",
            permanentThana: student.permanentThana || "",
            permanentDistrict: student.permanentDistrict || "",
            admissionFee: student.admissionFee || undefined,
            monthlyFee: student.monthlyFee || undefined,
            referenceId: student.referenceId || ""
        },
    })

    const onSubmit = (values: z.infer<typeof StudentSchema>) => {
        toast.loading("Student updating...", { id: "update-student" })
        updateStudent({ id: student.id, values })
    }

    const renderFormField = (name: keyof z.infer<typeof StudentSchema>, label: string, type: string = "text") => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input {...field} type={type} disabled={isPending} value={field.value?.toString()} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )

    const renderSelectField = (name: keyof z.infer<typeof StudentSchema>, label: string, options: any) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Select defaultValue={field.value?.toString()} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {Object.values(options).map((v, i) => (
                                <SelectItem value={v as string} key={i}>{formatString(v as string)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )

    return (
        <Form {...form}>
            <form className="space-y-4 border p-4 mt-4 rounded-md" onSubmit={form.handleSubmit(onSubmit)}>
                {/* Personal Information */}
                <h1 className="text-xl font-semibold text-center text-primary border-b border-primary">Personal Information</h1>
                <div className="grid md:grid-cols-2 gap-6">
                    {renderFormField("name", "Name")}
                    {renderFormField("nameBangla", "Name Bangla")}
                    {renderFormField("fName", "Father Name")}
                    {renderFormField("mName", "Mother Name")}
                    {renderSelectField("gender", "Gender", Gender)}
                    <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <div>
                                    <DatePicker
                                        selected={dob}
                                        onChange={(date: Date | null) => {
                                            if (date) {
                                                setDob(date)
                                                field.onChange(date)
                                            }
                                        }}
                                        showYearDropdown
                                        dateFormatCalendar="MMMM"
                                        yearDropdownItemNumber={30}
                                        scrollableYearDropdown
                                        isClearable
                                        className="border border-input w-full p-2 rounded-md"
                                        disabled={isPending}
                                    />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {renderSelectField("nationality", "Nationality", Nationality)}
                    {renderSelectField("religion", "Religion", Religion)}
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                {
                                    form.watch("imageUrl") ? (
                                        <div className="relative w-[70px]">
                                            <Avatar>
                                                <AvatarImage src={form.getValues("imageUrl")} />
                                            </Avatar>
                                            <Button type="button" onClick={() => form.setValue("imageUrl", "")} variant="ghost" size="icon" className="absolute right-0 -top-2" disabled={isPending}>
                                                <Trash2 className="w-5 h-5 text-rose-500" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <UploadButton
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res) => {
                                                field.onChange(res[0].url)
                                                toast.success("Image uploaded")
                                            }}
                                            onUploadError={(error: Error) => {
                                                toast.error("Image upload failed")
                                            }}
                                        />
                                    )
                                }
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Academic Information */}
                <h1 className="text-xl font-semibold text-center text-primary border-b border-primary">Academic Information</h1>
                <div className="grid md:grid-cols-2 gap-6">
                    {renderFormField("school", "School Name")}
                    {renderSelectField("class", "Class", PrismaClass)}
                    {renderFormField("section", "Section")}
                    {renderSelectField("shift", "Shift", Shift)}
                    {renderSelectField("group", "Group", Group)}
                    {renderFormField("roll", "Roll", "number")}
                </div>

                {/* Address */}
                <h1 className="text-xl font-semibold text-center text-primary border-b border-primary">Address</h1>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Present Address */}
                    <div className="space-y-2">
                        <h1 className="text-lg font-semibold text-center">Present Address</h1>
                        {renderFormField("presentHouseNo", "House No")}
                        {renderFormField("presentMoholla", "Moholla")}
                        {renderFormField("presentPost", "Post")}
                        {renderFormField("presentThana", "Thana")}
                    </div>
                    {/* Permanent Address */}
                    <div className="space-y-2">
                        <h1 className="text-lg font-semibold text-center">Permanent Address</h1>
                        {renderFormField("permanentVillage", "Village")}
                        {renderFormField("permanentPost", "Post")}
                        {renderFormField("permanentThana", "Thana")}
                        {renderFormField("permanentDistrict", "District")}
                    </div>
                </div>

                {/* Contact */}
                <h1 className="text-xl font-semibold text-center text-primary border-b border-primary">Contact</h1>
                <div className="grid md:grid-cols-2 gap-6">
                    {renderFormField("fPhone", "Father Phone No")}
                    {renderFormField("mPhone", "Mother Phone No")}
                </div>

                {/* Salary */}
                <h1 className="text-xl font-semibold text-center text-primary border-b border-primary">Salary</h1>
                <div className="grid md:grid-cols-2 gap-6">
                    {renderFormField("admissionFee", "Admission Fee", "number")}
                    {renderFormField("monthlyFee", "Monthly Fee", "number")}
                    <FormField
                        control={form.control}
                        name="referenceId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reference</FormLabel>
                                <Select defaultValue={field.value} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select reference" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            data?.users.map((v, i) => (
                                                <SelectItem value={v.id} key={i}>{v.name}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isPending}>Update</Button>
            </form>
        </Form>
    )
}