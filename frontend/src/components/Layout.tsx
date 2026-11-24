import { NavLink, Outlet } from "react-router";
import "./layout.css";
export default function Layout() {
  return (
    <div className="layout">
      <header className="layout_header">
        <div className="layout_logo">FleetPulse</div>
        <nav aria-label="Main" className="layout_nav">
          <NavLink to="/vehicles" className="layout_link">
            Vehicles
          </NavLink>
          <NavLink to="/playground" className="layout_link">
            Playground
          </NavLink>
        </nav>
      </header>
      <main className="layout_main">
        <Outlet />
      </main>
    </div>
  );
}
