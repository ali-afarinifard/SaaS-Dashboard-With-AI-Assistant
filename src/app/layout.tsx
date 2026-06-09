import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { Providers } from "@/components/layout/providers";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

export const metadata: Metadata = {
  title: "Analytics — SaaS Dashboard",
  description: "Professional SaaS analytics dashboard with AI-powered insights",
  keywords: ["SaaS", "analytics", "dashboard", "metrics", "AI"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />
          <Providers>
            {children}
            <Analytics />
            <SpeedInsights />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
