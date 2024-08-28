"use client"

import { HousePayment, Month, PaymentMethod } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
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
import { Textarea } from "@/components/ui/textarea"

import { GET_HOUSES } from "@/app/dashboard/room/create/action"
import { formatString } from "@/lib/utils"
import { HousePaymentSchema } from "../../../create/schema"
import { UPDATE_HOUSE_PAYMENT } from "../action"

interface Props {
    payment: HousePayment;
}

export const EditHouseRentForm = ({ payment }: Props) => {

    const router = useRouter()

    const { data: houses } = useQuery({
        queryKey: ["get-houses-for-room"],
        queryFn: async () => {
            const res = await GET_HOUSES()
            return res.houses
        }
    })

    const { mutate: updatePayment, isPending } = useMutation({
        mutationFn: UPDATE_HOUSE_PAYMENT,
        onSuccess: (data) => {
            form.reset()
            toast.success(data.success, {
                id: "update-payment"
            });
            router.push("/dashboard/expense/house-rent")
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-payment"
            });
        }
    })

    const form = useForm<z.infer<typeof HousePaymentSchema>>({
        resolver: zodResolver(HousePaymentSchema),
        defaultValues: {
            month: payment.month || undefined,
            amount: payment.amount || undefined,
            method: payment.method || undefined,
            note: payment.note || "",
            houseId: payment.houseId || ""
        },
    })

    function onSubmit(values: z.infer<typeof HousePaymentSchema>) {
        if (!form.watch("note")) {
            toast.error("Fill up edit note")
        } else {
            toast.loading("Payment updating...", {
                id: "update-payment"
            });
            updatePayment({ id: payment.id, values })
        }
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Edit Payment Form</CardTitle>
                <CardDescription>Fill up house payment information.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="houseId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>House</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select house" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                houses?.map((v, i) => (
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
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter amount..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} disabled={isPending} />
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
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(PaymentMethod).map((v, i) => (
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
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Note</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Describe edit reason.
                                    </FormDescription>
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