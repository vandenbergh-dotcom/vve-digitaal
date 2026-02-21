"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wallet,
  FileText,
  Calendar,
  Vote,
  Wrench,
  ClipboardList,
  BarChart3,
  MessageSquare,
  Bell,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/leden", icon: Users, label: "Leden" },
  { href: "/dashboard/financieel", icon: Wallet, label: "Financieel" },
  { href: "/dashboard/documenten", icon: FileText, label: "Documenten" },
  { href: "/dashboard/vergaderingen", icon: Calendar, label: "Vergaderingen" },
  { href: "/dashboard/stemmen", icon: Vote, label: "Stemmen" },
  { href: "/dashboard/onderhoud", icon: Wrench, label: "Onderhoud" },
  { href: "/dashboard/mjop", icon: ClipboardList, label: "MJOP" },
  { href: "/dashboard/jaarverslag", icon: BarChart3, label: "Jaarverslag" },
  { href: "/dashboard/ai-assistent", icon: MessageSquare, label: "AI Assistent" },
  { href: "/dashboard/mededelingen", icon: Bell, label: "Mededelingen" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r">
      {/* Logo */}
      <div className="flex items-center gap-2 h-16 px-6 border-b">
        <Building2 className="h-7 w-7 text-blue-600" />
        <span className="text-lg font-bold">VvE Digitaal</span>
      </div>

      {/* VvE Name */}
      <div className="px-4 py-3 border-b bg-blue-50/50">
        <p className="text-xs text-muted-foreground">Huidige VvE</p>
        <p className="text-sm font-medium truncate">Garagepark De Linden</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn("h-4.5 w-4.5", isActive ? "text-blue-600" : "text-gray-400")} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-700">H</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Hidde</p>
            <p className="text-xs text-muted-foreground truncate">Voorzitter</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();

  return (
    <nav className="py-4 px-3">
      <ul className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("h-4.5 w-4.5", isActive ? "text-blue-600" : "text-gray-400")} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
