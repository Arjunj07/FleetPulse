import type { Vehicle } from './vehicle';

describe('Vehicle type', () => {
  const vehicle: Vehicle = {
    id: 'v-001',
    vin: '1HGCM82633A004352',
    name: 'Delivery Van 1',
    plate: 'AB-123-CD',
    model: 'Nissan e-NV200',
    fuelType: 'electric',
    status: 'online',
    location: { latitude: 48.8566, longitude: 2.3522 },
    telemetry: {
      speedKph: 42,
      batteryPercent: 78,
      odometerKm: 15230,
      engineTempC: 61,
      updatedAt: '2026-11-20T10:00:00Z',
    },
    lastSeenAt: '2026-11-20T10:00:00Z',
  };

  it('accepts a valid vehicle', () => {
    expect(vehicle.status).toBe('online');
  });

  it('rejects an invalid status at compile time', () => {
    // @ts-expect-error 'onlin' is not a valid VehicleStatus
    const bad: Vehicle = { ...vehicle, status: 'onlin' };
    expect(bad).toBeDefined();
  });
});
