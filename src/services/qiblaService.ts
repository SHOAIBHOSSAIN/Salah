import { Coordinates } from '../types/Interface';

const KAABA: Coordinates = { latitude: 21.4225, longitude: 39.8262 };

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Calculates the compass bearing (0-360, where 0 = true north) from the user's
 * location to the Kaaba, using the great-circle bearing formula.
 */
export function getQiblaBearing(userLocation: Coordinates): number {
  const lat1 = toRadians(userLocation.latitude);
  const lat2 = toRadians(KAABA.latitude);
  const deltaLon = toRadians(KAABA.longitude - userLocation.longitude);

  const y = Math.sin(deltaLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

  const bearingRad = Math.atan2(y, x);
  const bearingDeg = toDegrees(bearingRad);

  return (bearingDeg + 360) % 360; // normalize to 0-360
}

/**
 * Great-circle distance to the Kaaba in kilometers (Haversine formula) —
 * a nice-to-have to show the user, e.g. "6,847 km to Makkah".
 */
export function getDistanceToKaabaKm(userLocation: Coordinates): number {
  const R = 6371; // Earth radius in km
  const lat1 = toRadians(userLocation.latitude);
  const lat2 = toRadians(KAABA.latitude);
  const deltaLat = toRadians(KAABA.latitude - userLocation.latitude);
  const deltaLon = toRadians(KAABA.longitude - userLocation.longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
