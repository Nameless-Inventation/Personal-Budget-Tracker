"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, PieChart, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { signout } from "@/app/login/actions";

const routes = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: Wallet },
  { href: "/budgets", label: "Budgets", icon: PieChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  return (
    <aside className="w-64 border-r border-border/50 bg-card/50 backdrop-blur-xl h-screen flex flex-col p-4 relative z-20">
      <div className="flex items-center gap-2 px-2 mb-8 mt-2">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Wallet className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground">Tracker</span>
      </div>
      
      <nav className="flex-1 space-y-1">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {route.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-border/50 flex flex-col gap-2">
        <ThemeToggle />
        <form action={signout} className="w-full">
          <button type="submit" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
