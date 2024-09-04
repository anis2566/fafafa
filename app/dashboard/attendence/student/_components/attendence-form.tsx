"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Class } from "@prisma/client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Collapsible,
    CollapsibleContent,
} from "@/components/ui/collapsible"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { GET_BATCH_BY_CLASS } from "../action"
import { formatString, formatTime } from "@/lib/utils"

export const AttendenceForm = () => {
    const [className, setClassName] = useState<Class | null>(null)

    const { data: batches } = useQuery({
        queryKey: ["get-batches-by-class", className],
        queryFn: async () => {
            if (className) {
                const res = await GET_BATCH_BY_CLASS(className)
                return res.batches
            }
        },
        enabled: !!className
    })

    return (
        <div className="space-y-6">
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Search Batch</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select onValueChange={(value) => setClassName(value as Class)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Class" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                Object.values(Class).map((v, i) => (
                                    <SelectItem value={v} key={i}>{formatString(v)}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Collapsible open={batches && batches?.length > 0}>
                <CollapsibleContent>
                    <Card>
                        <CardHeader>
                            <CardTitle>Batches</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#SL</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        batches?.map((batch, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{batch.name}</TableCell>
                                                <TableCell>{formatTime(batch.time[0], "start")} - {formatTime(batch.time[batch.time.length - 1], "end")}</TableCell>
                                                <TableCell>
                                                    <Button asChild size="sm">
                                                        <Link href={`/dashboard/attendence/student/${batch.id}`}>Enter</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}