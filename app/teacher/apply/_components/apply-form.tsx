"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { APPLY_TEACHER } from "../action"

const TeacherApplySchema = z.object({
    teacherId: z.number().min(1, { message: "required" }),
    phone: z.string().min(11, { message: "required" }),
})

export const ApplyForm = () => {
    const router = useRouter()

    const { mutate: applyTeacher, isPending } = useMutation({
        mutationFn: APPLY_TEACHER,
        onSuccess: (data) => {
            toast.success(data.success, {
                id: "apply"
            })
            router.push("/teacher")
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "apply",
                duration: 2000
            })
        }
    })

    const form = useForm<z.infer<typeof TeacherApplySchema>>({
        resolver: zodResolver(TeacherApplySchema),
        defaultValues: {
            phone: "",
            teacherId: undefined
        },
    })

    function onSubmit(values: z.infer<typeof TeacherApplySchema>) {
        toast.loading("Applying...", {
            id: "apply"
        })
        applyTeacher(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="teacherId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Teacher ID</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your teacher id..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Primary Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your phone..." {...field} type="text" disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button disabled={isPending}>Submit</Button>
            </form>
        </Form>
    )
}