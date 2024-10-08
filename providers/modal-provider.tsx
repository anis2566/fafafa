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
import { UpdateTeacherPaymentModal } from "@/app/dashboard/teacher/[id]/_components/edit-payment-modal"
import { CallModal } from "@/app/dashboard/attendence/student/[id]/_components/call-modal"
import { UpdateNumberModal } from "@/app/dashboard/attendence/student/[id]/_components/update-modal"
import { StudentLeftModal } from "@/app/dashboard/attendence/student/[id]/_components/left-modal"
import { DeleteBatchModal } from "@/app/dashboard/batch/_components/delete-modal"
import { UpdateTeacherStatusModal } from "@/app/dashboard/teacher/request/_components/status-modal"
import { DeleteTeacherRequestModal } from "@/app/dashboard/teacher/request/_components/delete-modal"
import { AddLeaveClassModal } from "@/app/dashboard/teacher/leave/[id]/_components/add-leave-modal"
import { UpdateLeaveClassModal } from "@/app/dashboard/teacher/leave/[id]/_components/update-teacher-modal"
import { UpdateLeaveStatussModal } from "@/app/dashboard/teacher/leave/_components/status-modal"
import { DeleteNoticeModal } from "@/app/dashboard/notice/_components/delete-modal"
import { AddClassModal } from "@/app/dashboard/batch/[id]/_components/add-class-modal"
import { UpdateAdmissionPaymentModal } from "@/app/dashboard/income/history/admission/_components/update-modal"
import { UpdateTeacherBillStatussModal } from "@/app/dashboard/expense/teacher/approval/_components/status-modal"
import { UpdateAdvanceStatussModal } from "@/app/dashboard/expense/advance/approval/_components/status-modal"

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
            <UpdateTeacherPaymentModal />

            <CallModal />
            <UpdateNumberModal />
            <StudentLeftModal />
            <DeleteBatchModal />
            <UpdateTeacherStatusModal />
            <DeleteTeacherRequestModal />
            <AddLeaveClassModal />
            <UpdateLeaveClassModal />
            <UpdateLeaveStatussModal />
            <DeleteNoticeModal />
            <AddClassModal />
            <UpdateTeacherBillStatussModal />
            <UpdateAdvanceStatussModal />
        </>
    )
}