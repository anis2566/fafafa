"use client"

import { Student } from "@prisma/client"
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { CreditCardIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { PAY_WITH_CASH } from "../action";
import { PAY_WITH_MOBILE_BANKING } from "@/services/payment-service";

interface Props {
    student: Student;
}

export const PaymentForm = ({ student }: Props) => {
    const [method, setMethod] = useState<string>("cash")

    const { mutate: payWithCash, isPending } = useMutation({
        mutationFn: PAY_WITH_CASH,
        onSuccess: (data) => {
            alert(data?.success)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const { mutate: payWithMobileBanking, isPending: isLoading } = useMutation({
        mutationFn: PAY_WITH_MOBILE_BANKING,
        onSuccess: (data) => {
            if (data?.url) {
                window.location.replace(data?.url)
            }
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const handleClick = () => {
        if (method === "cash") {
            payWithCash(student.id)
        } else {
            payWithMobileBanking({ amount: String(student.admissionFee + student.monthlyFee), studentId: student.id })
        }
    }

    return (
        <div className="h-[80vh] w-full flex items-center justify-center">
            <Card className="w-full max-w-md p-6 grid gap-6">
                <div className="flex items-center justify-between">
                    <CardTitle>Payment</CardTitle>
                    <CreditCardIcon className="w-8 h-8 text-muted-foreground" />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-x-3">
                        <Avatar>
                            <AvatarImage src={student.imageUrl} alt={student.name} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h1>{student.name}</h1>
                    </div>
                    <h1 className="text-lg">Total Due: <span className="text-primary text-2xl font-semibold">{student.admissionFee + student.monthlyFee}</span></h1>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <RadioGroup defaultValue={method} className="flex items-center gap-4" onValueChange={(value) => setMethod(value)} disabled={isPending || isLoading}>
                        <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                            <RadioGroupItem id="cash" value="cash" onChange={() => setMethod("cash")} />
                            Cash
                        </Label>
                        <Label htmlFor="mbanking" className="flex items-center gap-2 cursor-pointer">
                            <RadioGroupItem id="mbanking" value="mbanking" />
                            Mobile Banking
                        </Label>
                    </RadioGroup>
                </div>

                <Button type="submit" className="w-full" onClick={handleClick} disabled={isPending || isLoading}>
                    Pay Now
                </Button>
            </Card>
        </div>
    )
}