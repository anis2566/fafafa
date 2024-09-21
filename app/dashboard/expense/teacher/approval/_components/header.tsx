"use client"

import { SearchIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { useEffect, useState } from "react"
import { Month, TeacherPaymentStatus } from "@prisma/client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { useDebounce } from "@/hooks/use-debounce"
import { FilterDrawer } from "./filter-drawer"


export const Header = () => {
    const [search, setSearch] = useState<string>("")
    const [id, setId] = useState<string>("")
    const [session, setSession] = useState<number>(new Date().getFullYear())
    const [month, setMonth] = useState<Month | undefined>()
    const [status, setStatus] = useState<TeacherPaymentStatus | undefined>()
    const [perPage, setPerPage] = useState<string>()
    const [open, setOpen] = useState<boolean>(false)

    const handleClose = () => {
        setOpen(false)
    }

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchValue = useDebounce(search, 500)
    const searchIdValue = useDebounce(id, 500)

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                name: searchValue
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [searchValue, router, pathname])

    useEffect(() => {
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                id: searchIdValue
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [searchIdValue, router, pathname])

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

    const handleStatusChange = (status: TeacherPaymentStatus) => {
        setStatus(status)
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                status,
            }
        }, { skipNull: true, skipEmptyString: true })

        router.push(url)
    }

    const handleReset = () => {
        router.push(pathname)
        setSearch("")
        setId("")
        setSession(new Date().getFullYear())
        setPerPage(undefined)
        setMonth(undefined)
        setStatus(undefined)
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
                    <div>
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="number"
                            placeholder="Search by id..."
                            className="w-full appearance-none bg-background pl-8 shadow-none"
                            onChange={(e) => setId(e.target.value)}
                            value={id}
                        />
                    </div>
                    <div>
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by name..."
                            className="w-full appearance-none bg-background pl-8 shadow-none"
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>
                    <Select value={status || ""} onValueChange={(value) => handleStatusChange(value as TeacherPaymentStatus)}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                Object.values(TeacherPaymentStatus).map((v, i) => (
                                    <SelectItem value={v} key={i}>{v}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <Button
                        variant="destructive"
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