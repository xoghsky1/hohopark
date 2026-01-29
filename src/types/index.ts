export interface Trip {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    destination: string;
    bounds?: {
        north: number;
        south: number;
        east: number;
        west: number;
    };
    itinerary: ItineraryDay[];
}

export interface ItineraryDay {
    date: string;
    items: ItineraryItem[];
}

export type ActivityType = 'sightseeing' | 'dining' | 'accommodation' | 'flight' | 'train' | 'bus' | 'other';

export interface ItineraryItem {
    id: string;
    time: string;
    title: string;
    locationName: string;
    memo: string;
    activityType: ActivityType;
    position: {
        lat: number;
        lng: number;
    };
    photos: string[]; // Base64 or local blob URLs for MVP
}
