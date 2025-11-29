import { publicProcedure } from "../../orpc/procedures";
import { listUsers } from "./procedures/list-users";

export const adminRouter = publicProcedure.router({
	listUsers,
});
