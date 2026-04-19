"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Package, FolderOpen, Percent,
  Settings, Image as ImageIcon, Home, Menu, X, LogOut, ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToastProvider } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const basePath = `/${locale}/admin`;

  const navItems = [
    { key: "", label: t("dashboard"), icon: LayoutDashboard },
    { key: "/orders", label: t("orders"), icon: ShoppingBag },
    { key: "/products", label: t("products"), icon: Package },
    { key: "/categories", label: t("categories"), icon: FolderOpen },
    { key: "/discounts", label: t("discounts"), icon: Percent },
    { key: "/homepage", label: t("homepage"), icon: Home },
    { key: "/media", label: t("media"), icon: ImageIcon },
    { key: "/settings", label: t("settings"), icon: Settings },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}/login`);
    router.refresh();
  }

  function isActive(key: string) {
    if (key === "") return pathname === basePath;
    return pathname.startsWith(`${basePath}${key}`);
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <Link href={basePath} className="flex items-center gap-2">
          <span className="text-xl font-bold text-gradient">Kidorly</span>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium text-muted-foreground">{t("title")}</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={`${basePath}${item.key}`}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
              isActive(item.key)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t space-y-1">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("viewStore")}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </button>
      </div>
    </div>
  );

  return (
    <ToastProvider>
    <div className="min-h-screen bg-gray-50">
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-e z-30">
        {sidebar}
      </aside>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 start-0 z-50 w-64 bg-white lg:hidden shadow-xl">
            {sidebar}
          </aside>
        </>
      )}

      <div className="lg:ms-64">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b h-14 flex items-center px-4 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden me-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <span className="text-sm text-muted-foreground">{t("title")}</span>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
    </ToastProvider>
  );
}
