import { EmailVerification } from "./EmailVerification";
import { ForgotPassword } from "./ForgotPassword";
import { MagicLink } from "./MagicLink";
import { NewsletterSignup } from "./NewsletterSignup";
import { NewUser } from "./NewUser";

export const mailTemplates = {
	magicLink: MagicLink,
	forgotPassword: ForgotPassword,
	newUser: NewUser,
	newsletterSignup: NewsletterSignup,
	emailVerification: EmailVerification,
} as const;
