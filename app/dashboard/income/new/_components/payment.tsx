"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { Class } from "@prisma/client"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { FIND_STUDENT } from "../action"

const formSchema = z.object({
    session: z.number().min(1, { message: "required" }),
    class: z
        .nativeEnum(Class)
        .refine((val) => Object.values(Class).includes(val), {
            message: "required",
        }),
    id: z.number().min(1, { message: "required" }),
});

export const PaymentForm = () => {

    const router = useRouter()

    const { mutate: findStudent, isPending } = useMutation({
        mutationFn: FIND_STUDENT,
        onSuccess: (data) => {
            router.push(`/dashboard/income/new/${data.student.id}`)
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "find-student"
            })
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            session: new Date().getFullYear(),
            class: undefined,
            id: undefined,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        findStudent({ ...values, className: values.class })
    }

    return (
        <div className="mt-4 space-y-6">
            <Card >
                <CardHeader>
                    <CardTitle>Search Student</CardTitle>
                    <CardDescription>Find out student to make a payment.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="flex flex-wrap gap-x-4">
                                <FormField
                                    control={form.control}
                                    name="session"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Session</FormLabel>
                                            <Select defaultValue={new Date().getFullYear().toString()} onValueChange={(value) => field.onChange(parseInt(value))} disabled={isPending}>
                                                <FormControl>
                                                    <SelectTrigger className="w-[150px]">
                                                        <SelectValue placeholder="Select session" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        ["2020", "2021", "2022", "2023", "2024", "2025", "2026"].map((v, i) => (
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
                                    name="class"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Class</FormLabel>
                                            <Select onValueChange={(value) => field.onChange(value as Class)} disabled={isPending}>
                                                <FormControl>
                                                    <SelectTrigger className="w-[150px]">
                                                        <SelectValue placeholder="Select class" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        Object.values(Class).map((v, i) => (
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
                                    name="id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ID</FormLabel>
                                            <FormControl>
                                                <Input {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" disabled={isPending}>Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}