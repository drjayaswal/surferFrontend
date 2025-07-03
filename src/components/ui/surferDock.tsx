import {
  Activity,
  BarChart3,
  BrainCog,
  Calendar,
  Component,
  FileCog,
  HomeIcon,
  Info,
  Mail,
  MessageCircle,
  Package,
  ScrollText,
  Settings,
  SunMoon,
  Zap,
} from "lucide-react";
import { Dock, DockIcon, DockItem, DockLabel } from "../core/dock";
import Link from "next/link";
const Data = [
  {
    title: "SurferAI",
    url: "/surfer-ai",
    href: "/surfer-ai",
    icon: BrainCog,
    badge: "New",
  },
  {
    title: "Corpus",
    url: "/dashboard/corpuses",
    href: "/dashboard/corpuses",
    icon: FileCog,
    badge: null,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
    badge: null,
  },
  {
    title: "Chat History",
    url: "/dashboard/chat-history",
    href: "/dashboard/chat-history",
    icon: MessageCircle,
    badge: null,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Upgrade Plan",
    url: "/dashboard/plans",
    href: "/dashboard/plans",
    icon: Zap,
    badge: "Pro",
  },
  {
    title: "Support Center",
    url: "/dashboard/support",
    href: "/dashboard/support",
    icon: Info,
    badge: null,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    href: "/dashboard/settings",
    icon: Settings,
    badge: null,
  },
];

export function SurferDock() {
  return (
    <div className="absolute bottom-2 left-1/2 max-w-full -translate-x-1/2 z-100">
      <Dock className="items-end pb-3 cursor-pointer bg-white/80 backdrop-blur-md rounded-full">
        {Data.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <DockItem className="aspect-square rounded-full bg-sky-50/80 active:bg-sky-300">
              <DockLabel className="text-sky-700 bg-white/90 backdrop-blur-sm shadow-0 border-0 text-md">
                {item.title}
              </DockLabel>
              <DockIcon>
                <item.icon className="h-full w-full text-sky-600 active:text-sky-100" />
              </DockIcon>
            </DockItem>
          </Link>
        ))}
      </Dock>
    </div>
  );
}
