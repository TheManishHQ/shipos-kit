import { FaqSection } from "@marketing/home/components/FaqSection";
import { Features } from "@marketing/home/components/Features";
import { Hero } from "@marketing/home/components/Hero";
import { PricingSection } from "@marketing/home/components/PricingSection";
import { Footer } from "@marketing/shared/components/Footer";
import { NavBar } from "@marketing/shared/components/NavBar";

export default function HomePage() {
	return (
		<div className="min-h-screen">
			<NavBar />
			<main>
				<Hero />
				<Features />
				<PricingSection />
				<FaqSection />
			</main>
			<Footer />
		</div>
	);
}
