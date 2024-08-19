"use client"

import { Student } from "@prisma/client"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Gender, Nationality, Religion, Class as PrismaClass, Shift, Group } from "@prisma/client"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
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

interface Props {
    student: Student;
}

export const EditStudentFrom = ({ student }: Props) => {
    const [dob, setDob] = useState<Date>(new Date())

    const router = useRouter()

    const { mutate: updateStudent, isPending } = useMutation({
        mutationFn: UPDATE_STUDENT,
        onSuccess: (data) => {
            toast.success(data?.success, {
                id: "update-student"
            })
            router.push(`/dashboard/student`)
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-student"
            })
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
            monthlyFee: student.monthlyFee || undefined
        },
    })

    function onSubmit(values: z.infer<typeof StudentSchema>) {
        toast.loading("Student updating...", {
            id: "update-student"
        })
        updateStudent({ id: student.id, values })
    }
    return (
        <Form {...form}>
            <form className="space-y-4 border p-4 mt-4 rounded-md" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <h1 className="text-xl font-semibold text-center text-primary border-b border-primary">Personal Information</h1>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="nameBangla"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name Bangla</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Father Name</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mother Name</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select defaultValue={field.value} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            Object.values(Gender).map((v, i) => (
                                                <SelectItem value={v} key={i}>{v}</SelectItem>

                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                    <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nationality</FormLabel>
                                <Select defaultValue={field.value} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select nationality" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            Object.values(Nationality).map((v, i) => (
                                                <SelectItem value={v} key={i}>{v}</SelectItem>

                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="religion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Religion</FormLabel>
                                <Select defaultValue={field.value} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select religion" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            Object.values(Religion).map((v, i) => (
                                                <SelectItem value={v} key={i}>{v}</SelectItem>

                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                {
                                    form.watch("imageUrl") ? (
                                        <div className="relative">
                                            <Avatar>
                                                <AvatarImage src={form.getValues("imageUrl")} />
                                            </Avatar>
                                            <Button type="button" onClick={() => form.setValue("imageUrl", "")} variant="ghost" size="icon" className="absolute right-0 top-0" disabled={isPending}>
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

                <div className="space-y-4">
                    <h1 className="text-xl font-semibold text-center text-primary border-b border-primary">Academic Information</h1>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="school"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>School Name</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="class"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Class</FormLabel>
                                <Select defaultValue={field.value} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            Object.values(PrismaClass).map((v, i) => (
                                                <SelectItem value={v} key={i}>{formatString(v)}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="section"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Section</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="shift"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Shift</FormLabel>
                                <Select defaultValue={field.value} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select shift" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            Object.values(Shift).map((v, i) => (
                                                <SelectItem value={v} key={i}>{v}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="group"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Group</FormLabel>
                                <Select defaultValue={field.value} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select group" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            Object.values(Group).map((v, i) => (
                                                <SelectItem value={v} key={i}>{formatString(v)}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="roll"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Roll</FormLabel>
                                <FormControl>
                                    <Input {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h1 className="text-xl font-semibold text-center text-primary border-b border-primary">Address</h1>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h1 className="text-lg font-semibold text-center">Present Address</h1>
                        <FormField
                            control={form.control}
                            name="presentHouseNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>House No</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="presentMoholla"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Moholla</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="presentPost"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Post</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="presentThana"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thana</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-lg font-semibold text-center">Permanent Address</h1>
                        <FormField
                            control={form.control}
                            name="permanentVillage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Village</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="permanentPost"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Post</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="permanentThana"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thana</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="permanentDistrict"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>District</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-xl font-semibold text-center text-primary border-b border-primary">Contact</h1>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="fPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Father Phone No</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mother Phone No</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h1 className="text-xl font-semibold text-center text-primary border-b border-primary">Salary</h1>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="admissionFee"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Admission Fee</FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value} type="number" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="monthlyFee"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Monthly Fee</FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value} type="number" disabled={isPending} />
                                </FormControl>
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