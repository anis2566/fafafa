import { Metadata } from "next";

import { VerifyUserForm } from "./_components/verify-form";


export const metadata: Metadata = {
    title: "BEC | Forgot Password",
    description: "Basic Education Care",
};

const ForgotPassword = () => {
    return <VerifyUserForm />
}

export default ForgotPassword;