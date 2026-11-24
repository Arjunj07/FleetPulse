import { useEffect, useState } from "react";
import { getVehicles } from "../api/vehiclesApi";
import type { Vehicle } from "../types/vehicle";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadVehicles() {
      try {
        const data = await getVehicles();
        if (!ignore) setVehicles(data);
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadVehicles();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <h1>Vehicles</h1>
      {loading && <p>Loading vehicles...</p>}
      {error && <p role="alert">Something went wrong: {error}</p>}
      {!loading && !error && (
        <ul>
          {vehicles.map((v) => (
            <li key={v.id}>
              {v.name}: {v.status}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
