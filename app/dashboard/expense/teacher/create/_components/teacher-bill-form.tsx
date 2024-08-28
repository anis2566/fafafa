"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { useState } from "react"
import { Month } from "@prisma/client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TeacherPaymentSchema } from "../schema"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

import { SuccessAlert } from "./success-alert"
import { CREATE_TEACHER_PAYMENT, GET_TEACHERS } from "../action"

export const TeacherBillForm = () => {
    const [fee, setFee] = useState<number>()
    const [open, setOpen] = useState<boolean>(false)

    const { data: teachers } = useQuery({
        queryKey: ["get-teachers-for-bill"],
        queryFn: async () => {
            const res = await GET_TEACHERS()
            return res.teachers
        }
    })

    const { mutate: createPayment, isPending } = useMutation({
        mutationFn: CREATE_TEACHER_PAYMENT,
        onSuccess: (data) => {
            setOpen(true)
            toast.success(data.success, {
                id: "create-payment"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-payment"
            });
        }
    })

    const form = useForm<z.infer<typeof TeacherPaymentSchema>>({
        resolver: zodResolver(TeacherPaymentSchema),
        defaultValues: {
            classUnit: undefined,
            incentive: undefined,
            deductionUnit: undefined,
            teacherId: "",
            month: undefined
        },
    })

    function onSubmit(values: z.infer<typeof TeacherPaymentSchema>) {
        toast.loading("Payment creating...", {
            id: "create-payment"
        });
        createPayment(values)
    }

    return (
        <div className="mt-4 grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Teacher Bill Form</CardTitle>
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
                                        <Select value={field.value} onValueChange={value => {
                                            field.onChange(value)
                                            const teacher = teachers?.find(item => item.id === value)
                                            if (teacher) {
                                                setFee(teacher.fee?.perClass)
                                            }
                                        }} disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select teacher" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    teachers?.map((v, i) => (
                                                        <SelectItem value={v.id} key={i}>
                                                            #{v.teacherId} - {v.name}
                                                        </SelectItem>
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
                                name="month"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Month</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select month" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    Object.values(Month).map((v, i) => (
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
                                name="classUnit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Class</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter class number..." {...field} type="number" value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value))} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="incentive"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Incentive</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter incentive..." {...field} type="number" value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value))} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="deductionUnit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deduction Unit</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter deduction unit..." {...field} type="number" value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value))} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isPending}>Submit</Button>

                            <SuccessAlert open={open} />
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Card className="max-h-[270px]">
                <CardHeader>
                    <CardTitle>Bill Counter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-lg font-semibold">Class Rate: <span className="text-2xl font-bold text-primary">{fee}</span></p>
                    <div className="flex justify-between items-center gap-x-3">
                        <p>Class Bill:</p>
                        {
                            fee && form.watch("classUnit") && (
                                <p>{fee} * {form.watch("classUnit")} = {form.watch("classUnit") * (fee)}</p>
                            )
                        }
                    </div>
                    <div className="flex justify-between items-center gap-x-3">
                        <p>Incentive:</p>
                        {
                            form.watch("incentive") && (
                                <p>{form.watch("incentive")}</p>
                            )
                        }
                    </div>
                    <div className="flex justify-between items-center gap-x-3">
                        <p>Deduction:</p>
                        {
                            fee && form.watch("deductionUnit") && (
                                <p>{fee} * {form.watch("deductionUnit")} = {form.watch("deductionUnit")! * fee}</p>
                            )
                        }
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center gap-x-3">
                        <p>Total:</p>
                        {
                            fee && (
                                <p>
                                    {(form.watch("classUnit") || 0) * fee + (form.watch("incentive") || 0) - (form.watch("deductionUnit") || 0) * fee}
                                </p>
                            )
                        }
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
