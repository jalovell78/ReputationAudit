import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { getTenantConfig } from "@/lib/tenant";
import { getTenantFromHeaders } from "@/lib/tenant-server";
import { TenantProvider } from "@/components/tenant-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantFromHeaders();
  const config = getTenantConfig(tenant);
  return {
    title: {
      default: config.title,
      template: `%s | ${config.title}`,
    },
    description: config.description,
    icons: {
      icon: config.favicon,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getTenantFromHeaders();
  const isMirror = tenant === "perception_mirror";
  const htmlClass = isMirror ? "" : "dark";

  // Select primary default font class & auxiliary variable registries
  const bodyFontClass = isMirror
    ? `${plusJakartaSans.className} ${playfairDisplay.variable} ${geistMono.variable}`
    : `${geistSans.className} ${geistMono.variable}`;

  return (
    <html lang="en" data-tenant={tenant} className={htmlClass}>
      <body className={`${bodyFontClass} antialiased`}>
        <TenantProvider tenant={tenant}>
          {children}
        </TenantProvider>
      </body>
    </html>
  );
}

