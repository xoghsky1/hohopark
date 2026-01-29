import React, { useEffect, useState, useCallback, memo } from 'react';
import { Map as GoogleMap, AdvancedMarker, useMap, InfoWindow } from '@vis.gl/react-google-maps';
import { Plus, X, Clock, Type, Tag } from 'lucide-react';
import { ActivityType } from '../types';

interface MapProps {
    center: { lat: number; lng: number };
    markers: Array<{ id: string; position: { lat: number; lng: number }; title: string; time: string; index: number }>;
    bounds?: { north: number; south: number; east: number; west: number };
    days?: Array<{ date: string; dayNumber: number }>;
    onAddActivity?: (dayIndex: number, position: { lat: number; lng: number }, locationName: string) => void;
}

interface AddActivityFormProps {
    locationName: string;
    days: Array<{ date: string; dayNumber: number }>;
    onAdd: (dayIndex: number, title: string, time: string, type: ActivityType) => void;
    onClose: () => void;
}

const AddActivityForm = memo<AddActivityFormProps>(({ locationName, days, onAdd, onClose }) => {
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [activityTitle, setActivityTitle] = useState('');
    const [activityTime, setActivityTime] = useState('12:00');
    const [activityType, setActivityType] = useState<ActivityType>('sightseeing');

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (activityTitle.trim()) {
            onAdd(selectedDayIndex, activityTitle, activityTime, activityType);
        }
    }, [selectedDayIndex, activityTitle, activityTime, activityType, onAdd]);

    return (
        <div className="p-4 min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">Add Activity</h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                    type="button"
                >
                    <X className="w-4 h-4 text-slate-500" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                        <Type className="w-3 h-3" />
                        Title
                    </label>
                    <input
                        type="text"
                        placeholder="Activity name"
                        value={activityTitle}
                        onChange={(e) => setActivityTitle(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Time
                        </label>
                        <input
                            type="time"
                            value={activityTime}
                            onChange={(e) => setActivityTime(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            Type
                        </label>
                        <select
                            value={activityType}
                            onChange={(e) => setActivityType(e.target.value as ActivityType)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        >
                            <option value="sightseeing">🏛️ Sightseeing</option>
                            <option value="dining">🍽️ Dining</option>
                            <option value="accommodation">🏨 Hotel</option>
                            <option value="flight">✈️ Flight</option>
                            <option value="train">🚆 Train</option>
                            <option value="bus">🚌 Bus</option>
                            <option value="other">📍 Other</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">
                        Select Day
                    </label>
                    <select
                        value={selectedDayIndex}
                        onChange={(e) => setSelectedDayIndex(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium"
                    >
                        {days.map((day, index) => (
                            <option key={index} value={index}>
                                Day {day.dayNumber} - {day.date}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                    📍 {locationName}
                </div>

                <button
                    type="submit"
                    disabled={!activityTitle.trim()}
                    className={`w-full py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${activityTitle.trim()
                            ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm active:scale-95'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    <Plus className="w-4 h-4" />
                    Add to Itinerary
                </button>
            </form>
        </div>
    );
});

AddActivityForm.displayName = 'AddActivityForm';

export const Map: React.FC<MapProps> = ({ center, markers, bounds, days = [], onAddActivity }) => {
    const map = useMap();
    const [clickedLocation, setClickedLocation] = useState<{
        position: { lat: number; lng: number };
        locationName: string;
    } | null>(null);

    useEffect(() => {
        if (map && bounds) {
            const googleBounds = new google.maps.LatLngBounds(
                { lat: bounds.south, lng: bounds.west },
                { lat: bounds.north, lng: bounds.east }
            );
            map.fitBounds(googleBounds);
        }
    }, [map, bounds]);

    useEffect(() => {
        if (!map) return;

        const clickListener = map.addListener('click', async (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return;

            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            // Use Geocoding API to get location name
            const geocoder = new google.maps.Geocoder();
            try {
                const result = await geocoder.geocode({ location: { lat, lng } });
                const locationName = result.results[0]?.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

                setClickedLocation({
                    position: { lat, lng },
                    locationName
                });
            } catch (error) {
                console.error('Geocoding error:', error);
                setClickedLocation({
                    position: { lat, lng },
                    locationName: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                });
            }
        });

        return () => {
            if (clickListener) {
                google.maps.event.removeListener(clickListener);
            }
        };
    }, [map]);

    const handleAddActivity = useCallback((dayIndex: number, title: string, time: string, type: ActivityType) => {
        if (clickedLocation && onAddActivity) {
            onAddActivity(dayIndex, clickedLocation.position, title);
            setClickedLocation(null);
        }
    }, [clickedLocation, onAddActivity]);

    const handleClose = useCallback(() => {
        setClickedLocation(null);
    }, []);

    return (
        <GoogleMap
            style={{ width: '100%', height: '100%' }}
            defaultCenter={center}
            defaultZoom={13}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            mapId={'DEMO_MAP_ID'}
            colorScheme='LIGHT'
        >
            {markers.map((marker) => (
                <AdvancedMarker
                    key={marker.id}
                    position={marker.position}
                    title={`${marker.time} - ${marker.title}`}
                >
                    <div className="relative">
                        <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm shadow-lg border-4 border-white">
                            {marker.index}
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded-lg shadow-md text-xs font-bold text-slate-700 whitespace-nowrap border border-slate-200">
                            {marker.time}
                        </div>
                    </div>
                </AdvancedMarker>
            ))}

            {clickedLocation && days.length > 0 && (
                <InfoWindow
                    position={clickedLocation.position}
                    onCloseClick={handleClose}
                >
                    <AddActivityForm
                        locationName={clickedLocation.locationName}
                        days={days}
                        onAdd={handleAddActivity}
                        onClose={handleClose}
                    />
                </InfoWindow>
            )}
        </GoogleMap>
    );
};
