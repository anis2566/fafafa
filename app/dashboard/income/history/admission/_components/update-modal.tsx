"use client"

import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { PaymentMethod } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
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

import { formatString } from "@/lib/utils"
import { AdmissionPaymentSchema } from "../schema"
import { useAddmission } from "@/hooks/use-admission"
import { UPDATE_ADMISSION_PAYMENT } from "../action"


export const UpdateAdmissionPaymentModal = () => {
    const { open, onClose, admission, id } = useAddmission()

    const form = useForm<z.infer<typeof AdmissionPaymentSchema>>({
        resolver: zodResolver(AdmissionPaymentSchema),
        defaultValues: {
            amount: undefined
        },
    })

    useEffect(() => {
        form.reset({
            amount: admission?.amount,
            method: admission?.method,
        });
    }, [admission, form]);

    const { mutate: updatePayment, isPending } = useMutation({
        mutationFn: UPDATE_ADMISSION_PAYMENT,
        onSuccess: (data) => {
            onClose()
            form.reset()
            toast.success(data.success, {
                id: "update-fee"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-fee"
            });
        }
    })

    function onSubmit(values: z.infer<typeof AdmissionPaymentSchema>) {
        toast.loading("Payment updating...", {
            id: "update-fee"
        })
        updatePayment({ values, id })
    }

    return (
        <Dialog open={open && !!id} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Payment</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter coupon title" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Method</FormLabel>
                                    <Select defaultValue={field.value} onValueChange={field.onChange} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(PaymentMethod).map((v) => (
                                                <SelectItem key={v} value={v}>
                                                    {formatString(v)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>Update</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    )
}