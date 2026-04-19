import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Kidorly — Premium Kids Products",
  description: "Premium kids products delivered across Egypt. Strollers, scooters, hoverboards & more.",
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "Kidorly",
    title: "Kidorly — Premium Kids Products",
    description: "Premium kids products delivered across Egypt.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
