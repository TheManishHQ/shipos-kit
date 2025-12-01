"use client";

import { Button } from "@ui/components/button";
import { Sheet, SheetContent, SheetTrigger } from "@ui/components/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

const menuItems = [
	{ label: "Features", href: "#features" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "FAQ", href: "#faq" },
];

export function NavBar() {
	const [scrolled, setScrolled] = useState(false);
	const [debouncedScrolled] = useDebounceValue(scrolled, 150);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<nav
			className={`fixed left-0 top-0 z-50 w-full transition-all ${
				debouncedScrolled
					? "bg-card/80 py-4 shadow-sm backdrop-blur-lg"
					: "bg-transparent py-6"
			}`}
		>
			<div className="container flex items-center justify-between">
				{/* Logo */}
				<Link href="/" className="text-xl font-bold">
					Shipos Kit
				</Link>

				{/* Desktop Menu */}
				<div className="hidden items-center gap-6 md:flex">
					{menuItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="text-sm text-foreground/60 transition-colors hover:text-foreground"
						>
							{item.label}
						</Link>
					))}
				</div>

				{/* CTA Buttons */}
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm" asChild className="hidden md:inline-flex">
						<Link href="/auth/login">Login</Link>
					</Button>
					<Button size="sm" asChild>
						<Link href="/auth/login">Get Started</Link>
					</Button>

					{/* Mobile Menu */}
					<Sheet>
						<SheetTrigger asChild className="md:hidden">
							<Button variant="ghost" size="icon">
								<MenuIcon className="size-5" />
							</Button>
						</SheetTrigger>
						<SheetContent>
							<div className="mt-8 flex flex-col gap-4">
								{menuItems.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										className="text-lg font-medium"
									>
										{item.label}
									</Link>
								))}
								<div className="mt-4 space-y-2">
									<Button variant="outline" className="w-full" asChild>
										<Link href="/auth/login">Login</Link>
									</Button>
									<Button className="w-full" asChild>
										<Link href="/auth/login">Get Started</Link>
									</Button>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</nav>
	);
}
