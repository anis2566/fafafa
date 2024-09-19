"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { Class } from "@prisma/client"
import { useState } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { formatString } from "@/lib/utils"

export const Header = () => {
    const [className, setClassName] = useState<Class | undefined>()
    const [perPage, setPerPage] = useState<string>()

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

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

    const handleClassChange = (className: Class) => {
        setClassName(className)
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                className: className
            }
        }, { skipNull: true, skipEmptyString: true })

        router.push(url)
    }

    const handleReset = () => {
        router.push(pathname)
        setPerPage(undefined)
        setClassName(undefined)
    }


    return (
        <div className="space-y-2 shadow-sm shadow-primary p-2">
            <div className="flex items-center justify-between gap-x-3">
                <div className="flex items-center gap-x-3">
                    <Select
                        value={className || ""}
                        onValueChange={(value) => handleClassChange(value as Class)}
                    >
                        <SelectTrigger className="w-[130px]">
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
                    <Button
                        variant="destructive"
                        className="hidden md:flex"
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
            <Button
                variant="destructive"
                className="md:hidden"
                onClick={handleReset}
            >
                Reset
            </Button>
        </div>
    )
}