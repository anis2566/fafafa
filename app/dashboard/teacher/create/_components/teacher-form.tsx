"use client"

import { Check, DollarSign, Edit, MapPin, PhoneCall, School, Trash2, User } from "lucide-react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Gender, Nationality, Religion, Class as PrismaClass, Shift, Group, Level } from "@prisma/client"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { cn, formatString } from "@/lib/utils"
import { UploadButton } from "@/lib/uploadthing"
import { TeacherSchema, TeacherSchemaType } from "../schema"

const steps = [
    {
        id: 1,
        name: 'Personal Info',
        fields: ["name", "fName", "mName", "gender", "dob", "nationality", "religion", "imageUrl"],
        Icon: User
    },
    {
        id: 2,
        name: 'Academic Info',
        fields: ["level"],
        Icon: School
    },
    {
        id: 3,
        name: 'Address',
        fields: ["presentHouseNo", "presentMoholla", "presentPost", "presentThana", "permanentVillage", "permanentPost", "permanentThana", "permanentDistrict"],
        Icon: MapPin
    },
    {
        id: 4,
        name: 'Contact',
        fields: ["phone", "altPhone"],
        Icon: PhoneCall
    },
]


export const TeacherForm = () => {
    const [currentStep, setCurrentStep] = useState<number>(3)
    const [dob, setDob] = useState<Date>(new Date())

    const router = useRouter()

    const form = useForm<z.infer<typeof TeacherSchema>>({
        resolver: zodResolver(TeacherSchema),
        defaultValues: {
            name: "",
            fName: "",
            mName: "",
            gender: undefined,
            dob: undefined,
            nationality: undefined,
            religion: undefined,
            imageUrl: "",
            phone: "",
            altPhone: "",
            presentHouseNo: "",
            presentMoholla: "",
            presentPost: "",
            presentThana: "",
            permanentVillage: "",
            permanentPost: "",
            permanentThana: "",
            permanentDistrict: "",
            level: undefined,
        },
    })

    const { trigger, handleSubmit } = form;

    type FieldName = keyof TeacherSchemaType

    function onSubmit(values: z.infer<typeof TeacherSchema>) {
        toast.loading("Student creating...", {
            id: "create-student"
        })
        // createStudent(values)
    }

    const next = async () => {
        const fields = steps[currentStep].fields
        const output = await trigger(fields as FieldName[], { shouldFocus: true })

        if (!output) return

        setCurrentStep(step => step + 1)
    }

    return (
        <div className="py-5 space-y-6 px-6 w-full max-w-screen-xl mx-auto">
            <div className="w-full flex flex-col items-center justify-center space-y-2">
                <div className="w-[100px] h-[100px] rounded-full shadow-md shadow-primary flex items-center justify-center p-2">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-full h-full object-contain"
                    />
                </div>
                <h1 className="text-xl font-bold text-primary">Teacher Form</h1>
            </div>

            <Separator />

            <nav aria-label='Progress'>
                <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
                    {steps.map((step, index) => (
                        <li key={step.name} className='md:flex-1'>
                            {currentStep > index ? (
                                <div className='group flex w-full flex-col border-l-4 border-green-500 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                                    <div className="flex items-center gap-x-2">
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                            <Check className="w-6 h-6 text-white" />
                                        </div>
                                        {step.name}
                                    </div>
                                </div>
                            ) : currentStep === index ? (
                                <div
                                    className='flex w-full flex-col border-l-4 border-amber-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                                    aria-current='step'
                                >
                                    <div className="flex items-center gap-x-2">
                                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">

                                            <Edit className="w-6 h-6 text-white" />
                                        </div>
                                        {step.name}
                                    </div>
                                </div>
                            ) : (
                                <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                                    <div className="flex items-center gap-x-2">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">

                                            <step.Icon className="w-6 h-6 text-indigo-500" />
                                        </div>
                                        {step.name}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            <Form {...form}>
                <form className="space-y-4 border p-4 rounded-md" onSubmit={handleSubmit(onSubmit)}>
                    <div className={cn("hidden", currentStep === 0 && "grid md:grid-cols-2 gap-6")}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} onChange={(e) => {
                                            field.onChange(e.target.value)
                                            trigger("name")
                                        }} />
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
                                        <Input {...field} onChange={(e) => {
                                            field.onChange(e.target.value)
                                            trigger("fName")
                                        }} />
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
                                        <Input {...field} onChange={(e) => {
                                            field.onChange(e.target.value)
                                            trigger("mName")
                                        }} />
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
                                    <Select defaultValue={field.value} onValueChange={(value) => {
                                        field.onChange(value)
                                        trigger("gender")
                                    }}>
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
                                                    trigger("dob")
                                                }
                                            }}
                                            showYearDropdown
                                            dateFormatCalendar="MMMM"
                                            yearDropdownItemNumber={30}
                                            scrollableYearDropdown
                                            isClearable
                                            className="border border-input w-full p-2 rounded-md"
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
                                    <Select defaultValue={field.value} onValueChange={(value) => {
                                        field.onChange(value)
                                        trigger("nationality")
                                    }}>
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
                                    <Select defaultValue={field.value} onValueChange={(value) => {
                                        field.onChange(value)
                                        trigger("religion")
                                    }}>
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
                                                <Button type="button" onClick={() => form.setValue("imageUrl", "")} variant="ghost" size="icon" className="absolute right-0 top-0">
                                                    <Trash2 className="w-5 h-5 text-rose-500" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <UploadButton
                                                endpoint="imageUploader"
                                                onClientUploadComplete={(res) => {
                                                    field.onChange(res[0].url)
                                                    toast.success("Image uploaded")
                                                    trigger("imageUrl")
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

                    <div className={cn("hidden", currentStep === 1 && "grid md:grid-cols-2 gap-6")}>
                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Level</FormLabel>
                                    <Select defaultValue={field.value} onValueChange={(value) => {
                                        field.onChange(value)
                                        trigger("level")
                                    }}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(Level).map((v, i) => (
                                                    <SelectItem value={v} key={i}>{formatString(v)}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className={cn("hidden", currentStep === 2 && "block space-y-2")}>
                        <h1 className="text-lg font-semibold text-center">Present Address</h1>

                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="presentHouseNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>House No</FormLabel>
                                        <FormControl>
                                            <Input {...field} onChange={(e) => {
                                                field.onChange(e.target.value)
                                                trigger("presentHouseNo")
                                            }} />
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
                                            <Input {...field} onChange={(e) => {
                                                field.onChange(e.target.value)
                                                trigger("presentMoholla")
                                            }} />
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
                                            <Input {...field} onChange={(e) => {
                                                field.onChange(e.target.value)
                                                trigger("presentPost")
                                            }} />
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
                                            <Input {...field} onChange={(e) => {
                                                field.onChange(e.target.value)
                                                trigger("presentThana")
                                            }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <h1 className="text-lg font-semibold text-center">Permanent Address</h1>
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="permanentVillage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Village</FormLabel>
                                        <FormControl>
                                            <Input {...field} onChange={(e) => {
                                                field.onChange(e.target.value)
                                                trigger("permanentVillage")
                                            }} />
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
                                            <Input {...field} onChange={(e) => {
                                                field.onChange(e.target.value)
                                                trigger("permanentPost")
                                            }} />
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
                                            <Input {...field} onChange={(e) => {
                                                field.onChange(e.target.value)
                                                trigger("permanentThana")
                                            }} />
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
                                            <Input {...field} onChange={(e) => {
                                                field.onChange(e.target.value)
                                                trigger("permanentDistrict")
                                            }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className={cn("hidden", currentStep === 3 && "grid md:grid-cols-2 gap-6")}>
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone No</FormLabel>
                                    <FormControl>
                                        <Input {...field} onChange={(e) => {
                                            field.onChange(e.target.value)
                                            trigger("phone")
                                        }} />
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
                                        <Input {...field} onChange={(e) => {
                                            field.onChange(e.target.value)
                                            trigger("altPhone")
                                        }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-center items-center gap-x-4">
                        <Button type="button" variant="outline" onClick={() => setCurrentStep(currentStep - 1)} >Back</Button>
                        <Button type="button" onClick={next} className={cn("", currentStep === 4 && "hidden")}>Next</Button>
                        <Button type="submit" className={cn("", currentStep !== 4 && "hidden")}>Submit</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}