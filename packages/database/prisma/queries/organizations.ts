import { prisma } from "../client";

export async function getInvitationById(id: string) {
	return prisma.invitation.findUnique({
		where: { id },
		include: {
			organization: true,
		},
	});
}

export async function getOrganizationBySlug(slug: string) {
	return prisma.organization.findUnique({
		where: { slug },
	});
}
