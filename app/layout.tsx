import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { Providers } from "@/components/providers";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  title: {
    default: `${APP_NAME} | Tech Job Alert Platform`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  openGraph: {
    title: `${APP_NAME} | Tech Job Alert Platform`,
    description: APP_DESCRIPTION,
    type: "website",
    siteName: APP_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | Tech Job Alert Platform`,
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} min-h-screen antialiased`}>
        <Providers>
          <LoadingOverlay />
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
