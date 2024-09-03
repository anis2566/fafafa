"use client"

import { Trash2 } from "lucide-react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Gender, Nationality, Religion, Level, Teacher, Status } from "@prisma/client"
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
import { MultiSelect } from "@/components/ui/multi-select"

import { UploadButton } from "@/lib/uploadthing"
import { TeacherSchema } from "../../../create/schema"
import { UPDATE_TEACHER } from "../action"

interface Props {
    teacher: Teacher
}

export const EditTeacherForm = ({ teacher }: Props) => {
    const [dob, setDob] = useState<Date>(new Date())

    const router = useRouter()

    const { mutate: updateTeacher, isPending } = useMutation({
        mutationFn: UPDATE_TEACHER,
        onSuccess: (data) => {
            toast.success(data?.success, {
                id: "update-teacher"
            })
            router.push(`/dashboard/teacher`)
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-teacher"
            })
        }
    })

    const form = useForm<z.infer<typeof TeacherSchema>>({
        resolver: zodResolver(TeacherSchema),
        defaultValues: {
            name: teacher.name || "",
            fName: teacher.fName || "",
            mName: teacher.mName || "",
            gender: teacher.gender || undefined,
            dob: teacher.dob ? new Date(teacher.dob) : undefined,
            nationality: teacher.nationality || undefined,
            religion: teacher.religion || undefined,
            imageUrl: teacher.imageUrl || "",
            phone: teacher.phone || "",
            altPhone: teacher.altPhone || "",
            presentHouseNo: teacher.presentHouseNo || "",
            presentMoholla: teacher.presentMoholla || "",
            presentPost: teacher.presentPost || "",
            presentThana: teacher.presentThana || "",
            permanentVillage: teacher.permanentVillage || "",
            permanentPost: teacher.permanentPost || "",
            permanentThana: teacher.permanentThana || "",
            permanentDistrict: teacher.permanentDistrict || "",
            level: teacher.level || [],
            status: teacher.status || undefined,
        },
    })

    const { handleSubmit } = form;

    function onSubmit(values: z.infer<typeof TeacherSchema>) {
        toast.loading("Teacher updating...", {
            id: "update-teacher"
        })
        updateTeacher({ id: teacher.id, values })
    }

    return (
        <Form {...form}>
            <form className="space-y-4 border p-4 mt-4 rounded-md" onSubmit={handleSubmit(onSubmit)}>
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
                                            <Button disabled={isPending} type="button" onClick={() => form.setValue("imageUrl", "")} variant="ghost" size="icon" className="absolute right-0 top-0">
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
                        name="level"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Level</FormLabel>
                                <FormControl>
                                    <MultiSelect
                                        options={Object.values(Level).map(item => ({ label: item, value: item }))}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        placeholder="Select level"
                                        variant="inverted"
                                        animation={2}
                                        maxCount={3}
                                        disabled={isPending}
                                    />
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
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone No</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="altPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Alternative Phone No</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select value={field.value} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        Object.values(Status).map((v, i) => (
                                            <SelectItem value={v} key={i}>{v}</SelectItem>

                                        ))
                                    }
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending}>Update</Button>
            </form>
        </Form>
    )
}