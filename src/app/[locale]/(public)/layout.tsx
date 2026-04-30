import { CartProvider } from "@/hooks/use-cart";
import { ToastProvider } from "@/hooks/use-toast";
import { WishlistProvider } from "@/hooks/use-wishlist"; // ← جديد
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { CartDrawer } from "@/components/public/cart-drawer";
import { getSettings, SETTING_KEYS } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings([
    SETTING_KEYS.WHATSAPP_NUMBER,
    SETTING_KEYS.WHATSAPP_TEMPLATE_AR,
    SETTING_KEYS.WHATSAPP_TEMPLATE_EN,
    SETTING_KEYS.WHATSAPP_TEMPLATE_DE,
    SETTING_KEYS.INSTAGRAM,
    SETTING_KEYS.FACEBOOK,
    SETTING_KEYS.TIKTOK,
    SETTING_KEYS.CONTACT_EMAIL,
    SETTING_KEYS.CONTACT_PHONE,
    SETTING_KEYS.BRAND_NAME,
    SETTING_KEYS.LOGO_URL,
  ]);

  return (
    <CartProvider>
      <WishlistProvider>
        <ToastProvider>
          <Navbar />
          <CartDrawer />
          <main className="min-h-[60vh]">{children}</main>
          <Footer settings={settings} />
        </ToastProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
