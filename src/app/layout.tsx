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
  themeColor: "#f4efe7",
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
          colorPrimary: "#c8a84e",
          colorBackground: "#f4efe7",
          colorText: "#1a1a1a",
          colorTextSecondary: "#8a7e6d",
          colorInputBackground: "#ece7dd",
          colorInputText: "#1a1a1a",
          colorNeutral: "#1a1a1a",
          colorDanger: "#c44",
          colorSuccess: "#c8a84e",
          borderRadius: "0.75rem",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          fontSize: "14px",
        },
        elements: {
          rootBox: "mx-auto",
          card: "bg-[#faf7f2] border border-[#ddd5c8] shadow-sm rounded-xl",
          headerTitle: "text-[#1a1a1a] text-lg font-normal tracking-wide",
          headerSubtitle: "text-[#8a7e6d] text-sm",
          socialButtonsBlockButton:
            "bg-[#faf7f2] border border-[#ddd5c8] text-[#1a1a1a] hover:bg-[#ece7dd] transition-all rounded-lg",
          socialButtonsBlockButtonText: "text-[#1a1a1a] text-sm",
          dividerLine: "bg-[#ddd5c8]",
          dividerText: "text-[#a09585] text-xs uppercase tracking-widest",
          formFieldLabel: "text-[#8a7e6d] text-xs uppercase tracking-wider",
          formFieldInput:
            "bg-[#ece7dd] border border-[#ddd5c8] text-[#1a1a1a] rounded-lg px-4 py-3 text-sm focus:border-[#c8a84e] focus:ring-1 focus:ring-[#c8a84e]/20 transition-all",
          formButtonPrimary:
            "bg-[#c8a84e] hover:bg-[#b89940] text-[#1a1a1a] rounded-lg py-3 text-sm tracking-wide transition-all",
          footerActionLink: "text-[#c8a84e] hover:text-[#b89940] text-sm",
          footerActionText: "text-[#a09585] text-sm",
          identityPreview: "bg-[#ece7dd] border border-[#ddd5c8] rounded-lg",
          identityPreviewText: "text-[#1a1a1a] text-sm",
          identityPreviewEditButton: "text-[#c8a84e] text-xs",
          otpCodeFieldInput:
            "bg-[#ece7dd] border border-[#ddd5c8] text-[#1a1a1a] rounded-md text-lg focus:border-[#c8a84e]",
          userButtonAvatarBox: "w-8 h-8 ring-1 ring-[#ddd5c8]",
          userButtonPopoverCard: "bg-[#faf7f2] border border-[#ddd5c8] shadow-lg rounded-lg",
          userButtonPopoverActionButton: "text-[#1a1a1a] hover:bg-[#ece7dd] rounded-md",
          userButtonPopoverActionButtonText: "text-[#1a1a1a] text-sm",
          userButtonPopoverFooter: "border-t border-[#ddd5c8]",
          modalBackdrop: "bg-black/30 backdrop-blur-sm",
          modalContent: "bg-[#faf7f2] border border-[#ddd5c8] rounded-xl shadow-lg",
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
