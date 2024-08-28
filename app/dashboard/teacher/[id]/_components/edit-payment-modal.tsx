"use client"

import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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

import { UPDATE_TEACHER_PAYMENT } from "../action"
import { useTeacherPaymentUpdate } from "@/hooks/use-teacher-payment"
import { TeacherFeeSchema } from "../schema"


export const UpdateTeacherPaymentModal = () => {
    const { open, onClose, id, fee } = useTeacherPaymentUpdate()


    const { mutate: updatePayment, isPending } = useMutation({
        mutationFn: UPDATE_TEACHER_PAYMENT,
        onSuccess: (data) => {
            form.reset()
            onClose()
            toast.success(data?.success, {
                id: "update-payment"
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-payment"
            })
        }
    })

    const form = useForm<z.infer<typeof TeacherFeeSchema>>({
        resolver: zodResolver(TeacherFeeSchema),
        defaultValues: {
            perClass: undefined
        },
    })

    useEffect(() => {
        form.reset({
            perClass: fee?.perClass
        });
    }, [fee, form]);

    function onSubmit(values: z.infer<typeof TeacherFeeSchema>) {
        toast.loading("Payment updating...", {
            id: "update-payment"
        });
        updatePayment({ id, values })
    }

    return (
        <Dialog open={open && !!id} onOpenChange={!isPending ? onClose : () => { }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Payment</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="perClass"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class Rate</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter class rate..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
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