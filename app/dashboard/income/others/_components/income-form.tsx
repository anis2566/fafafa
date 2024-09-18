"use client"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"

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

import { IncomeSchema } from "../schema"
import { CREATE_INCOME } from "../action"


export const IncomeForm = () => {

    const router = useRouter()

    const { mutate: createExpense, isPending } = useMutation({
        mutationFn: CREATE_INCOME,
        onSuccess: (data) => {
            form.reset()
            toast.success(data.success, {
                id: "create-income"
            });
            // router.push("/dashboard/salary/others")
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-income"
            });
        },
        onSettled: () => {
            form.reset()
        }
    })

    const form = useForm<z.infer<typeof IncomeSchema>>({
        resolver: zodResolver(IncomeSchema),
        defaultValues: {
            name: "",
            amount: undefined,
            note: ""
        },
    })

    function onSubmit(values: z.infer<typeof IncomeSchema>) {
        toast.loading("Income creating...", {
            id: "create-income"
        });
        createExpense(values)
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
                        <Button type="submit" disabled={isPending}>Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}