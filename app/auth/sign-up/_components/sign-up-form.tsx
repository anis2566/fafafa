"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, Trash } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"

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

import { UploadButton } from "@/lib/uploadthing"
import { SignUpSchema } from "../schema"
import { SIGN_UP } from "../action"

export const SignUpForm = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const togglePassword = () => {
        setShowPassword(prev => !prev)
    }

    const { mutate: signUp, isPending } = useMutation({
        mutationFn: SIGN_UP,
        onError: (error) => {
            toast.error(error.message, {
                id: "register",
                duration: 2000
            })
        }
    })

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            image: ""
        },
    })

    function onSubmit(values: z.infer<typeof SignUpSchema>) {
        signUp(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <h1 className="text-center text-xl font-semibold text-primary border-b border-primary max-w-fit mx-auto">Sign Up</h1>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your email" {...field} type="text" disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                                    <Button variant="ghost" size="icon" className="absolute right-0 top-0" onClick={togglePassword} type="button">
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
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Image</FormLabel>
                            <FormControl>
                                {
                                    form.getValues("image") ? (
                                        <div className="relative">
                                            <Image
                                                alt="Upload"
                                                width={80}
                                                height={80}
                                                className="rounded-full w-14 h-14"
                                                src={form.getValues("image")}
                                            />
                                            <Button className="absolute top-0 right-0" variant="ghost" size="icon" onClick={() => form.setValue("image", "")} type="button" disabled={isPending}>
                                                <Trash className="text-rose-500" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <UploadButton
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res) => {
                                                field.onChange(res[0].url)
                                                toast.success("Image uploaded")
                                            }}
                                            onUploadError={(error: Error) => {
                                                toast.error("Image upload failed")
                                            }}
                                        />
                                    )
                                }
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between items-center flex-wrap">
                    <Button type="submit" disabled={isPending}>Submit</Button>
                </div>
                <div className="flex items-center text-muted-foreground">
                    <p>Already have an account?</p>
                    <Button asChild variant="linkHover2" disabled={isPending} className="text-primary">
                        <Link href="/auth/sign-in">Sign In</Link>
                    </Button>
                </div>
            </form>
        </Form>
    )
}