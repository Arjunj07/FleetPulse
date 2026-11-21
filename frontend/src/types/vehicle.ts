export type VehicleStatus = "online" | "offline" | "charging" | "maintenance";

export type FuelType = "electric" | "hybrid" | "petrol" | "diesel";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Telemetry {
  speedKph: number;
  batteryPercent?: number;
  odometerKm: number;
  engineTempC: number;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  vin: string;
  name: string;
  plate: string;
  model: string;
  fuelType: FuelType;
  status: VehicleStatus;
  location: GeoLocation;
  telemetry: Telemetry;
  lastSeenAt: string;
}
