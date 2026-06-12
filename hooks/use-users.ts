import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
  status: "active" | "suspended" | "banned";
  verification_status: "unverified" | "verified";
  phone: string | null;
  avatar_url: string | null;
  last_login: string | null;
  created_at: string;
}

export function useUserStats() {
  return useQuery({
    queryKey: ["admin", "users", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats/users");
      if (!res.ok) throw new Error("Failed to fetch user stats");
      return res.json();
    },
  });
}

export function useUsers(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  status?: string;
  sortKey?: string;
  sortDir?: string;
}) {
  return useQuery({
    queryKey: ["admin", "users", "list", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") sp.append(k, v.toString());
      });
      const res = await fetch(`/api/admin/users?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });
}

export function useUserDetail(id: number) {
  return useQuery({
    queryKey: ["admin", "users", "detail", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users/${id}`);
      if (!res.ok) throw new Error("Failed to fetch user detail");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useUserActions() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const performActionMutation = useMutation({
    mutationFn: async ({ id, action, data }: { id: number; action: string; data?: any }) => {
      const res = await fetch(`/api/admin/users/${id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...data }),
      });
      if (!res.ok) throw new Error("Action failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: async (data: { userIds: number[]; action: string; role?: string }) => {
      const res = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Bulk action failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  return {
    updateUser: updateMutation,
    performAction: performActionMutation,
    bulkAction: bulkActionMutation,
  };
}
