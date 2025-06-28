"use client";

import type React from "react";

import {
  BarChart3,
  Bell,
  BellDot,
  Brain,
  BrainCog,
  Calendar,
  ChevronRight,
  CircleDashed,
  FileCog,
  Info,
  LogOut,
  MessageCircle,
  Settings,
  User,
  Waves,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navigationData = {
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "JD",
  },
  brand: {
    name: "Surfer",
    logo: "/placeholder.svg?height=32&width=32",
  },
  mainNavigation: [
    {
      title: "SurferAI",
      url: "/surfer-ai",
      icon: BrainCog,
      badge: "New",
    },
    {
      title: "Corpus",
      url: "/dashboard/corpus",
      icon: FileCog,
      badge: null,
    },
    {
      title: "Calendar",
      url: "/dashboard/calendar",
      icon: Calendar,
      badge: null,
    },
  ],
  tools: [
    {
      title: "Chat History",
      url: "/dashboard/chat-history",
      icon: MessageCircle,
      badge: null,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
      badge: null,
    },
  ],
  account: [
    {
      title: "Upgrade Plan",
      url: "/dashboard/plans",
      icon: Zap,
      badge: "Pro",
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      badge: null,
    },
    {
      title: "Support Center",
      url: "/dashboard/support",
      icon: Info,
      badge: null,
    },
  ],
};
const dropdownItem = [
  {
    title: "Profile",
    url: "/dashboard/settings",
    icon: User,
  },
  {
    title: "Upgrade to Pro",
    url: "/dashboard/plans",
    icon: Zap,
  },
];
export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const handleLogOut = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/auth/logout`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast("You have successfully logged out!");
        router.push("/");
      } else {
        toast("Logout failed!");
        console.error("Logout failed:", data);
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="rounded-t-[9px]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent bg-transparent p-5"
              asChild
            >
              <Link href="/" className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center aspect-square rounded-full bg-sky-600 text-white overflow-visible">
                  <Waves className="w-5 h-5" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-semibold text-lg bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent font-mono">
                    {navigationData.brand.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Powered by AI
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.mainNavigation.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "relative hover:bg-sky-500/10 hover:text-sky-600 transition-colors",
                        isActive && [
                          "text-sky-600 bg-sky-500/10",
                          "border-l border-l-sky-600 rounded-l-none",
                          "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-sky-600",
                        ]
                      )}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 w-full"
                      >
                        <item.icon
                          className={cn(
                            "size-4",
                            isActive && "text-sky-600 peer-hover:text-white"
                          )}
                        />
                        <span className={cn(isActive && "font-medium")}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Cortex</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.tools.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "relative hover:bg-sky-500/10 hover:text-sky-600 transition-colors",
                        isActive && [
                          "bg-sky-100 text-sky-600 hover:bg-sky-600/20",
                          "border-l border-l-sky-600 rounded-l-none",
                          "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-sky-600",
                        ]
                      )}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 w-full"
                      >
                        <item.icon
                          className={cn("size-4", isActive && "text-sky-600")}
                        />
                        <span className={cn(isActive && "font-medium")}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.account.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "relative hover:bg-sky-500/10 hover:text-sky-600 transition-colors",
                        isActive && [
                          "bg-sky-100 text-sky-600 hover:bg-sky-600/20",
                          "border-l border-l-sky-600 rounded-l-none",
                          "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-sky-600",
                        ]
                      )}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 w-full"
                      >
                        <item.icon
                          className={cn("size-4", isActive && "text-sky-600")}
                        />
                        <span className={cn(isActive && "font-medium")}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="w-full rounded-b-[9px]">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <SidebarMenuButton
                variant={"default"}
                size={"lg"}
                className="cursor-pointer bg-sky-600/10 hover:bg-sky-500/10focus-visible:ring-0 rounded-2xl"
                asChild
              >
                <DropdownMenuTrigger className="flex items-center gap-3 pl-4">
                  <Avatar className="size-8 bg-transparent">
                    <AvatarImage
                      src="/Surf.png"
                      alt="User Avatar"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-sky-600/10 text-white">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex space-x-20">
                    <span className="text-[16px] text-sky-700 font-medium">
                      John
                    </span>
                    <ChevronRight className="text-sky-600" />
                  </div>
                </DropdownMenuTrigger>
              </SidebarMenuButton>
              <DropdownMenuContent
                side="right"
                sideOffset={15}
                className="mb-2 rounded-xl shadow-xl -ml-1 bg-gray-50 border-0"
              >
                <DropdownMenuLabel className="flex gap-2 items-center">
                  <Avatar className="size-10 bg-transparent">
                    <AvatarImage
                      src="/Surf.png"
                      alt="User Avatar"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-sky-600/10 text-sky-600">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>John Lawyer</span>
                    <span className="text-xs font-normal text-gray-500">
                      johnlawyer@gmail.com
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {dropdownItem.map((item, index) => (
                  <Link key={index} href={item.url} className="">
                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-sky-600/5 focus:text-sky-600"
                      key={index}
                    >
                      <item.icon className="group-hover:text-sky-600" />{" "}
                      {item.title}
                    </DropdownMenuItem>
                  </Link>
                ))}
                <DropdownMenuSeparator />

                {/* <Link href={""} className=""> */}
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-red-500/5 focus:text-red-600"
                  onClick={() => {
                    handleLogOut();
                  }}
                >
                  <LogOut className="group-hover:text-red-600" /> Log out
                </DropdownMenuItem>
                {/* </Link> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
              <p className="text-muted-foreground">Dashboard Content</p>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
              <p className="text-muted-foreground">Analytics Widget</p>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
              <p className="text-muted-foreground">Quick Actions</p>
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                Welcome to Your Dashboard
              </h2>
              <p className="text-muted-foreground">
                This is your main content area. The sidebar is fully responsive
                and accessible.
              </p>
              <div className="mt-4 p-4 bg-sky-50 rounded-lg border border-sky-200">
                <p className="text-sm text-sky-800">
                  <strong>Active Tab Styling:</strong> Notice the solid left
                  border on active navigation items, along with enhanced
                  background and font weight for better visual feedback.
                </p>
              </div>
            </div>
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
