import { Metadata } from "next";

import { ContentLayout } from "../_components/content-layout"
import {AdmissionForm} from "./_components/admission-form"

export const metadata: Metadata = {
    title: "BEC | Admission",
    description: "Basic Education Care",
};

const Addmission = () => {
    return (
        <ContentLayout title="Addmission">
            <AdmissionForm />
        </ContentLayout>
    )
}

export default Addmission
