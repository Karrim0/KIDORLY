"use client";

import { CartProvider } from "@/hooks/use-cart";
import { ToastProvider } from "@/hooks/use-toast";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { CartDrawer } from "@/components/public/cart-drawer";

// Debug: check if any import is undefined
if (typeof Navbar === "undefined") console.error("❌ Navbar is undefined");
if (typeof Footer === "undefined") console.error("❌ Footer is undefined");
if (typeof CartDrawer === "undefined") console.error("❌ CartDrawer is undefined");
if (typeof CartProvider === "undefined") console.error("❌ CartProvider is undefined");
if (typeof ToastProvider === "undefined") console.error("❌ ToastProvider is undefined");

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>
        <Navbar />
        <CartDrawer />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </ToastProvider>
    </CartProvider>
  );
}