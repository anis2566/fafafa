"use client"

import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import { usePassword } from "@/hooks/use-password"
import { VERIFY_FORGOT_PASSWORD } from "../action"

interface Props {
    id: string;
}

export const VerifyForm = ({ id }: Props) => {
    const [value, setValue] = useState<string>("")

    const { onOpen } = usePassword()

    const { mutate: verifyUser, isPending } = useMutation({
        mutationFn: VERIFY_FORGOT_PASSWORD,
        onSuccess: async (data) => {
            toast.success(data?.success, {
                id: "verify-user"
            })
            if (data?.id) {
                onOpen(data?.id)
            }
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "verify-user"
            })
        }
    })

    const handleComplete = () => {
        toast.loading("Verifing...", {
            id: "verify-user"
        })
        verifyUser({ id, code: value })
    }

    return (
        <div className="space-y-4">
            <h4 className="text-center  text-muted-foreground">An email has been sent to your inbox. Checkout and enter the verification code to confirm.</h4>
            <div className="space-y-2 mx-auto flex justify-center">
                <InputOTP
                    maxLength={6}
                    value={value}
                    onChange={(value) => setValue(value)}
                    onComplete={handleComplete}
                    disabled={isPending}
                    autoFocus
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSeparator />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSeparator />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </div>
        </div>
    )
}