"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Trash } from "lucide-react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { UploadDropzone } from "@/lib/uploadthing"
import { LeaveAppSchema } from "../schema"
import { CREATE_LEAVE_APP } from "../action"
import { cn } from "@/lib/utils"

export const LeaveFrom = () => {

    const router = useRouter()

    const { mutate: applyLeave, isPending } = useMutation({
        mutationFn: CREATE_LEAVE_APP,
        onSuccess: (data) => {
            form.reset()
            toast.success(data.success, {
                id: "create-app"
            });
            router.push(`/teacher/leave/history`)
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
            reason: "",
            attachments: [],
            dates: []
        },
    })

    function onSubmit(values: z.infer<typeof LeaveAppSchema>) {
        toast.loading("Applying...", {
            id: "create-app"
        });

        const formattedValues = {
            ...values,
            dates: values.dates.map(date => new Date(date))
        };

        applyLeave(formattedValues);
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
                            name="dates"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value && field.value[0] ? (
                                                            format(new Date(field.value[0]), "PPP")
                                                        ) : (
                                                            <span>From (date)</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value[0]}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            field.onChange([date]);
                                                        }
                                                    }}
                                                    disabled={(date) =>
                                                        date < new Date(Date.now())
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value && field.value[1] ? (
                                                            format(new Date(field.value[1]), "PPP")
                                                        ) : (
                                                            <span>To (date)</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value[1]}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            field.onChange([form.getValues("dates")[0], date]);
                                                        }
                                                    }}
                                                    disabled={(date) =>
                                                        date < new Date() || date <= form.getValues("dates")[0]
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
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