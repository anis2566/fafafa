"use server";

import { db } from "@/lib/prisma";
import { Day, Expenses, PaymentStatus } from "@prisma/client";

// Helper to create date filters
const createDateFilter = (start: Date, end: Date) => ({
  updatedAt: {
    gte: start,
    lt: end,
  },
});

// Helper to format the week dates
const getWeekBounds = (date: Date) => {
  const weekStart = new Date(date);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return { weekStart, weekEnd };
};

// Main function to fetch dashboard data
export const GET_DASHBOARD_DATA = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { weekStart, weekEnd } = getWeekBounds(today);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);

  const todayFilter = createDateFilter(today, tomorrow);
  const weekFilter = createDateFilter(weekStart, weekEnd);
  const monthFilter = createDateFilter(monthStart, monthEnd);

  // Group queries to reduce database roundtrips
  const [
    todaySalary,
    weeklySalary,
    monthlySalary,
    todayExpense,
    todayAdvance,
    students,
    recentStudent,
  ] = await Promise.all([
    db.monthlyPayment.groupBy({
      by: ["class"],
      where: {
        updatedAt: { gte: today, lt: tomorrow },
        status: PaymentStatus.Paid,
      },
      _sum: { amount: true },
    }),
    db.monthlyPayment.groupBy({
      by: ["createdAt"],
      where: { ...weekFilter, status: PaymentStatus.Paid },
      _sum: { amount: true },
    }),
    db.monthlyPayment.groupBy({
      by: ["class"],
      where: { ...monthFilter, status: PaymentStatus.Paid },
      _sum: { amount: true },
    }),
    db.expense.groupBy({
      by: ["type"],
      where: todayFilter,
      _sum: { amount: true },
    }),
    db.teacherAdvance.aggregate({
      where: todayFilter,
      _sum: { amount: true },
    }),
    db.student.groupBy({
      by: ["createdAt"],
      where: { OR: [{ ...monthFilter }] },
      _count: { _all: true },
    }),
    db.student.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  // Weekly salary by day processing
  const weeklySalaryByDay = weeklySalary.reduce(
    (acc: { [key: string]: { day: Day; amount: number } }, item) => {
      const day = item.createdAt.toLocaleDateString("en-US", {
        weekday: "long",
      }) as Day;
      acc[day] = acc[day] || { day, amount: 0 };
      acc[day].amount += item._sum.amount ?? 0;
      return acc;
    },
    {}
  );

  // Format expense and advance data
  const formattedTodayExpense = todayExpense.map((item) => ({
    title: item.type as Expenses,
    amount: item._sum.amount ?? 0,
  }));
  const expenseArray = [
    ...formattedTodayExpense,
    { title: "Advance", amount: todayAdvance._sum.amount ?? 0 },
  ];

  // Students by day
  const daysInMonth = today.getDate();
  const studentsByDay = Array.from({ length: daysInMonth }, (_, i) => ({
    date: new Date(
      today.getFullYear(),
      today.getMonth(),
      i + 1
    ).toLocaleDateString("en-US"),
    count: 0,
  }));

  students.forEach((item) => {
    const date = item.createdAt.toLocaleDateString("en-US");
    const day = studentsByDay.find((d) => d.date === date);
    if (day) {
      day.count += item._count._all ?? 0; // Increment the count
    }
  });

  // Return or use data as needed (returning here for now)
  return {
    todaySalary,
    weeklySalaryData: Object.values(weeklySalaryByDay),
    monthlySalary,
    expenseArray,
    studentsByDay,
    recentStudent,
  };
};
