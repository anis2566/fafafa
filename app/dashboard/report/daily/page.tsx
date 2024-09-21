import Link from "next/link";
import { Metadata } from "next";
import { PaymentStatus, TransactionStatus } from "@prisma/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContentLayout } from "../../_components/content-layout";
import { db } from "@/lib/prisma";
import { formatString } from "@/lib/utils";

export const metadata: Metadata = {
  title: "BEC | Report | Daily",
  description: "Basic Education Care",
};

const DailyReport = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayFilter = {
    createdAt: {
      gte: today,
      lt: tomorrow,
    },
  };

  const [todaySalary, todayAdmission, todayHouseRent, todayUtility, todayTeacherAdvance] = await Promise.all([
    db.monthlyPayment.aggregate({
      where: {
        updatedAt: {
          gte: today,
          lt: tomorrow,
        },
        status: PaymentStatus.Paid,
      },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    db.admissionPayment.aggregate({
      where: {
        OR: [
          { ...todayFilter, status: PaymentStatus.Paid },
          { updatedAt: { gte: today, lt: tomorrow }, status: PaymentStatus.Paid },
        ],
      },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    db.housePayment.aggregate({
      where: {
        OR: [
          { ...todayFilter },
          { updatedAt: { gte: today, lt: tomorrow } },
        ],
      },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    db.expense.groupBy({
      by: ["type"],
      where: {
        OR: [
          { ...todayFilter },
          { updatedAt: { gte: today, lt: tomorrow } },
        ],
      },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    db.teacherAdvance.aggregate({
      where: {
        OR: [
          { ...todayFilter, status: TransactionStatus.Approve },
          { updatedAt: { gte: today, lt: tomorrow }, status: TransactionStatus.Approve },
        ],
      },
      _sum: { amount: true },
      _count: { _all: true },
    }),
  ]);

  const totalIncome = (todaySalary._sum.amount ?? 0) + (todayAdmission._sum.amount ?? 0);

  const totalExpenses =
    (todayHouseRent._sum.amount ?? 0) +
    todayUtility.reduce((acc, item) => acc + (item._sum.amount ?? 0), 0) +
    (todayTeacherAdvance._sum.amount ?? 0);

  return (
    <ContentLayout title="Report">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Daily Report</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4 space-y-8">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Income</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-slate-100 dark:bg-background/60">Type</TableHead>
                  <TableHead className="bg-slate-100 dark:bg-background/60">Unit</TableHead>
                  <TableHead className="bg-slate-100 dark:bg-background/60">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="py-3">Total Salary</TableCell>
                  <TableCell className="py-3">{todaySalary._count._all}</TableCell>
                  <TableCell className="py-3">{todaySalary._sum.amount ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-3">Total Admission Fee</TableCell>
                  <TableCell className="py-3">{todayAdmission._count._all}</TableCell>
                  <TableCell className="py-3">{todayAdmission._sum.amount ?? 0}</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="bg-slate-100 dark:bg-background/60"></TableCell>
                  <TableCell className="text-md font-semibold bg-slate-100 dark:bg-background/60">Sub Total</TableCell>
                  <TableCell className="bg-slate-100 dark:bg-background/60">{totalIncome}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Expense</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-slate-100 dark:bg-background/60">Type</TableHead>
                  <TableHead className="bg-slate-100 dark:bg-background/60">Unit</TableHead>
                  <TableHead className="bg-slate-100 dark:bg-background/60">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="py-3">Teacher Advance</TableCell>
                  <TableCell className="py-3">{todayTeacherAdvance._count._all}</TableCell>
                  <TableCell className="py-3">{todayTeacherAdvance._sum.amount ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-3">House Rent Payment</TableCell>
                  <TableCell className="py-3">{todayHouseRent._count._all}</TableCell>
                  <TableCell className="py-3">{todayHouseRent._sum.amount ?? 0}</TableCell>
                </TableRow>
                {todayUtility.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="py-3">{formatString(item.type)}</TableCell>
                    <TableCell className="py-3">{item._count._all ?? 0}</TableCell>
                    <TableCell className="py-3">{item._sum.amount ?? 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="bg-slate-100 dark:bg-background/60"></TableCell>
                  <TableCell className="text-md font-semibold bg-slate-100 dark:bg-background/60">Sub Total</TableCell>
                  <TableCell className="bg-slate-100 dark:bg-background/60">{totalExpenses}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-slate-100 dark:bg-background/60">Type</TableHead>
                  <TableHead className="bg-slate-100 dark:bg-background/60">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="py-3">Total Income</TableCell>
                  <TableCell className="py-3">{totalIncome}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-3">Total Expense</TableCell>
                  <TableCell className="py-3">{totalExpenses}</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="text-md font-semibold bg-slate-100 dark:bg-background/60">Balance</TableCell>
                  <TableCell className="bg-slate-100 dark:bg-background/60">{totalIncome - totalExpenses}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
};

export default DailyReport;
