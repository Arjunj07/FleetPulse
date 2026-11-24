import type { VehicleStatus } from "../types/vehicle";
import "./StatusBadge.css"

const STATUS_LABELS: Record<VehicleStatus, string> = {
  online: "ONLINE",
  offline: "OFFLINE",
  charging: "CHARGING",
  maintenance: "MAINTENANCE",
};

type StatusBadgeProps = {
  status: VehicleStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
