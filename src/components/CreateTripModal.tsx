import React, { useState, useRef, useEffect } from 'react';
import { X, Globe, Calendar, MapPin } from 'lucide-react';
import { Trip, ItineraryDay } from '../types';
import { addDays, format, eachDayOfInterval, parseISO } from 'date-fns';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface CreateTripModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (trip: Trip) => void;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({ isOpen, onClose, onCreate }) => {
    const placesLibrary = useMapsLibrary('places');
    const [title, setTitle] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
    const [bounds, setBounds] = useState<Trip['bounds'] | undefined>(undefined);

    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
        if (!placesLibrary || !inputRef.current) return;

        const options = {
            fields: ['formatted_address', 'geometry', 'name'],
        };

        autocompleteRef.current = new placesLibrary.Autocomplete(inputRef.current, options);

        const listener = autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();
            if (place?.formatted_address) {
                setDestination(place.formatted_address);
            }
            if (place?.geometry?.viewport) {
                const vp = place.geometry.viewport;
                setBounds({
                    north: vp.getNorthEast().lat(),
                    south: vp.getSouthWest().lat(),
                    east: vp.getNorthEast().lng(),
                    west: vp.getSouthWest().lng()
                });
            }
        });

        return () => {
            if (listener) listener.remove();
        };
    }, [placesLibrary, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const days = eachDayOfInterval({
            start: parseISO(startDate),
            end: parseISO(endDate)
        });

        const itinerary: ItineraryDay[] = days.map(day => ({
            date: format(day, 'yyyy-MM-dd'),
            items: []
        }));

        const newTrip: Trip = {
            id: crypto.randomUUID(),
            title,
            destination,
            startDate,
            endDate,
            bounds,
            itinerary
        };

        onCreate(newTrip);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Start New Adventure</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary-500" />
                            Trip Title
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="e.g., Summer in Europe"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary-500" />
                            Where to? (Search Location)
                        </label>
                        <input
                            ref={inputRef}
                            required
                            type="text"
                            placeholder={placesLibrary ? "Search country, city, or place..." : "Loading maps..."}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary-500" />
                                Start Date
                            </label>
                            <input
                                required
                                type="date"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-slate-700"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary-500" />
                                End Date
                            </label>
                            <input
                                required
                                type="date"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-200 transition-all active:scale-[0.98]"
                        >
                            Create My Trip!
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
