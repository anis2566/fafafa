"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Month, PaymentMethod, Student } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthlyPaymentSchema } from "../schema"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { PAY_WITH_CASH } from "../action"
import { PAY_WITH_MBL } from "@/services/payment-service"

interface Props {
    student: Student;
}

export const PaymentForm = ({ student }: Props) => {

    const { mutate: payWithCash, isPending } = useMutation({
        mutationFn: PAY_WITH_CASH,
        onSuccess: (data) => {
            toast.success("Success", {
                id: "payment"
            })
            alert("paid")
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "payment"
            })
        }
    })

    const { mutate: payWithMobileBanking, isPending: isLoading } = useMutation({
        mutationFn: PAY_WITH_MBL,
        onSuccess: (data) => {
            if (data?.url) {
                window.location.replace(data?.url)
            }
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const form = useForm<z.infer<typeof MonthlyPaymentSchema>>({
        resolver: zodResolver(MonthlyPaymentSchema),
        defaultValues: {
            month: undefined,
            amount: student.monthlyFee,
            method: undefined,
        },
    })

    function onSubmit(values: z.infer<typeof MonthlyPaymentSchema>) {
        toast.loading("Paying...", {
            id: "payment"
        })
        if (values.method === PaymentMethod.Cash) {
            payWithCash({ values, studentId: student.id })
        } else {
            payWithMobileBanking({ month: values.month, studentId: student.id, amount: student.monthlyFee.toString() })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Form</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="month"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending || isLoading}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(Month).map((v) => (
                                                <SelectItem key={v} value={v}>
                                                    {v}
                                                </SelectItem>
                                            ))}
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
                                    <FormLabel>Amoont</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter amount..." {...field} type="number" disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Method</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                            disabled={isPending || isLoading}
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value={PaymentMethod.Cash} />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Cash
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value={PaymentMethod.MobileBanking} />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Mobile Banking
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending || isLoading}>Pay Now</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}