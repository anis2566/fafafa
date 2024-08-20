"use client"

import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useAddStudent } from "@/hooks/use-student"
import { Class } from "@prisma/client";

interface Props {
    id: string;
    className: Class;
}

export const AddClassButton = ({ id, className }: Props) => {
    const { onOpen } = useAddStudent()

    return (
        <Button className="mt-4 flex items-center gap-x-2 bg-amber-500 hover:bg-amber-600" onClick={() => onOpen(id, className)}>
            <PlusCircle className="w-5 h-5" />
            Add Class
        </Button>
    )
}