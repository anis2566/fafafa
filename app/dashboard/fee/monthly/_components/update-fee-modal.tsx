"use client"

import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Class as PrismaClass } from "@prisma/client"
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
import { UPDATE_FEE } from "../action"
import { MonthlyFeeSchema } from "../schema"
import { useMonthlyFeeUpdate } from "@/hooks/use-monthly-fee"


export const UpdateMonthlyFeeModal = () => {
    const { open, onClose, fee, id } = useMonthlyFeeUpdate()

    const form = useForm<z.infer<typeof MonthlyFeeSchema>>({
        resolver: zodResolver(MonthlyFeeSchema),
        defaultValues: {
            class: undefined,
            amount: undefined
        },
    })

    useEffect(() => {
        form.reset({
            class: fee?.class,
            amount: fee?.amount
        });
    }, [fee, form]);

    const { mutate: updateFee, isPending } = useMutation({
        mutationFn: UPDATE_FEE,
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

    function onSubmit(values: z.infer<typeof MonthlyFeeSchema>) {
        toast.loading("Fee updating...", {
            id: "update-fee"
        })
        updateFee({ values, id })
    }

    return (
        <Dialog open={open && !!id} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Fee</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="class"
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
                                            {Object.values(PrismaClass).map((v) => (
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
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amoont</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter coupon title" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
                                    </FormControl>
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