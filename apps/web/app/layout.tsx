import { Geist } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const sansFont = Geist({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "Shipos Kit",
	description: "Production-ready SaaS starter kit",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className={sansFont.className}>
			<body suppressHydrationWarning className="min-h-screen bg-background text-foreground antialiased">
				{children}
			</body>
		</html>
	);
}
