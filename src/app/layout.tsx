import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Migratory Species — Find Your Flock",
  description:
    "A connection app for people who move through the world. Migratory species supporting migratory species.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fefefe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#1a1a1a",
          colorBackground: "#fefefe",
          colorText: "#1a1a1a",
          colorTextSecondary: "#666666",
          colorInputBackground: "#f5f5f5",
          colorInputText: "#1a1a1a",
          colorNeutral: "#1a1a1a",
          colorDanger: "#dc3545",
          colorSuccess: "#1a1a1a",
          borderRadius: "0.5rem",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          fontSize: "14px",
        },
        elements: {
          rootBox: "mx-auto",
          card: "bg-white border border-[#e0e0e0] shadow-sm rounded-xl",
          headerTitle: "text-[#1a1a1a] text-lg font-normal tracking-wide",
          headerSubtitle: "text-[#888] text-sm",
          socialButtonsBlockButton:
            "bg-white border border-[#e0e0e0] text-[#1a1a1a] hover:bg-[#f5f5f5] transition-all rounded-lg",
          socialButtonsBlockButtonText: "text-[#1a1a1a] text-sm",
          dividerLine: "bg-[#e0e0e0]",
          dividerText: "text-[#999] text-xs uppercase tracking-widest",
          formFieldLabel: "text-[#666] text-xs uppercase tracking-wider",
          formFieldInput:
            "bg-[#f8f8f8] border border-[#e0e0e0] text-[#1a1a1a] rounded-lg px-4 py-3 text-sm focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a]/10 transition-all",
          formButtonPrimary:
            "bg-[#1a1a1a] hover:bg-[#333] text-white rounded-lg py-3 text-sm tracking-wide transition-all",
          footerActionLink: "text-[#1a1a1a] hover:text-[#444] text-sm",
          footerActionText: "text-[#999] text-sm",
          identityPreview: "bg-[#f5f5f5] border border-[#e0e0e0] rounded-lg",
          identityPreviewText: "text-[#1a1a1a] text-sm",
          identityPreviewEditButton: "text-[#1a1a1a] text-xs",
          otpCodeFieldInput:
            "bg-[#f8f8f8] border border-[#e0e0e0] text-[#1a1a1a] rounded-md text-lg focus:border-[#1a1a1a]",
          userButtonAvatarBox: "w-8 h-8 ring-1 ring-[#e0e0e0]",
          userButtonPopoverCard: "bg-white border border-[#e0e0e0] shadow-lg rounded-lg",
          userButtonPopoverActionButton: "text-[#1a1a1a] hover:bg-[#f5f5f5] rounded-md",
          userButtonPopoverActionButtonText: "text-[#1a1a1a] text-sm",
          userButtonPopoverFooter: "border-t border-[#e0e0e0]",
          modalBackdrop: "bg-black/30 backdrop-blur-sm",
          modalContent: "bg-white border border-[#e0e0e0] rounded-xl shadow-lg",
        },
      }}
    >
      <html lang="en">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
