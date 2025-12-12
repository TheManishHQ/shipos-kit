import { LoginForm } from "@saas/auth/components/LoginForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
	title: "Sign In",
};

export default function LoginPage() {
	return <LoginForm />;
}
