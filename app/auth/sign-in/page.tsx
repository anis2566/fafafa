import { Metadata } from "next";

import { SignInForm } from "./_components/sign-in-form";

export const metadata: Metadata = {
    title: "BEC | Sign In",
    description: "Basic Education Care",
};

const SignIn = () => {
    return <SignInForm />
}

export default SignIn
