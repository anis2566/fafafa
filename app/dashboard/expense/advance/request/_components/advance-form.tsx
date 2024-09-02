"use client"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"

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
import { Input } from "@/components/ui/input"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CREATE_ADVANCE, GET_TEACHERS } from "../action"
import { TeacherAdvanceSchema } from "../schema"

export const AdvanceForm = () => {
    const [id, setId] = useState<number>()

    const router = useRouter()

    const { data: teachers } = useQuery({
        queryKey: ["get-teachers-for-advance", id],
        queryFn: async () => {
            const res = await GET_TEACHERS(id)
            return res.teachers
        }
    })

    const { mutate: createAdvance, isPending } = useMutation({
        mutationFn: CREATE_ADVANCE,
        onSuccess: (data) => {
            form.reset()
            toast.success(data.success, {
                id: "create-advance"
            });
            router.push("/dashboard/expense/advance")
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-advance"
            });
        }
    })

    const form = useForm<z.infer<typeof TeacherAdvanceSchema>>({
        resolver: zodResolver(TeacherAdvanceSchema),
        defaultValues: {
            amount: undefined,
            teacherId: ""
        },
    })

    function onSubmit(values: z.infer<typeof TeacherAdvanceSchema>) {
        toast.loading("Requesting...", {
            id: "create-advance"
        });
        createAdvance(values)
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Advance Form</CardTitle>
                <CardDescription>Fill up advance information.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter amount..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
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