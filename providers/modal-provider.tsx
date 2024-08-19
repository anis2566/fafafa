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
        </>
    )
}