"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { useState } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export const Header = () => {
    const [perPage, setPerPage] = useState<string>("")
    const [sort, setSort] = useState<string>("")


    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSortChange = (sort: string) => {
        setSort(sort)
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                sort,
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
        setSort("")
        setPerPage("")
    }

    return (
        <div className="space-y-2 shadow-sm shadow-primary px-2 py-3">
            <div className="flex items-center justify-between gap-x-3">
                <div className="flex items-center gap-x-3">
                    <Select value={sort || ""} onValueChange={(value) => handleSortChange(value)}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desc">Newest</SelectItem>
                            <SelectItem value="asc">Oldest</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="destructive"
                        onClick={handleReset}
                        className="hidden md:flex"
                    >
                        Reset
                    </Button>
                </div>
                <Select value={perPage || ''} onValueChange={(value) => handlePerPageChange(value)}>
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
            <Button
                variant="destructive"
                onClick={handleReset}
                className="md:hidden"
            >
                Reset
            </Button>
        </div>
    )
}