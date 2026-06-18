interface StatusBadgeProps {
  status: string;
  variant?: "default" | "active" | "pending" | "flagged" | "suspended" | "approved" | "rejected";
}

const variantMap: Record<string, string> = {
  active: "status-active",
  approved: "status-active",
  pending: "status-pending",
  flagged: "status-flagged",
  suspended: "status-suspended",
  rejected: "status-flagged",
  default: "bg-secondary text-secondary-foreground",
};

export function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  const auto = status.toLowerCase();
  const resolvedVariant = variant !== "default" ? variant : 
    auto.includes("active") || auto.includes("approved") || auto.includes("resolved") ? "active" :
    auto.includes("pending") || auto.includes("open") ? "pending" :
    auto.includes("flagged") || auto.includes("rejected") || auto.includes("banned") ? "flagged" :
    auto.includes("suspended") || auto.includes("escalated") ? "suspended" :
    "default";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${variantMap[resolvedVariant] || variantMap.default}`}>
      {status}
    </span>
  );
}
