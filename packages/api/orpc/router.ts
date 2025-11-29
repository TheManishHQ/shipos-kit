import type { RouterClient } from "@orpc/server";
import { usersRouter } from "../modules/users/router";
import { publicProcedure } from "./procedures";

export const router = publicProcedure
    // Prefix for openapi
    .prefix("/api")
    .router({
        users: usersRouter,
    });

export type ApiRouterClient = RouterClient<typeof router>;
