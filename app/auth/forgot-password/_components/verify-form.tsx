"use client"

import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { FORGOT_PASSWORD_REQUEST } from "../action"

const formSchema = z.object({
    email: z.string().email({ message: "invalid email" }),
})

export const VerifyUserForm = () => {

    const { mutate: handleForgot, isPending } = useMutation({
        mutationFn: FORGOT_PASSWORD_REQUEST,
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        handleForgot(values.email)
    }

    return (
        <Card className="mx-auto max-w-sm shadow-0 border-0">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                <CardDescription>Enter your email address and we will send you a verification code to reset your password.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email..." {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isPending}>
                            Reset Password
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="text-center">
                <Link href="/auth/sign-in" className="text-sm underline" prefetch={false}>
                    Back to login
                </Link>
            </CardFooter>
        </Card>
    )
}