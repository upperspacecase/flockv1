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
        baseTheme: dark,
        variables: {
          colorPrimary: "#c8854c",
          colorBackground: "#1e1a15",
          colorText: "#faf6f1",
          colorTextSecondary: "#c4b8a8",
          colorInputBackground: "rgba(232, 221, 209, 0.06)",
          colorInputText: "#faf6f1",
          colorNeutral: "#e8ddd1",
          colorDanger: "#e07a5f",
          colorSuccess: "#2a7a6e",
          borderRadius: "0.75rem",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          fontSize: "14px",
          spacingUnit: "16px",
        },
        elements: {
          // ─── Card / Root ───
          rootBox: "mx-auto",
          cardBox: "shadow-2xl",
          card: "bg-[#1e1a15] border border-[#e8ddd1]/10 shadow-2xl rounded-2xl",

          // ─── Header ───
          headerTitle:
            "text-[#faf6f1] text-xl font-light tracking-wide",
          headerSubtitle: "text-[#c4b8a8]/60 text-sm",

          // ─── Social Buttons ───
          socialButtonsBlockButton:
            "bg-[#e8ddd1]/5 border border-[#e8ddd1]/12 text-[#faf6f1] hover:bg-[#e8ddd1]/10 transition-all duration-200 rounded-xl",
          socialButtonsBlockButtonText: "text-[#faf6f1] text-sm",
          socialButtonsBlockButtonArrow: "text-[#c4b8a8]/40",
          socialButtonsProviderIcon__apple: "brightness-0 invert",
          socialButtonsProviderIcon__github: "brightness-0 invert",

          // ─── Divider ───
          dividerLine: "bg-[#e8ddd1]/8",
          dividerText: "text-[#c4b8a8]/30 text-xs uppercase tracking-widest",

          // ─── Form Fields ───
          formFieldLabel: "text-[#c4b8a8]/70 text-xs uppercase tracking-wider mb-1",
          formFieldInput:
            "bg-[#e8ddd1]/6 border border-[#e8ddd1]/12 text-[#faf6f1] rounded-xl px-4 py-3 text-sm placeholder:text-[#c4b8a8]/25 focus:border-[#c8854c]/40 focus:ring-1 focus:ring-[#c8854c]/20 transition-all duration-200",
          formFieldInputShowPasswordButton: "text-[#c4b8a8]/40 hover:text-[#c4b8a8]/70",
          formFieldHintText: "text-[#c4b8a8]/40 text-xs",
          formFieldSuccessText: "text-[#2a7a6e] text-xs",
          formFieldErrorText: "text-[#e07a5f] text-xs",
          formFieldWarningText: "text-[#c8854c] text-xs",

          // ─── Buttons ───
          formButtonPrimary:
            "bg-[#c8854c] hover:bg-[#b5763f] text-[#faf6f1] rounded-xl py-3 text-sm tracking-wide font-medium transition-all duration-200 shadow-lg shadow-[#c8854c]/15",
          formButtonReset:
            "text-[#c8854c] hover:text-[#b5763f] text-sm transition-colors",

          // ─── Links ───
          footerActionLink:
            "text-[#c8854c] hover:text-[#b5763f] transition-colors duration-200 text-sm",
          footerActionText: "text-[#c4b8a8]/40 text-sm",

          // ─── Identity Preview ───
          identityPreview: "bg-[#e8ddd1]/5 border border-[#e8ddd1]/10 rounded-xl",
          identityPreviewText: "text-[#faf6f1] text-sm",
          identityPreviewEditButton:
            "text-[#c8854c] hover:text-[#b5763f] text-xs",

          // ─── OTP / Verification ───
          otpCodeFieldInput:
            "bg-[#e8ddd1]/6 border border-[#e8ddd1]/12 text-[#faf6f1] rounded-lg text-lg focus:border-[#c8854c]/50 focus:ring-1 focus:ring-[#c8854c]/20",

          // ─── Alert / Errors ───
          alert: "bg-[#e07a5f]/10 border border-[#e07a5f]/20 rounded-xl text-[#e07a5f] text-sm",
          alertText: "text-[#e07a5f]",

          // ─── User Button (in-app) ───
          userButtonAvatarBox: "w-8 h-8 ring-2 ring-[#c8854c]/30",
          userButtonTrigger: "focus:shadow-none",
          userButtonPopoverCard:
            "bg-[#1e1a15] border border-[#e8ddd1]/10 shadow-2xl rounded-xl",
          userButtonPopoverActions: "border-t border-[#e8ddd1]/8",
          userButtonPopoverActionButton:
            "text-[#e8ddd1] hover:bg-[#e8ddd1]/5 transition-colors rounded-lg",
          userButtonPopoverActionButtonText: "text-[#e8ddd1] text-sm",
          userButtonPopoverActionButtonIcon: "text-[#c4b8a8]/50",
          userButtonPopoverFooter: "border-t border-[#e8ddd1]/8",

          // ─── User Profile Modal ───
          userProfilePage: "bg-[#1e1a15]",
          navbar: "bg-[#1e1a15] border-r border-[#e8ddd1]/8",
          navbarButton:
            "text-[#e8ddd1] hover:bg-[#e8ddd1]/5 rounded-lg transition-colors",
          pageScrollBox: "bg-[#1e1a15]",
          profileSectionTitle: "text-[#faf6f1] border-b border-[#e8ddd1]/8",
          profileSectionTitleText: "text-[#faf6f1] text-sm font-medium",
          profileSectionContent: "border-b border-[#e8ddd1]/8",
          profileSectionPrimaryButton:
            "text-[#c8854c] hover:text-[#b5763f] text-sm",

          // ─── Badges ───
          badge: "bg-[#c8854c]/15 text-[#c8854c] border-0 rounded-full text-xs",
          badgePrimary: "bg-[#c8854c]/15 text-[#c8854c]",

          // ─── Modal Backdrop ───
          modalBackdrop: "bg-black/60 backdrop-blur-sm",
          modalContent: "bg-[#1e1a15] border border-[#e8ddd1]/10 rounded-2xl shadow-2xl",
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
