"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { Expenses, Month } from "@prisma/client"
import { useState } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatString } from "@/lib/utils"
import { FilterDrawer } from "./filter-drawer"

export const Header = () => {
    const [session, setSession] = useState<number>(new Date().getFullYear())
    const [month, setMonth] = useState<Month | undefined>()
    const [type, setType] = useState<Expenses | undefined>()
    const [perPage, setPerPage] = useState<string>()
    const [open, setOpen] = useState<boolean>(false)

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleClose = () => {
        setOpen(false)
    }

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
        router.push(pathname)
        setType(undefined)
        setSession(new Date().getFullYear())
        setPerPage(undefined)
        setMonth(undefined)
    }

    return (
        <div className="space-y-2 shadow-sm shadow-primary px-2 py-3">
            <FilterDrawer open={open} handleClose={handleClose} />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild className="md:hidden">
                        <Button onClick={() => setOpen(true)}>Filter</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Filter result</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div className="hidden md:flex items-center justify-between gap-x-3">
                <div className="flex items-center gap-x-3">
                    <Select value={session.toString()} onValueChange={(value) => handleSessionChange(value)}>
                        <SelectTrigger className="w-[130px]">
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
                        <SelectTrigger className="w-[130px]">
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
                        <SelectTrigger className="w-[130px]">
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
                    <Button
                        variant="outline"
                        className="hidden md:flex text-rose-500"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </div>
                <Select value={perPage || ""} onValueChange={(value) => handlePerPageChange(value)}>
                    <SelectTrigger className="w-[130px]">
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
            </div>
        </div>
    )
}