import Link from "next/link";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t py-8 text-sm text-foreground/60">
			<div className="container grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Column 1: Brand */}
				<div>
					<div className="mb-2 text-xl font-bold text-foreground">
						Shipos Kit
					</div>
					<p className="mb-2">
						© {currentYear} Shipos Kit. All rights reserved.
					</p>
					<p className="text-xs">
						Production-ready SaaS starter kit
					</p>
				</div>

				{/* Column 2: Quick Links */}
				<div>
					<h3 className="mb-3 font-semibold text-foreground">Quick Links</h3>
					<div className="flex flex-col gap-2">
						<Link href="#features" className="hover:text-foreground">
							Features
						</Link>
						<Link href="#pricing" className="hover:text-foreground">
							Pricing
						</Link>
						<Link href="#faq" className="hover:text-foreground">
							FAQ
						</Link>
					</div>
				</div>

				{/* Column 3: Legal */}
				<div>
					<h3 className="mb-3 font-semibold text-foreground">Legal</h3>
					<div className="flex flex-col gap-2">
						<Link href="/legal/privacy" className="hover:text-foreground">
							Privacy Policy
						</Link>
						<Link href="/legal/terms" className="hover:text-foreground">
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
