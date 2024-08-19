"use client"

import { FaGoogle } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button"

// import { SIGN_IN_WITH_GOOGLE } from "../action";

export const SocialLogin = () => {
    const searchParams = useSearchParams()
    const callback = searchParams.get("callback")

    // const { mutate: signInUser, isPending } = useMutation({
    //     mutationFn: SIGN_IN_WITH_GOOGLE
    // })

    // const handleLogin = () => {
    //     signInUser({ callback })
    // }

    return (
        <div className="space-y-2">
            {/* <Button className="w-full flex items-center gap-x-3" variant="default" onClick={handleLogin} disabled={isPending}> */}
            <Button className="w-full flex items-center gap-x-3" variant="default">
                <FaGoogle />
                Continue with Google
            </Button>
        </div>
    )
}