import { Status } from "@prisma/client";
import {
  Users,
  LayoutGrid,
  LucideIcon,
  List,
  Radio,
  Layers3,
  CalendarDays,
  UserCog,
  DollarSign,
  HandCoins,
  PlusCircle,
  NotebookPen,
  UserCheck,
  UserX,
  School,
  BookOpen,
  UserRoundPen,
  Coins,
  Package,
  House,
  TrendingUp,
  Warehouse,
  Wallet,
  CalendarClock,
  History,
  LogOut,
  FilePen,
  Waypoints,
  Landmark,
  Megaphone,
  GitFork,
  MessageSquareMore,
  CircleCheckBig,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

type MenuTeacher = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
  status: Status;
};

type GroupTeacher = {
  groupLabel: string;
  menus: MenuTeacher[];
  status: Status;
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname === "/dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Attendence",
      menus: [
        {
          href: "/dashboard/attendence/student",
          label: "Student",
          active: pathname.includes("/dashboard/attendence/student"),
          icon: CalendarClock,
          submenus: [
            {
              href: "/dashboard/attendence/student/create",
              label: "Create",
              active: pathname === "/dashboard/attendence/student/create",
              icon: PlusCircle,
            },
            {
              href: "/dashboard/attendence/student",
              label: "Attendence",
              active: pathname === "/dashboard/attendence/student",
              icon: CalendarDays,
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Students Management",
      menus: [
        {
          href: "/dashboard/admission",
          label: "Admission",
          active: pathname.includes("/dashboard/admission"),
          icon: NotebookPen,
          submenus: [],
        },
        {
          href: "",
          label: "Student",
          active: pathname.includes("/dashboard/student"),
          icon: Users,
          submenus: [
            {
              href: "/dashboard/student",
              label: "Active",
              active: pathname === "/dashboard/student",
              icon: UserCheck,
            },
            {
              href: "/dashboard/student/absent",
              label: "Absent",
              active: pathname === "/dashboard/student/absent",
              icon: UserX,
            },
          ],
        },
        {
          href: "/dashboard/subject",
          label: "Subject",
          active: pathname.includes("/dashboard/subject"),
          icon: BookOpen,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Reports",
      menus: [
        {
          href: "/dashboard/report/daily",
          label: "Daily Report",
          active: pathname.includes("/dashboard/report/daily"),
          icon: CalendarDays,
          submenus: [],
        },
        {
          href: "",
          label: "Income",
          active: pathname.includes("/dashboard/report/income"),
          icon: HandCoins,
          submenus: [
            {
              href: "/dashboard/report/income/salary",
              label: "Salary",
              active: pathname === "/dashboard/report/income/salary",
              icon: CalendarDays,
            },
            {
              href: "/dashboard/report/income/others",
              label: "Others",
              active: pathname === "/dashboard/report/income/others",
              icon: GitFork,
            },
            {
              href: "/dashboard/report/income",
              label: "Overview",
              active: pathname === "/dashboard/report/income",
              icon: TrendingUp,
            },
          ],
        },
        {
          href: "",
          label: "Expense",
          active: pathname.includes("/dashboard/report/expense"),
          icon: Coins,
          submenus: [
            {
              href: "/dashboard/report/expense/teacher",
              label: "Teacher Bill",
              active: pathname === "/dashboard/report/expense/teacher",
              icon: UserRoundPen,
            },
            {
              href: "/dashboard/report/expense/house-rent",
              label: "House Rent",
              active: pathname === "/dashboard/report/expense/house-rent",
              icon: House,
            },
            {
              href: "/dashboard/report/expense/utility",
              label: "Utility",
              active: pathname === "/dashboard/report/expense/utility",
              icon: Package,
            },
            {
              href: "/dashboard/report/expense",
              label: "Overview",
              active: pathname === "/dashboard/report/expense",
              icon: TrendingUp,
            },
          ],
        },
        {
          href: "/dashboard/report",
          label: "Final",
          active: pathname === "/dashboard/report",
          icon: Wallet,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Expense",
      menus: [
        {
          href: "",
          label: "Teacher Bill",
          active: pathname.includes("/dashboard/expense/teacher"),
          icon: UserRoundPen,
          submenus: [
            {
              href: "/dashboard/expense/teacher/create",
              label: "Create",
              active: pathname === "/dashboard/expense/teacher/create",
              icon: PlusCircle,
            },
            {
              href: "/dashboard/expense/teacher",
              label: "List",
              active: pathname === "/dashboard/expense/teacher",
              icon: List,
            },
            {
              href: "/dashboard/expense/teacher/approval",
              label: "Approval",
              active: pathname === "/dashboard/expense/teacher/approval",
              icon: CircleCheckBig,
            },
          ],
        },
        {
          href: "",
          label: "House Rent",
          active: pathname.includes("/dashboard/expense/house-rent"),
          icon: School,
          submenus: [
            {
              href: "/dashboard/expense/house-rent/create",
              label: "Create",
              active: pathname === "/dashboard/expense/house-rent/create",
              icon: PlusCircle,
            },
            {
              href: "/dashboard/expense/house-rent",
              label: "List",
              active: pathname === "/dashboard/expense/house-rent",
              icon: List,
            },
          ],
        },
        {
          href: "",
          label: "Utility",
          active: pathname.includes("/dashboard/expense/utility"),
          icon: Package,
          submenus: [
            {
              href: "/dashboard/expense/utility/create",
              label: "Create",
              active: pathname === "/dashboard/expense/utility/create",
              icon: PlusCircle,
            },
            {
              href: "/dashboard/expense/utility",
              label: "List",
              active: pathname === "/dashboard/expense/utility",
              icon: List,
            },
          ],
        },
        {
          href: "",
          label: "Advance",
          active: pathname.includes("/dashboard/expense/advance"),
          icon: HandCoins,
          submenus: [
            {
              href: "/dashboard/expense/advance/request",
              label: "Request",
              active: pathname === "/dashboard/expense/advance/request",
              icon: Radio,
            },
            {
              href: "/dashboard/expense/advance",
              label: "History",
              active: pathname === "/dashboard/expense/advance",
              icon: History,
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Teacher Management",
      menus: [
        {
          href: "",
          label: "Teacher",
          active: pathname.includes("/dashboard/teacher"),
          icon: UserRoundPen,
          submenus: [
            {
              href: "/dashboard/teacher/create",
              label: "New",
              active: pathname === "/dashboard/teacher/create",
              icon: PlusCircle,
            },
            {
              href: "/dashboard/teacher",
              label: "List",
              active: pathname === "/dashboard/teacher",
              icon: List,
            },
          ],
        },
        {
          href: "",
          label: "Leave Management",
          active: pathname.includes("/dashboard/teacher/leave"),
          icon: LogOut,
          submenus: [
            {
              href: "/dashboard/teacher/leave/apply",
              label: "Apply",
              active: pathname === "/dashboard/teacher/leave/apply",
              icon: FilePen,
            },
            {
              href: "/dashboard/teacher/leave",
              label: "History",
              active: pathname === "/dashboard/teacher/leave",
              icon: History,
            },
          ],
        },
        {
          href: "/dashboard/teacher/request",
          label: "Request",
          active: pathname.includes("/dashboard/teacher/request"),
          icon: Radio,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Room & House Management",
      menus: [
        {
          href: "",
          label: "House",
          active: pathname.includes("/dashboard/house"),
          icon: School,
          submenus: [
            {
              href: "/dashboard/house/create",
              label: "New",
              active: pathname === "/dashboard/house/create",
              icon: PlusCircle,
            },
            {
              href: "/dashboard/house",
              label: "List",
              active: pathname === "/dashboard/house",
              icon: List,
            },
          ],
        },
        {
          href: "",
          label: "Room",
          active: pathname.includes("/dashboard/room"),
          icon: Warehouse,
          submenus: [
            {
              href: "/dashboard/room/create",
              label: "New",
              active: pathname === "/dashboard/room/create",
              icon: PlusCircle,
            },
            {
              href: "/dashboard/room",
              label: "List",
              active: pathname === "/dashboard/room",
              icon: List,
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Batch Management",
      menus: [
        {
          href: "",
          label: "Batch",
          active: pathname.includes("/dashboard/batch"),
          icon: Layers3,
          submenus: [
            {
              href: "/dashboard/batch/create",
              label: "New",
              active: pathname === "/dashboard/batch/create",
              icon: PlusCircle,
            },
            {
              href: "/dashboard/batch",
              label: "List",
              active: pathname === "/dashboard/batch",
              icon: List,
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Notice",
      menus: [
        {
          href: "",
          label: "Notice",
          active: pathname.includes("/dashboard/notice"),
          icon: Megaphone,
          submenus: [
            {
              href: "/dashboard/notice/create",
              label: "New",
              active: pathname === "/dashboard/notice/create",
              icon: PlusCircle,
            },
            {
              href: "/dashboard/notice",
              label: "List",
              active: pathname === "/dashboard/notice",
              icon: List,
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Discussion",
      menus: [
        {
          href: "/dashboard/chat",
          label: "Chat",
          active: pathname.includes("/dashboard/chat"),
          icon: MessageSquareMore,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Income",
      menus: [
        {
          href: "/dashboard/income/new",
          label: "New Salary",
          active: pathname.includes("/dashboard/income/new"),
          icon: PlusCircle,
          submenus: [],
        },
        {
          href: "/dashboard/income/others",
          label: "Others",
          active: pathname.includes("/dashboard/income/others"),
          icon: PlusCircle,
          submenus: [],
        },
        {
          href: "",
          label: "History",
          active: pathname.includes("/dashboard/income/history"),
          icon: HandCoins,
          submenus: [
            {
              href: "/dashboard/income/history/admission",
              label: "Admission",
              active: pathname === "/dashboard/income/history/admission",
              icon: NotebookPen,
            },
            {
              href: "/dashboard/income/history/monthly",
              label: "Salary",
              active: pathname === "/dashboard/income/history/monthly",
              icon: CalendarDays,
            },
            {
              href: "/dashboard/income/history/others",
              label: "Others",
              active: pathname === "/dashboard/income/history/others",
              icon: Package,
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Fee",
      menus: [
        {
          href: "/dashboard/fee/admission",
          label: "Admission Fee",
          active: pathname.includes("/dashboard/fee/admission"),
          icon: DollarSign,
          submenus: [],
        },
        {
          href: "/dashboard/fee/monthly",
          label: "Monthly Fee",
          active: pathname.includes("/dashboard/fee/monthly"),
          icon: CalendarDays,
          submenus: [],
        },
      ],
    },
  ];
}

export function getMenuListTeacher(pathname: string): GroupTeacher[] {
  return [
    {
      groupLabel: "",
      status: Status.Active,
      menus: [
        {
          href: "/teacher",
          label: "Dashboard",
          active: pathname === "/teacher",
          icon: LayoutGrid,
          submenus: [],
          status: Status.Active,
        },
      ],
    },
    {
      groupLabel: "",
      status: Status.Active,
      menus: [
        {
          href: "",
          label: "Class",
          active: pathname.includes("/teacher/class"),
          icon: BookOpen,
          submenus: [
            {
              href: "/teacher/class",
              label: "Regualr",
              active: pathname === "/teacher/class",
              icon: CalendarDays,
            },
            {
              href: "/teacher/class/proxy",
              label: "Proxy",
              active: pathname === "/teacher/class/proxy",
              icon: Waypoints,
            },
          ],
          status: Status.Active,
        },
        {
          href: "",
          label: "Leave",
          active: pathname.includes("/teacher/leave"),
          icon: LogOut,
          submenus: [
            {
              href: "/teacher/leave/apply",
              label: "Apply",
              active: pathname === "/teacher/leave/apply",
              icon: FilePen,
            },
            {
              href: "/teacher/leave/history",
              label: "History",
              active: pathname === "/teacher/leave/history",
              icon: History,
            },
          ],
          status: Status.Active,
        },
        {
          href: "/teacher/payment",
          label: "Payment",
          active: pathname.includes("/teacher/payment"),
          icon: HandCoins,
          submenus: [],
          status: Status.Active,
        },
        {
          href: "/teacher/account",
          label: "Account",
          active: pathname.includes("/teacher/account"),
          icon: Landmark,
          submenus: [],
          status: Status.Active,
        },
        {
          href: "/teacher/profile",
          label: "Profile",
          active: pathname.includes("/teacher/profile"),
          icon: UserCog,
          submenus: [],
          status: Status.Active,
        },
      ],
    },
  ];
}
