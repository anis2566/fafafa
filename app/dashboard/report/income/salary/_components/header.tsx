"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { Class } from "@prisma/client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"



export const Header = () => {
    const [value, setValue] = useState<Class>(Class.Two)
    const [sesseionValue, setSessionValue] = useState(new Date().getFullYear().toString())

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleClassChange = (className: Class) => {
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

    const handleSessionChange = (session: string) => {
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

    return (
        <div className="space-y-2 shadow-sm shadow-primary px-2 py-3">
            <div className="flex items-center justify-between gap-x-3">
                <div className="flex items-center gap-x-3">
                    <Select value={sesseionValue} onValueChange={(value) => {
                        handleSessionChange(value)
                        setSessionValue(value)
                    }}>
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
                    <Select value={value} onValueChange={(value) => {
                        handleClassChange(value as Class)
                        setValue(value as Class)
                    }}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Class" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                Object.values(Class).map((v, i) => (
                                    <SelectItem value={v} key={i}>{v}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        className="hidden md:flex text-rose-500"
                        onClick={() => {
                            router.push(pathname)
                            setValue(Class.Two)
                            setSessionValue(new Date().getFullYear().toString())
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    )
}