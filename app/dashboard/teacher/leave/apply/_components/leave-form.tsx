"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Day } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { Trash } from "lucide-react"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { UploadDropzone } from "@/lib/uploadthing"
import { LeaveAppSchema } from "../schema"
import { GET_TEACHERS } from "@/app/dashboard/expense/advance/request/action"
import { CREATE_LEAVE_APP } from "../action"

export const LeaveFrom = () => {
    const [id, setId] = useState<number>()

    const router = useRouter()

    const { data: teachers } = useQuery({
        queryKey: ["get-teachers-for-advance", id],
        queryFn: async () => {
            const res = await GET_TEACHERS(id)
            return res.teachers
        }
    })

    const { mutate: applyLeave, isPending } = useMutation({
        mutationFn: CREATE_LEAVE_APP,
        onSuccess: (data) => {
            form.reset()
            toast.success(data.success, {
                id: "create-app"
            });
            router.push(`/dashboard/teacher/leave/apply/${data?.id}/class`)
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-app"
            });
        }
    })

    const form = useForm<z.infer<typeof LeaveAppSchema>>({
        resolver: zodResolver(LeaveAppSchema),
        defaultValues: {
            days: [],
            reason: "",
            attachments: [],
            teacherId: ""
        },
    })

    function onSubmit(values: z.infer<typeof LeaveAppSchema>) {
        toast.loading("Applying...", {
            id: "create-app"
        });
        applyLeave(values)
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Leave Form</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="teacherId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teacher</FormLabel>
                                    <Select onValueChange={field.onChange} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select teacher" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <Input placeholder="Search by id..." type="number" onChange={(e) => setId(parseInt(e.target.value))} className="my-2" />
                                            {
                                                teachers?.map((v, i) => (
                                                    <SelectItem value={v.id} key={i}>{v.name}</SelectItem>
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
                            name="days"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Days</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={Object.values(Day).map(item => ({ label: item, value: item }))}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            placeholder="Select days"
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
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell leave reason"
                                            className="resize-none"
                                            {...field}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="attachments"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Attachments</FormLabel>
                                    <FormControl>
                                        {
                                            (form.getValues("attachments")?.length ?? 0) > 0 ? (
                                                <div className="flex gap-x-4 justify-start flex-wrap">
                                                    {
                                                        form.getValues("attachments")?.map((img, index) => (
                                                            <div key={index} className="relative">
                                                                <Image
                                                                    alt="Upload"
                                                                    width={120}
                                                                    height={120}
                                                                    className="object-contain rounded-md mx-auto"
                                                                    src={img}
                                                                />
                                                                <Button className="absolute -top-5 -right-5" variant="ghost" size="icon" onClick={() => {
                                                                    const attachments = form.getValues("attachments")
                                                                    form.setValue("attachments", attachments?.filter(image => image !== img))
                                                                }} disabled={isPending}>
                                                                    <Trash className="text-rose-500" />
                                                                </Button>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            ) : (
                                                <UploadDropzone
                                                    endpoint="multipleImageUploader"
                                                    onClientUploadComplete={(res) => {
                                                        console.log(res)
                                                        res.map(img => {
                                                            if (res.length > 0) {
                                                                const currentImages = form.getValues("attachments") || [];
                                                                form.setValue("attachments", [...currentImages, img.url]);
                                                            }
                                                        })
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        toast.error("Image upload failed")
                                                    }}
                                                />
                                            )
                                        }
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}