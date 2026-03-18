import React, { useState, useRef, useEffect } from 'react';
import { X, Globe, Calendar, MapPin, Heart, Sparkles } from 'lucide-react';
import { Trip, ItineraryDay, GeoBounds } from '../types';
import { addDays, format, eachDayOfInterval, parseISO } from 'date-fns';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

const DEFAULT_TRIP_DURATION_DAYS = 7;
const DATE_FORMAT = 'yyyy-MM-dd';

interface CreateTripModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (trip: Trip) => void;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({ isOpen, onClose, onCreate }) => {
    const placesLibrary = useMapsLibrary('places');
    const [title, setTitle] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState(format(new Date(), DATE_FORMAT));
    const [endDate, setEndDate] = useState(format(addDays(new Date(), DEFAULT_TRIP_DURATION_DAYS), DATE_FORMAT));
    const [bounds, setBounds] = useState<GeoBounds | undefined>(undefined);

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
            date: format(day, DATE_FORMAT),
            items: [],
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white/95 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl shadow-primary-900/10 overflow-hidden animate-in zoom-in-95 duration-300 border border-primary-100/30">
                {/* Header */}
                <div className="p-6 border-b border-primary-100/30 bg-gradient-to-r from-primary-50/50 to-rose-50/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-rose-400 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">새로운 여행 만들기</h2>
                                <p className="text-xs text-slate-400">둘만의 특별한 여행을 계획해요</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-xl transition-colors">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-primary-400" />
                            여행 제목
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="예) 우리의 파리 여행 🇫🇷"
                            className="w-full px-4 py-3.5 rounded-xl border border-primary-100 bg-white text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all font-medium"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary-400" />
                            어디로 떠나요?
                        </label>
                        <input
                            ref={inputRef}
                            required
                            type="text"
                            placeholder={placesLibrary ? "도시, 나라, 장소 검색..." : "지도 로딩 중..."}
                            className="w-full px-4 py-3.5 rounded-xl border border-primary-100 bg-white text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all font-medium"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary-400" />
                                출발일
                            </label>
                            <input
                                required
                                type="date"
                                className="w-full px-4 py-3.5 rounded-xl border border-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all font-medium text-slate-700"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary-400" />
                                귀국일
                            </label>
                            <input
                                required
                                type="date"
                                className="w-full px-4 py-3.5 rounded-xl border border-primary-100 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all font-medium"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-3">
                        <button
                            type="submit"
                            className="btn-romantic w-full font-bold py-4 rounded-xl text-base flex items-center justify-center gap-2"
                        >
                            <Heart className="w-5 h-5" fill="white" />
                            여행 만들기!
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
