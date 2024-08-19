import { Suspense } from "react"
import { Metadata } from "next"

import { SuccessCard } from "./_components/success-card"
import { Loader } from "@/components/loader"

export const metadata: Metadata = {
  title: "APBn Scouts | Payment Success",
  description: "Apbn scouts group",
}

const PaymentSuccess = () => {
  return (
    <Suspense fallback={<Loader />}>
      <SuccessCard />
    </Suspense>
  )
}

export default PaymentSuccess