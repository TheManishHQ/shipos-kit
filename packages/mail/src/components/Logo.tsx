import { Heading } from "@react-email/components";
import { config } from "@shipos/config";
import React from "react";

export function Logo() {
	return (
		<Heading className="text-2xl font-bold text-foreground">
			{config.appName}
		</Heading>
	);
}
