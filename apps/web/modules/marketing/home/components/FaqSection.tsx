import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@ui/components/accordion";

const faqs = [
	{
		question: "What's included in the starter kit?",
		answer:
			"The kit includes authentication (email/password, magic links, OAuth, passkeys), payment integration with Stripe, AI chat with OpenAI, admin panel, internationalization, email system, file storage, and a complete UI component library.",
	},
	{
		question: "Can I use this for commercial projects?",
		answer:
			"Yes! Once you purchase the kit, you can use it for unlimited commercial projects. The license allows you to build and sell products using this starter kit.",
	},
	{
		question: "What databases are supported?",
		answer:
			"The kit uses Prisma ORM which supports PostgreSQL, MySQL, SQLite, MongoDB, and other databases. The default setup uses PostgreSQL.",
	},
	{
		question: "Is there documentation available?",
		answer:
			"Yes, comprehensive documentation is included covering setup, deployment, customization, and all features. Each component and feature is well-documented with examples.",
	},
	{
		question: "Do you provide support?",
		answer:
			"Yes, we provide email support for any questions or issues you encounter. We also have an active community where you can get help from other developers.",
	},
	{
		question: "How do I deploy the application?",
		answer:
			"The application can be deployed to Vercel, Netlify, or any platform that supports Next.js. We provide detailed deployment guides for popular platforms.",
	},
];

export function FaqSection() {
	return (
		<section id="faq" className="scroll-mt-16 border-t py-12 lg:py-16">
			<div className="container max-w-3xl">
				{/* Header */}
				<div className="mb-12 text-center">
					<h2 className="mb-4 text-4xl font-bold lg:text-5xl">
						Frequently Asked Questions
					</h2>
					<p className="text-lg text-foreground/50">
						Everything you need to know about the starter kit
					</p>
				</div>

				{/* FAQ Accordion */}
				<Accordion type="single" collapsible className="w-full">
					{faqs.map((faq, index) => (
						<AccordionItem key={index} value={`item-${index}`}>
							<AccordionTrigger className="text-left font-semibold">
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className="text-foreground/60">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
