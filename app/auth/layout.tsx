"use client"

import { Suspense, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { Loader } from "@/components/loader";

interface Props {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
    const { data: session } = useSession()

    useEffect(() => {
        if (session) {
            redirect("/")
        }
    }, [session])

    return (
        <section className="container min-h-screen w-full flex items-center justify-center py-4">
            <Suspense fallback={<Loader />}>
                {children}
            </Suspense>
        </section>
    )
}

export default AuthLayout