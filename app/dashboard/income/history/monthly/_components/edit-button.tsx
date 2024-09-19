"use client"

import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

export const EditButton = () => {
    return (
        <Button variant="outline" className="flex items-center gap-x-2" asChild>
            <Edit className="w-5 h-5" />
            Edit
        </Button>
    )
}