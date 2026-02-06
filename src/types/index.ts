/**
 * Geographic bounds for a map region.
 */
export interface GeoBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

/**
 * Geographic position with latitude and longitude.
 */
export interface GeoPosition {
    lat: number;
    lng: number;
}

/**
 * Represents a travel trip with itinerary and destination information.
 */
export interface Trip {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    destination: string;
    bounds?: GeoBounds;
    itinerary: ItineraryDay[];
}

/**
 * Represents a single day in a trip itinerary.
 */
export interface ItineraryDay {
    date: string;
    items: ItineraryItem[];
}

/**
 * Types of activities that can be scheduled in an itinerary.
 */
export type ActivityType = 'sightseeing' | 'dining' | 'accommodation' | 'flight' | 'train' | 'bus' | 'other';

/**
 * Represents a single activity or event in an itinerary.
 */
export interface ItineraryItem {
    id: string;
    time: string;
    title: string;
    locationName: string;
    memo: string;
    activityType: ActivityType;
    position: GeoPosition;
    photos: string[]; // Base64 or local blob URLs for MVP
}
