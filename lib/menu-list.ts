import { Status } from "@prisma/client";
import {
  Users,
  Settings,
  LayoutGrid,
  FileSignature,
  LucideIcon,
  Pen,
  List,
  Radio,
  CircleCheck,
  BadgeX,
  BadgePercent,
  CircleDollarSign,
  Layers3,
  Medal,
  RefreshCcwDot,
  Ban,
  File,
  CalendarDays,
  Calendar,
  UserCog,
  GitCompareArrows,
  SquareStack,
  MicVocal,
  GalleryVertical,
  MessageSquare,
  Bell,
  FileCheck,
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
              label: "Create",
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
              label: "Create",
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
              label: "Create",
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
              label: "Create",
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
      groupLabel: "Payments",
      menus: [
        {
          href: "/dashboard/salary/new",
          label: "New Payment",
          active: pathname.includes("/dashboard/salary/new"),
          icon: PlusCircle,
          submenus: [],
        },
        {
          href: "/dashboard/salary",
          label: "Salary",
          active: pathname.includes("/dashboard/salary"),
          icon: HandCoins,
          submenus: [
            {
              href: "/dashboard/salary/admission",
              label: "Admission",
              active: pathname === "/dashboard/salary/admission",
              icon: NotebookPen,
            },
            {
              href: "/dashboard/salary/monthly",
              label: "Monthly",
              active: pathname === "/dashboard/salary/monthly",
              icon: CalendarDays,
            },
          ],
        },
        {
          href: "/dashboard/fee",
          label: "Fee",
          active: pathname.includes("/dashboard/fee"),
          icon: DollarSign,
          submenus: [
            {
              href: "/dashboard/fee/admission",
              label: "Admission",
              active: pathname === "/dashboard/fee/admission",
              icon: NotebookPen,
            },
            {
              href: "/dashboard/fee/monthly",
              label: "Monthly",
              active: pathname === "/dashboard/fee/monthly",
              icon: CalendarDays,
            },
          ],
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
          href: "/teacher/class",
          label: "Classes",
          active: pathname.includes("/teacher/class"),
          icon: BookOpen,
          submenus: [],
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
        // {
        //   href: "",
        //   label: "Unit",
        //   active: pathname.includes("/scout/unit"),
        //   icon: Layers3,
        //   submenus: [],
        // },
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
