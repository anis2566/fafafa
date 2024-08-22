"use client"

import { Button } from "@/components/ui/button"
import { Level } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { formatString } from "@/lib/utils"
import { ADD_TEACHER_PAYMENT } from "../action"
import { useTeacherPayment } from "@/hooks/use-teacher-payment"
import { TeacherPaymentSchema } from "../schema"


export const AddTeacherPaymentModal = () => {
    const { open, onClose, id } = useTeacherPayment()


    const { mutate: addPayment, isPending } = useMutation({
        mutationFn: ADD_TEACHER_PAYMENT,
        onSuccess: (data) => {
            form.reset()
            onClose()
            toast.success(data?.success, {
                id: "add-payment"
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "add-payment"
            })
        }
    })

    const form = useForm<z.infer<typeof TeacherPaymentSchema>>({
        resolver: zodResolver(TeacherPaymentSchema),
        defaultValues: {
            level: undefined,
            amount: undefined
        },
    })

    function onSubmit(values: z.infer<typeof TeacherPaymentSchema>) {
        toast.loading("Payment adding...", {
            id: "add-payment"
        });
        addPayment({ teacherId: id, values })
    }

    return (
        <Dialog open={open && !!id} onOpenChange={!isPending ? onClose : () => { }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Payment</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Level</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(Level).map((v, i) => (
                                                    <SelectItem value={v} key={i}>{formatString(v)}</SelectItem>
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
            </DialogContent>
        </Dialog>
    )
}