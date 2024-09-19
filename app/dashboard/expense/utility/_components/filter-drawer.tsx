"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { Expenses, Month } from "@prisma/client"
import { useState } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { formatString } from "@/lib/utils"

interface Props {
    open: boolean;
    handleClose: () => void;
}

export const FilterDrawer = ({ open, handleClose }: Props) => {
    const [session, setSession] = useState<number>(new Date().getFullYear())
    const [month, setMonth] = useState<Month | undefined>()
    const [type, setType] = useState<Expenses | undefined>()
    const [perPage, setPerPage] = useState<string>()

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSessionChange = (session: string) => {
        setSession(parseInt(session))
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                session
            }
        }, { skipNull: true, skipEmptyString: true })

        router.push(url)
    }

    const handleMonthChange = (month: Month) => {
        setMonth(month)
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                month,
            }
        }, { skipNull: true, skipEmptyString: true })

        router.push(url)
    }

    const handleTypeChange = (type: Expenses) => {
        setType(type)
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                type
            }
        }, { skipNull: true, skipEmptyString: true })

        router.push(url)
    }

    const handlePerPageChange = (perPage: string) => {
        setPerPage(perPage)
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                perPage,
            }
        }, { skipNull: true, skipEmptyString: true })
        router.push(url)
    }

    const handleReset = () => {
        handleClose()
        router.push(pathname)
        setType(undefined)
        setSession(new Date().getFullYear())
        setPerPage(undefined)
        setMonth(undefined)
    }


    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent>
                <SheetHeader className="space-y-0">
                    <SheetTitle className="text-start">Filter</SheetTitle>
                    <SheetDescription className="text-start">
                        Filter search result
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-3 mt-4">
                    <Select value={session.toString()} onValueChange={(value) => handleSessionChange(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Session" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                ["2020", "2021", "2022", "2023", "2024", "2025", "2026"].map((v, i) => (
                                    <SelectItem value={v} key={i}>{v}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <Select value={month || ""} onValueChange={(value) => handleMonthChange(value as Month)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                Object.values(Month).map((v, i) => (
                                    <SelectItem value={v} key={i}>{v}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <Select value={type || ""} onValueChange={(value) => handleTypeChange(value as Expenses)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                Object.values(Expenses).map((v, i) => (
                                    <SelectItem value={v} key={i}>{formatString(v)}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <Select value={perPage || ""} onValueChange={(value) => handlePerPageChange(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Limit" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                ["5", "10", "20", "50", "100", "200"].map((v, i) => (
                                    <SelectItem value={v} key={i}>{v}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <Button
                        className="bg-rose-500 text-white"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </div>
            </SheetContent>
        </Sheet>

    )
}