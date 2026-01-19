import React, { useState, useRef, useEffect } from 'react';
import { X, Clock, MapPin, Type, AlignLeft } from 'lucide-react';
import { ItineraryItem } from '../types';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface AddActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (item: ItineraryItem) => void;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({ isOpen, onClose, onAdd }) => {
    const placesLibrary = useMapsLibrary('places');
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('12:00');
    const [locationName, setLocationName] = useState('');
    const [memo, setMemo] = useState('');
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
        if (!placesLibrary || !inputRef.current) return;

        const options = {
            fields: ['geometry', 'name', 'formatted_address'],
        };

        autocompleteRef.current = new placesLibrary.Autocomplete(inputRef.current, options);

        const listener = autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();
            if (place?.name || place?.formatted_address) {
                setLocationName(place.name || place.formatted_address || '');
            }
            if (place?.geometry?.location) {
                setPosition({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
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
        if (!position) return;

        const newItem: ItineraryItem = {
            id: crypto.randomUUID(),
            time,
            title,
            locationName,
            memo,
            position,
            photos: []
        };

        onAdd(newItem);
        onClose();
        // Reset fields
        setTitle('');
        setTime('12:00');
        setLocationName('');
        setMemo('');
        setPosition(null);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Add New Activity</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Type className="w-4 h-4 text-primary-500" />
                            Activity Title
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="e.g., Dinner at Eiffel Tower"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary-500" />
                                Time
                            </label>
                            <input
                                required
                                type="time"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary-500" />
                                Location
                            </label>
                            <input
                                ref={inputRef}
                                required
                                type="text"
                                placeholder={placesLibrary ? "Search place..." : "Loading maps..."}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                                value={locationName}
                                onChange={(e) => setLocationName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <AlignLeft className="w-4 h-4 text-primary-500" />
                            Memo (Optional)
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Note down something..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium resize-none"
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!position}
                            className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] ${position
                                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-200'
                                : 'bg-slate-100 text-slate-400 border border-slate-200 shadow-none cursor-not-allowed'
                                }`}
                        >
                            Add to Itinerary
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
