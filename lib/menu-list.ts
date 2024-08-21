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
      groupLabel: "Statistics",
      menus: [
        {
          href: "/dashboard/stat/salary",
          label: "Salary",
          active: pathname.includes("/dashboard/stat/salary"),
          icon: HandCoins,
          submenus: [],
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
      ],
    },
    {
      groupLabel: "Room Management",
      menus: [
        {
          href: "",
          label: "Room",
          active: pathname.includes("/dashboard/room"),
          icon: School,
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

export function getMenuListScout(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/scout",
          label: "Dashboard",
          active: pathname === "/scout",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "",
          label: "Event",
          active: pathname.includes("/scout/event"),
          icon: Calendar,
          submenus: [
            {
              href: "/scout/event",
              label: "List",
              active: pathname === "/scout/event",
              icon: List,
            },
            {
              href: "/scout/event/app",
              label: "Applications",
              active: pathname === "/scout/event/app",
              icon: File,
            },
          ],
        },
        {
          href: "",
          label: "Training",
          active: pathname.includes("/scout/training"),
          icon: GitCompareArrows,
          submenus: [
            {
              href: "/scout/training",
              label: "List",
              active: pathname === "/scout/training",
              icon: List,
            },
            {
              href: "/scout/training/app",
              label: "Applications",
              active: pathname === "/scout/training/app",
              icon: File,
            },
          ],
        },
        {
          href: "",
          label: "Unit",
          active: pathname.includes("/scout/unit"),
          icon: Layers3,
          submenus: [
            {
              href: "/scout/unit",
              label: "Manage",
              active: pathname === "/scout/unit",
              icon: Settings,
            },
            {
              href: "/scout/unit/request",
              label: "Request",
              active: pathname === "/scout/unit/request",
              icon: Radio,
            },
          ],
        },
        {
          href: "/scout/profile",
          label: "Profile",
          active: pathname.includes("/scout/profile"),
          icon: UserCog,
          submenus: [],
        },
      ],
    },
  ];
}
