import { Metadata } from "next";

import { SignUpForm } from "./_components/sign-up-form";

export const metadata: Metadata = {
    title: "BEC | Sign Up",
    description: "Basic Education Care",
};


const SignUp = () => {
    return <SignUpForm />
}

export default SignUp