import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Trip, ItineraryItem, ItineraryDay } from '../types';

/**
 * Local storage key for persisting trip data.
 */
const TRIP_STORAGE_KEY = 'homi-trip-storage';

/**
 * State interface for the trip store.
 */
interface TripState {
    trips: Trip[];
    activeTripId: string | null;
    addTrip: (trip: Trip) => void;
    setActiveTrip: (id: string) => void;
    updateItineraryItem: (tripId: string, itemId: string, updates: Partial<ItineraryItem>) => void;
    addPhotoToItem: (tripId: string, itemId: string, photoUrl: string) => void;
    addActivity: (tripId: string, dayDate: string, item: ItineraryItem) => void;
    deleteActivity: (tripId: string, itemId: string) => void;
    updateActivity: (tripId: string, itemId: string, updates: Partial<ItineraryItem>) => void;
}

/**
 * Zustand store for managing trip state with local storage persistence.
 */
export const useTripStore = create<TripState>()(
    persist(
        (set) => ({
            trips: [],
            activeTripId: null,

            addTrip: (trip) => set((state) => ({ trips: [...state.trips, trip] })),

            setActiveTrip: (id) => set({ activeTripId: id }),

            addActivity: (tripId: string, dayDate: string, item: ItineraryItem) =>
                set((state: TripState) => ({
                    trips: state.trips.map((trip: Trip) =>
                        trip.id === tripId
                            ? {
                                ...trip,
                                itinerary: trip.itinerary.map((day) =>
                                    day.date === dayDate
                                        ? { ...day, items: [...day.items, item] }
                                        : day
                                ),
                            }
                            : trip
                    ),
                })),

            updateItineraryItem: (tripId: string, itemId: string, updates: Partial<ItineraryItem>) =>
                set((state: TripState) => ({
                    trips: state.trips.map((trip: Trip) =>
                        trip.id === tripId
                            ? {
                                ...trip,
                                itinerary: trip.itinerary.map((day: ItineraryDay) => ({
                                    ...day,
                                    items: day.items.map((item: ItineraryItem) =>
                                        item.id === itemId ? { ...item, ...updates } : item
                                    ),
                                })),
                            }
                            : trip
                    ),
                })),

            addPhotoToItem: (tripId: string, itemId: string, photoUrl: string) =>
                set((state: TripState) => ({
                    trips: state.trips.map((trip: Trip) =>
                        trip.id === tripId
                            ? {
                                ...trip,
                                itinerary: trip.itinerary.map((day: ItineraryDay) => ({
                                    ...day,
                                    items: day.items.map((item: ItineraryItem) =>
                                        item.id === itemId
                                            ? { ...item, photos: [...item.photos, photoUrl] }
                                            : item
                                    ),
                                })),
                            }
                            : trip
                    ),
                })),

            deleteActivity: (tripId: string, itemId: string) =>
                set((state: TripState) => ({
                    trips: state.trips.map((trip: Trip) =>
                        trip.id === tripId
                            ? {
                                ...trip,
                                itinerary: trip.itinerary.map((day) => ({
                                    ...day,
                                    items: day.items.filter((item) => item.id !== itemId),
                                })),
                            }
                            : trip
                    ),
                })),

            updateActivity: (tripId: string, itemId: string, updates: Partial<ItineraryItem>) =>
                set((state: TripState) => ({
                    trips: state.trips.map((trip: Trip) =>
                        trip.id === tripId
                            ? {
                                ...trip,
                                itinerary: trip.itinerary.map((day) => ({
                                    ...day,
                                    items: day.items.map((item: ItineraryItem) =>
                                        item.id === itemId ? { ...item, ...updates } : item
                                    ),
                                })),
                            }
                            : trip
                    ),
                })),
        }),
        {
            name: TRIP_STORAGE_KEY,
        }
    )
);
