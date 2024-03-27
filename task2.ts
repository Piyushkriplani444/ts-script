type Trip = {
  pickup: string;
  drop: string;
  warehouse?: string;
};

type Shipment = {
  pickups: string[];
  drops: string[];
  warehouse: string;
};

function validateTrips(shipment: Shipment, trips: Trip[]): boolean {
  const pickupSet = new Set(shipment.pickups);
  const dropSet = new Set(shipment.drops);
  const warehouseSet = new Set([shipment.warehouse]);

  for (const trip of trips) {
    if (!pickupSet.has(trip.pickup) && !warehouseSet.has(trip.pickup))
      return false;
    pickupSet.delete(trip.pickup);
    if (!dropSet.has(trip.drop) && !warehouseSet.has(trip.drop)) return false;
    dropSet.delete(trip.drop);
  }

  return pickupSet.size === 0 && dropSet.size === 0;
}

const shipment: Shipment = {
  pickups: ["A", "B"],
  drops: ["C", "D"],
  warehouse: "W",
};

const validTrips: Trip[] = [
  { pickup: "A", drop: "W" },
  { pickup: "B", drop: "W" },
  { pickup: "W", drop: "C" },
  { pickup: "W", drop: "D" },
];
console.log(validateTrips(shipment, validTrips)); // true

const invalidTrips: Trip[] = [
  { pickup: "A", drop: "W1" },
  { pickup: "B", drop: "W2" },
  { pickup: "W3", drop: "C" },
  { pickup: "W4", drop: "D" },
];
console.log(validateTrips(shipment, invalidTrips)); // false
