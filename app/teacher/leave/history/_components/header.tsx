"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const Header = () => {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const handlePerPageChange = (perPage: string) => {
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

    return (
        <div className="space-y-2 shadow-sm shadow-primary px-2 py-3">
            <div className="flex items-center justify-between gap-x-3">
                <Select onValueChange={(value) => handlePerPageChange(value)}>
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