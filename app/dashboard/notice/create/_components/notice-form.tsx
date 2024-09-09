"use client"

import { NoticeType } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { NoticeSchema } from "../schema"
import { CREATE_NOTICE } from "../action"

export const CreateNoticeForm = () => {

    const router = useRouter()

    const { mutate: createNotice, isPending } = useMutation({
        mutationFn: CREATE_NOTICE,
        onSuccess: (data) => {
            form.reset()
            toast.success(data.success, {
                id: "create-notice"
            });
            router.push("/dashboard/notice")
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-notice"
            });
        }
    })

    const form = useForm<z.infer<typeof NoticeSchema>>({
        resolver: zodResolver(NoticeSchema),
        defaultValues: {
            type: undefined,
            text: ""
        },
    })

    function onSubmit(values: z.infer<typeof NoticeSchema>) {
        toast.loading("Notice creating...", {
            id: "create-notice"
        });
        createNotice(values)
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Notice Form</CardTitle>
                <CardDescription>Fill up notice information.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(NoticeType).map((v, i) => (
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
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notice</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter notice details..." {...field} disabled={isPending} />
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