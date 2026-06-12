"use client";

import React from "react";
import { Users, UserCheck, UserMinus, UserPlus, ShieldAlert } from "lucide-react";
import { MetricScorecard } from "@/components/admin/analytics/MetricScorecard";
import { useUserStats } from "@/hooks/use-users";

export function UserStats() {
  const { data, isLoading } = useUserStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricScorecard
        label="Total Users"
        value={data?.total?.toLocaleString() || "0"}
        trend={data?.growth}
        icon={<Users className="size-5" />}
        isLoading={isLoading}
      />
      <MetricScorecard
        label="Active Users"
        value={data?.active?.toLocaleString() || "0"}
        icon={<UserCheck className="size-5" />}
        isLoading={isLoading}
      />
      <MetricScorecard
        label="New Users (30d)"
        value={data?.newUsers?.toLocaleString() || "0"}
        icon={<UserPlus className="size-5" />}
        isLoading={isLoading}
      />
      <MetricScorecard
        label="Suspended"
        value={data?.suspended?.toLocaleString() || "0"}
        icon={<UserMinus className="size-5" />}
        isLoading={isLoading}
        status="warning"
      />
    </div>
  );
}
