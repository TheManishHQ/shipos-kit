import { ContactForm } from "@marketing/home/components/ContactForm";
import { Footer } from "@marketing/shared/components/Footer";
import { NavBar } from "@marketing/shared/components/NavBar";
import { config } from "@shipos/config";
import { redirect } from "next/navigation";

export const metadata = {
	title: "Contact Us - Shipos Kit",
	description: "Get in touch with us. We'd love to hear from you.",
};

export default async function ContactPage() {
	if (!config.contactForm.enabled) {
		redirect("/");
	}

	return (
		<div className="min-h-screen">
			<NavBar />
			<div className="container max-w-xl pt-32 pb-16">
				<div className="mb-12 pt-8 text-center">
					<h1 className="mb-2 font-bold text-5xl">Contact Us</h1>
					<p className="text-balance text-lg opacity-50">
						Have a question or feedback? We'd love to hear from you.
					</p>
				</div>

				<ContactForm />
			</div>
			<Footer />
		</div>
	);
}
