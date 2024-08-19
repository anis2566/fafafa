import { Metadata } from "next";

import { VerifyForm } from "./_components/verify-form";

export const metadata: Metadata = {
    title: "BEC| Verify",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    }
}

const VerifyPage = ({ params: { id } }: Props) => {
    return <VerifyForm id={id} />
}

export default VerifyPage