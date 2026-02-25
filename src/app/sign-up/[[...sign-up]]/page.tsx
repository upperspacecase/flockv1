import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="h-screen-safe flex flex-col items-center justify-center bg-[#f4efe7] px-6">
            {/* Branded header */}
            <div className="text-center mb-8">
                <h1
                    className="text-3xl font-light tracking-wide text-[#1a1a1a] mb-2"
                    style={{ fontFamily: "Georgia, Cambria, serif" }}
                >
                    Join the migration.
                </h1>
                <p className="text-sm text-[#8a7e6d] leading-relaxed">
                    Create an account to find your flock.
                </p>
            </div>

            <SignUp
                appearance={{
                    elements: {
                        rootBox: "w-full max-w-sm",
                        card: "shadow-none border-0 bg-transparent p-0",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton:
                            "bg-[#faf7f2] border border-[#ddd5c8] text-[#1a1a1a] hover:bg-[#ece7dd] transition-all rounded-xl",
                        socialButtonsBlockButtonText: "text-[#1a1a1a] text-sm",
                        dividerLine: "bg-[#ddd5c8]",
                        dividerText: "text-[#8a7e6d] text-xs uppercase tracking-widest",
                        formFieldLabel: "text-[#8a7e6d] text-xs uppercase tracking-wider",
                        formFieldInput:
                            "bg-[#ece7dd] border border-[#ddd5c8] text-[#1a1a1a] rounded-xl px-4 py-3 text-sm focus:border-[#c8a84e] focus:ring-1 focus:ring-[#c8a84e]/20 transition-all",
                        formButtonPrimary:
                            "bg-[#c8a84e] hover:bg-[#b89940] text-[#1a1a1a] rounded-full py-3 text-sm tracking-widest uppercase transition-all",
                        footerActionLink: "text-[#1a1a1a] hover:text-[#8a7e6d] text-sm",
                        footerActionText: "text-[#8a7e6d] text-sm",
                        identityPreview: "bg-[#ece7dd] border border-[#ddd5c8] rounded-xl",
                        identityPreviewText: "text-[#1a1a1a] text-sm",
                        identityPreviewEditButton: "text-[#1a1a1a] text-xs",
                        otpCodeFieldInput:
                            "bg-[#ece7dd] border border-[#ddd5c8] text-[#1a1a1a] rounded-md text-lg focus:border-[#c8a84e]",
                    },
                }}
            />

            {/* Subtle branding footer */}
            <p className="mt-10 text-[10px] text-[#b5aa98] uppercase tracking-[0.3em]">
                Migratory Species
            </p>
        </div>
    );
}
