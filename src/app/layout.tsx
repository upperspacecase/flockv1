import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
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
  themeColor: "#1a1410",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#c8854c",
          colorBackground: "#1e1a15",
          colorText: "#faf6f1",
          colorTextSecondary: "#e8ddd1",
          colorInputBackground: "rgba(232, 221, 209, 0.08)",
          colorInputText: "#faf6f1",
          borderRadius: "0.75rem",
          fontFamily: "Georgia, Cambria, 'Times New Roman', serif",
        },
        elements: {
          rootBox: "mx-auto",
          card: "bg-[#1e1a15] border border-[#e8ddd1]/10 shadow-2xl backdrop-blur-sm",
          headerTitle: "text-[#faf6f1] font-light tracking-wide",
          headerSubtitle: "text-[#e8ddd1]/60",
          socialButtonsBlockButton:
            "bg-[#e8ddd1]/5 border-[#e8ddd1]/15 text-[#faf6f1] hover:bg-[#e8ddd1]/10 transition-colors",
          socialButtonsBlockButtonText: "text-[#faf6f1]",
          formFieldLabel: "text-[#e8ddd1]/70",
          formFieldInput:
            "bg-[#e8ddd1]/8 border-[#e8ddd1]/15 text-[#faf6f1] placeholder:text-[#e8ddd1]/30 focus:border-[#c8854c]/50 focus:ring-[#c8854c]/20",
          formButtonPrimary:
            "bg-[#c8854c] hover:bg-[#b5763f] text-[#faf6f1] transition-colors shadow-lg shadow-[#c8854c]/20",
          footerActionLink:
            "text-[#c8854c] hover:text-[#b5763f] transition-colors",
          dividerLine: "bg-[#e8ddd1]/10",
          dividerText: "text-[#e8ddd1]/30",
          formFieldSuccessText: "text-[#2a7a6e]",
          identityPreviewEditButton: "text-[#c8854c]",
          userButtonAvatarBox: "w-8 h-8 ring-2 ring-[#c8854c]/30",
          userButtonPopoverCard:
            "bg-[#1e1a15] border border-[#e8ddd1]/10 shadow-2xl",
          userButtonPopoverActionButton:
            "text-[#e8ddd1] hover:bg-[#e8ddd1]/5",
          userButtonPopoverActionButtonText: "text-[#e8ddd1]",
          userButtonPopoverFooter: "border-t border-[#e8ddd1]/10",
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
