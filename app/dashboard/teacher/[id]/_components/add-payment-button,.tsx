"use client"

import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useTeacherPayment } from "@/hooks/use-teacher-payment";

interface Props {
    id: string;
}

export const AddPaymentButton = ({ id }: Props) => {
    const { onOpen } = useTeacherPayment()

    return (
        <Button className="flex items-center gap-x-2 bg-amber-600 hover:bg-amber-700" onClick={() => onOpen(id)}>
            <PlusCircle className="w-5 h-5" />
            Add Payment
        </Button>
    )
}