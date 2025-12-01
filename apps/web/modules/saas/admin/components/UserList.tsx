"use client";

import { authClient } from "@shipos/auth/client";
import { orpc } from "@shared/lib/orpc-query-utils";
import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { Card } from "@ui/components/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Input } from "@ui/components/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@ui/components/table";
import {
	BanIcon,
	CheckCircle2Icon,
	MoreVerticalIcon,
	SearchIcon,
	ShieldCheckIcon,
	ShieldXIcon,
	TrashIcon,
	XCircleIcon,
} from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";
import { Pagination } from "@saas/shared/components/Pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/avatar";
import { useConfirmationAlert } from "@saas/shared/components/ConfirmationAlertProvider";

const ITEMS_PER_PAGE = 10;

export function UserList() {
	const queryClient = useQueryClient();
	const { confirm } = useConfirmationAlert();
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm] = useDebounceValue(searchTerm, 300);
	const [currentPage, setCurrentPage] = useQueryState(
		"page",
		parseAsInteger.withDefault(1),
	);

	// Reset to page 1 when search changes
	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		setCurrentPage(1);
	};

	const { data, isLoading } = useQuery(
		orpc.admin.users.list.queryOptions({
			input: debouncedSearchTerm
				? {
						limit: ITEMS_PER_PAGE,
						offset: (currentPage - 1) * ITEMS_PER_PAGE,
						query: debouncedSearchTerm,
					}
				: {
						limit: ITEMS_PER_PAGE,
						offset: (currentPage - 1) * ITEMS_PER_PAGE,
					},
		}),
	);

	const deleteUserMutation = useMutation(orpc.admin.users.delete.mutationOptions());
	const setRoleMutation = useMutation(orpc.admin.users.setRole.mutationOptions());
	const banUserMutation = useMutation(orpc.admin.users.ban.mutationOptions());
	const unbanUserMutation = useMutation(orpc.admin.users.unban.mutationOptions());

	const users = data?.users ?? [];
	const total = data?.total ?? 0;

	const handleDeleteUser = async (userId: string, userName: string) => {
		confirm({
			title: "Delete User",
			message: `Are you sure you want to permanently delete ${userName}? This action cannot be undone.`,
			confirmText: "Delete",
			variant: "destructive",
			async onConfirm() {
				try {
					await deleteUserMutation.mutateAsync({ userId });
					toast.success("User deleted successfully");
					queryClient.invalidateQueries({
						queryKey: orpc.admin.users.list.queryKey(),
					});
				} catch (error) {
					toast.error("Failed to delete user");
				}
			},
		});
	};

	const handleSetRole = async (userId: string, role: "admin" | "user") => {
		try {
			await setRoleMutation.mutateAsync({ userId, role });
			toast.success(`Role updated to ${role}`);
			queryClient.invalidateQueries({
				queryKey: orpc.admin.users.list.queryKey(),
			});
		} catch (error) {
			toast.error("Failed to update role");
		}
	};

	const handleBanUser = async (userId: string, userName: string) => {
		confirm({
			title: "Ban User",
			message: `Are you sure you want to ban ${userName}?`,
			confirmText: "Ban User",
			variant: "destructive",
			async onConfirm() {
				try {
					await banUserMutation.mutateAsync({
						userId,
						reason: "Banned by administrator",
					});
					toast.success("User banned successfully");
					queryClient.invalidateQueries({
						queryKey: orpc.admin.users.list.queryKey(),
					});
				} catch (error) {
					toast.error("Failed to ban user");
				}
			},
		});
	};

	const handleUnbanUser = async (userId: string) => {
		try {
			await unbanUserMutation.mutateAsync({ userId });
			toast.success("User unbanned successfully");
			queryClient.invalidateQueries({
				queryKey: orpc.admin.users.list.queryKey(),
			});
		} catch (error) {
			toast.error("Failed to unban user");
		}
	};

	const handleImpersonate = async (userId: string, userName: string) => {
		try {
			await authClient.admin.impersonateUser({ userId });
			toast.success(`Impersonating ${userName}`);
			window.location.href = "/app";
		} catch (error) {
			toast.error("Failed to impersonate user");
		}
	};

	return (
		<div className="space-y-4">
			{/* Search */}
			<div className="relative">
				<SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Search users by name or email..."
					value={searchTerm}
					onChange={(e) => handleSearchChange(e.target.value)}
					className="pl-10"
				/>
			</div>

			{/* Users Table */}
			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Email Verified</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center">
									Loading...
								</TableCell>
							</TableRow>
						) : users.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center">
									No users found
								</TableCell>
							</TableRow>
						) : (
							users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="size-8">
												<AvatarImage src={user.image || undefined} />
												<AvatarFallback>
													{user.name.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-medium">{user.name}</div>
												<div className="text-sm text-muted-foreground">
													{user.email}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										{user.emailVerified ? (
											<div className="flex items-center gap-2 text-green-600">
												<CheckCircle2Icon className="size-4" />
												<span className="text-sm">Verified</span>
											</div>
										) : (
											<div className="flex items-center gap-2 text-amber-600">
												<XCircleIcon className="size-4" />
												<span className="text-sm">Pending</span>
											</div>
										)}
									</TableCell>
									<TableCell>
										{user.role === "admin" ? (
											<span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
												<ShieldCheckIcon className="size-3" />
												Admin
											</span>
										) : (
											<span className="text-sm text-muted-foreground">
												User
											</span>
										)}
									</TableCell>
									<TableCell>
										{user.banned ? (
											<span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">
												<BanIcon className="size-3" />
												Banned
											</span>
										) : (
											<span className="text-sm text-green-600">Active</span>
										)}
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreVerticalIcon className="size-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() =>
														handleImpersonate(user.id, user.name)
													}
												>
													Impersonate
												</DropdownMenuItem>
												{user.role === "admin" ? (
													<DropdownMenuItem
														onClick={() => handleSetRole(user.id, "user")}
													>
														<ShieldXIcon className="mr-2 size-4" />
														Remove Admin
													</DropdownMenuItem>
												) : (
													<DropdownMenuItem
														onClick={() => handleSetRole(user.id, "admin")}
													>
														<ShieldCheckIcon className="mr-2 size-4" />
														Make Admin
													</DropdownMenuItem>
												)}
												{user.banned ? (
													<DropdownMenuItem
														onClick={() => handleUnbanUser(user.id)}
													>
														<CheckCircle2Icon className="mr-2 size-4" />
														Unban User
													</DropdownMenuItem>
												) : (
													<DropdownMenuItem
														onClick={() => handleBanUser(user.id, user.name)}
													>
														<BanIcon className="mr-2 size-4" />
														Ban User
													</DropdownMenuItem>
												)}
												<DropdownMenuItem
													onClick={() => handleDeleteUser(user.id, user.name)}
													className="text-destructive"
												>
													<TrashIcon className="mr-2 size-4" />
													Delete User
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Card>

			{/* Pagination */}
			{total > ITEMS_PER_PAGE && (
				<Pagination
					totalItems={total}
					itemsPerPage={ITEMS_PER_PAGE}
					currentPage={currentPage}
					onChangeCurrentPage={setCurrentPage}
				/>
			)}
		</div>
	);
}
