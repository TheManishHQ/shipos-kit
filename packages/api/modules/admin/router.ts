import { banUser } from "./procedures/ban-user";
import { deleteUser } from "./procedures/delete-user";
import { listUsers } from "./procedures/list-users";
import { setRole } from "./procedures/set-role";
import { unbanUser } from "./procedures/unban-user";

export const adminRouter = {
	users: {
		list: listUsers,
		delete: deleteUser,
		setRole,
		ban: banUser,
		unban: unbanUser,
	},
};
