import { render, screen } from "@testing-library/react";
import StatusBadge from "./StatusBadge";
import type { VehicleStatus } from "../types/vehicle";

describe("StatusBadge", () => {
  const cases: [VehicleStatus, string][] = [
    ["online", "ONLINE"],
    ["offline", "OFFLINE"],
    ["charging", "CHARGING"],
    ["maintenance", "MAINTENANCE"],
  ];

  it.each(cases)("shows the text label for status %s", (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it.each(cases)("uses the colour class for status %s", (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toHaveClass(
      "status-badge",
      `status-badge--${status}`,
    );
  });
});
