"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileSidebar } from "./sidebar";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("U bent uitgelogd.");
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 flex items-center h-16 px-4 border-b bg-white md:pl-64">
      <div className="flex items-center gap-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex items-center gap-2 h-16 px-6 border-b">
              <Building2 className="h-7 w-7 text-blue-600" />
              <span className="text-lg font-bold">VvE Digitaal</span>
            </div>
            <MobileSidebar />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700">H</span>
            </div>
            <span className="hidden sm:inline text-sm">Hidde</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Uitloggen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
