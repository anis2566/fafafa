import { Metadata } from "next";

import { VerifyForm } from "./_components/verify-form";

export const metadata: Metadata = {
    title: "BEC | Verify Email",
    description: "Basic Education Care",
};


interface Props {
    params: {
        id: string;
    }
}

const Verify = ({ params: { id } }: Props) => {
    return <VerifyForm id={id} />
}

export default Verify