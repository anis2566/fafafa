import { Metadata } from "next";

import { ContentLayout } from "../../_components/content-layout";
import { TeacherForm } from "./_components/teacher-form";

export const metadata: Metadata = {
    title: "BEC | Teacher | Create",
    description: "Basic Education Care",
};

const CreateTeacher = () => {
    return (
        <ContentLayout title="Teacher">
            <TeacherForm />
        </ContentLayout>
    )
}

export default CreateTeacher
