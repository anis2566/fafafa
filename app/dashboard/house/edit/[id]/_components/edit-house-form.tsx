"use client"

import { House, HouseStatus } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
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

import { HouseSchema } from "../../../create/schema"
import { UPDATE_HOUSE } from "../action"

interface Props {
    house: House
}

export const EditHouseForm = ({ house }: Props) => {

    const router = useRouter()

    const { mutate: updateHouse, isPending } = useMutation({
        mutationFn: UPDATE_HOUSE,
        onSuccess: (data) => {
            form.reset()
            toast.success(data.success, {
                id: "update-house"
            });
            router.push("/dashboard/house")
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-house"
            });
        }
    })

    const form = useForm<z.infer<typeof HouseSchema>>({
        resolver: zodResolver(HouseSchema),
        defaultValues: {
            name: house.name || undefined,
            roomCount: house.roomCount || undefined,
            status: house.status || undefined,
        },
    })

    function onSubmit(values: z.infer<typeof HouseSchema>) {
        toast.loading("House updating...", {
            id: "update-house"
        });
        updateHouse({ id: house.id, values })
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Edit House Form</CardTitle>
                <CardDescription>Customize house information.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>House Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter house name..." {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roomCount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>No of Rooms</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter room number..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(HouseStatus).map((v, i) => (
                                                    <SelectItem value={v} key={i}>{v}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
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