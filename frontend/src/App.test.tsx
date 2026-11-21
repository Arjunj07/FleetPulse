import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "./App";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}
describe("routing", () => {
  it("redirects / to the vehicles page", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { name: "Vehicles" })).toBeInTheDocument();
  });

  it("shows the detail page for /vehicles/:id", () => {
    renderAt("/vehicles/42");
    expect(screen.getByRole("heading", { name: "Vehicle Details" })).toBeInTheDocument();
  });

  it("shows Not Found for an unknown URL", () => {
    renderAt("/nope");
    expect(screen.getByRole("heading", { name: "Page Not Found" })).toBeInTheDocument();
  });

  it("keeps the header on every page", () => {
    renderAt("/nope");
    expect(screen.getByText("FleetPulse")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Vehicles" })).toBeInTheDocument();
  });

  it("marks the current nav link as active", () => {
    renderAt("/vehicles");
    expect(screen.getByRole("link", { name: "Vehicles" })).toHaveClass("active");
  });
});
