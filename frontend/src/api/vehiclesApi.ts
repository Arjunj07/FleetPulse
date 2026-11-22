import type { Vehicle } from "../types/vehicle";
import { delay } from "./delay";
import { mockVehicles } from "./mockVehicles";

const LATENCY_MS = 500;

export async function getVehicles(): Promise<Vehicle[]> {
  await delay(LATENCY_MS);
  return structuredClone(mockVehicles);
}

export async function getVehicleById(id: string): Promise<Vehicle> {
  await delay(LATENCY_MS);
  const vehicle = mockVehicles.find((v) => v.id === id);
  if (!vehicle) {
    throw new Error(`Vehicle ${id} not found`);
  }
  return structuredClone(vehicle);
}
