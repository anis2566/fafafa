"use client"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { Income } from "@prisma/client"

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
import { Textarea } from "@/components/ui/textarea"

import { IncomeSchema } from "../../../schema"
import { UPDATE_INCOME } from "../action"

interface Props {
    income: Income
}

export const EditIncomeForm = ({ income }: Props) => {

    const router = useRouter()

    const { mutate: updateIncome, isPending } = useMutation({
        mutationFn: UPDATE_INCOME,
        onSuccess: (data) => {
            form.reset()
            toast.success(data.success, {
                id: "update-income"
            });
            router.push("/dashboard/income/history/others")
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-income"
            });
        },
        onSettled: () => {
            form.reset()
        }
    })

    const form = useForm<z.infer<typeof IncomeSchema>>({
        resolver: zodResolver(IncomeSchema),
        defaultValues: {
            name: income.name || "",
            amount: income.amount || undefined,
            note: income.note || ""
        },
    })

    function onSubmit(values: z.infer<typeof IncomeSchema>) {
        if (!form.watch("note")) {
            toast.error("Fill up edit note")
        } else {
            toast.loading("Updating...", {
                id: "update-income"
            });
            updateIncome({ id: income.id, values })
        }
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Income Form</CardTitle>
                <CardDescription>Fill up income information.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Income title..." {...field} disabled={isPending} />
                                    </FormControl>
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
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Describe edit reason.
                                    </FormDescription>
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