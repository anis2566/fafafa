"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { User } from "@prisma/client"

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

import { UploadDropzone } from "@/lib/uploadthing"
import { UPDATE_USER } from "../action"

interface Props {
    user: User
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "required",
    }),
    image: z.string().min(1, {
        message: "required",
    }),
})

export const ProfileForm = ({ user }: Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name || "",
            image: user.image || ""
        },
    })

    const { mutate: updateUser, isPending } = useMutation({
        mutationFn: UPDATE_USER,
        onSuccess: (data) => {
            toast.success(data?.success, {
                id: "update-user-profile"
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-user-profile"
            })
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        toast.loading("Profile updating...", {
            id: "update-user-profile"
        })
        updateUser(values)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Profile</CardTitle>
                <CardDescription>Customize your profile information.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} disabled={isPending} />
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
                                    <FormLabel>Signature Image</FormLabel>
                                    <FormControl>
                                        {
                                            form.getValues("image") ? (
                                                <div className="relative mt-2">
                                                    <Image
                                                        alt="Upload"
                                                        width={120}
                                                        height={120}
                                                        className="object-contain rounded-md"
                                                        src={form.getValues("image")}
                                                    />
                                                    <Button className="absolute top-0 left-[100px]" variant="ghost" size="icon" onClick={() => form.setValue("image", "")} type="button" disabled={isPending}>
                                                        <Trash2 className="text-rose-500" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <UploadDropzone
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
                        <Button type="submit" disabled={isPending}>Update</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}