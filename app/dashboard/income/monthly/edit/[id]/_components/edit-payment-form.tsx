"use client"

import { MonthlyPayment } from "@prisma/client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Month, PaymentMethod } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { MonthlyPaymentSchema } from "@/app/dashboard/income/new/[id]/schema"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { UPDATE_PAYMENT } from "../action"

interface Props {
    payment: MonthlyPayment;
}

export const EditPaymentForm = ({ payment }: Props) => {

    const { mutate: updatePayment, isPending } = useMutation({
        mutationFn: UPDATE_PAYMENT,
        onSuccess: (data) => {
            toast.success(data.success, {
                id: "payment-update"
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "payment-update"
            })
        }
    })

    const form = useForm<z.infer<typeof MonthlyPaymentSchema>>({
        resolver: zodResolver(MonthlyPaymentSchema),
        defaultValues: {
            month: payment.month,
            amount: payment.amount,
            method: payment.method ?? "Cash",
        },
    })

    function onSubmit(values: z.infer<typeof MonthlyPaymentSchema>) {
        toast.loading("Payment updating...", {
            id: "payment-update"
        })
        updatePayment({ id: payment.id, values })
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Edit Payment</CardTitle>
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
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
                                        <Input placeholder="Enter amount..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
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
                                            disabled={isPending}
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
                        <Button type="submit" disabled={isPending}>Update</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}