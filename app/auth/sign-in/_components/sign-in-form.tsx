"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

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

import { SignInSchema } from "../schema"
import { SIGN_IN_USER } from "../action"
import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"


export const SignInForm = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")
    const {update} = useSession()

    const togglePassword = () => {
        setShowPassword(prev => !prev)
    }

    const { mutate: signInUser, isPending } = useMutation({
        mutationFn: SIGN_IN_USER,
        onSuccess: (data) =>  {
            toast.success(data?.success, {
                id: "sign-in-user"
            })
            update({
                role: Role.HR
            })
            console.log("trigerred")
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "sign-in-user"
            })
        }
    })

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    function onSubmit(values: z.infer<typeof SignInSchema>) {
        toast.loading("Login...", {
            id: "sign-in-user"
        })
        signInUser({ values, callbackUrl: callbackUrl ? callbackUrl : "/" })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <h1 className="text-center text-xl font-semibold text-primary border-b border-primary max-w-fit mx-auto">Sign In</h1>
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your email" {...field} type="text" disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input placeholder="Enter your email" {...field} type={showPassword ? "text" : "password"} disabled={isPending} />
                                    <Button variant="ghost" size="icon" className="absolute right-0 top-0" onClick={togglePassword} type="button" disabled={isPending}>
                                        {
                                            showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )
                                        }
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between items-center flex-wrap">
                    <Button type="submit" disabled={isPending}>Submit</Button>
                    <Button variant="linkHover2" asChild className="text-primary" disabled={isPending}>
                        <Link href="/auth/forgot-password">
                            Forgot Password?
                        </Link>
                    </Button>
                </div>
                <div className="flex items-center text-muted-foreground">
                    <p>Do not have an account?</p>
                    <Button asChild variant="linkHover2" className="text-primary" disabled={isPending}>
                        <Link href="/auth/sign-up">Sign Up</Link>
                    </Button>
                </div>
            </form>
        </Form>
    )
}