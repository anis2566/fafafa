// ADMISSION FEE
import { PasswordModal } from "@/app/auth/forgot-password/[id]/_components/password-modal"
import { AssignFeeModal } from "@/app/dashboard/fee/admission/_components/create-fee-modal"
import { DeleteFeeModal } from "@/app/dashboard/fee/admission/_components/delete-fee-modal"
import { UpdateFeeModal } from "@/app/dashboard/fee/admission/_components/update-fee-modal"

// MONTHLY FEE
import { AssignMonthlyFeeModal } from "@/app/dashboard/fee/monthly/_components/create-fee-modal"
import { DeleteMonthlyFeeModal } from "@/app/dashboard/fee/monthly/_components/delete-fee-modal"

// PASSWORD
import { UpdateMonthlyFeeModal } from "@/app/dashboard/fee/monthly/_components/update-fee-modal"
import { DeleteRoomModal } from "@/app/dashboard/room/_components/delete-modal"

// ROOM
import { UpdateAdmissionPaymentModal } from "@/app/dashboard/salary/admission/_components/update-modal"

// STUDNET
import { AddStudentModal } from "@/app/dashboard/batch/[id]/_components/add-student-modal"
import { RemoveStudentModal } from "@/app/dashboard/batch/[id]/_components/remove-student-modal"

// SUBJECT
import { AddSubjectModal } from "@/app/dashboard/subject/_components/add-subject-modal"
import { EditSubjectModal } from "@/app/dashboard/subject/_components/edit-subject-modal"
import { DeleteSubjectModal } from "@/app/dashboard/subject/_components/delete-subject-modal"

// CLASS
import { RemoveClassModal } from "@/app/dashboard/batch/[id]/_components/remove-class-modal"

// TEACHER PAYMENT
import { AddTeacherPaymentModal } from "@/app/dashboard/teacher/[id]/_components/add-payment-modal"

// HOUSE
import { DeleteHouseModal } from "@/app/dashboard/house/_components/delete-modal"

export const ModalProvider = () => {
    return (
        <>
            {/* ADMISSION FEE */}
            <AssignFeeModal />
            <UpdateFeeModal />
            <DeleteFeeModal />
            <UpdateAdmissionPaymentModal />

            {/* MONTHLY FEE */}
            <AssignMonthlyFeeModal />
            <UpdateMonthlyFeeModal />
            <DeleteMonthlyFeeModal />

            {/* PASSWORD */}
            <PasswordModal />

            {/* ROOM */}
            <DeleteRoomModal />

            {/* HOUSE */}
            <DeleteHouseModal />

            {/* STUDENT */}
            <AddStudentModal />
            <RemoveStudentModal />

            {/* SUBJECT */}
            <AddSubjectModal />
            <EditSubjectModal />
            <DeleteSubjectModal />

            {/* CLASS */}
            <RemoveClassModal />

            {/* TEACHER PAYMENT */}
            <AddTeacherPaymentModal />

        </>
    )
}