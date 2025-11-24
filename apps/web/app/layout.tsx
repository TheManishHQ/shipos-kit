import type { Metadata } from "next";
import "./globals.css";

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
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
