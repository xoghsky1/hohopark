import React, { useRef, useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { useTripStore } from './store/useTripStore';
import { Plus, MapPin, Calendar, Camera } from 'lucide-react';
import { Map } from './components/Map';
import { CreateTripModal } from './components/CreateTripModal';
import { AddActivityModal } from './components/AddActivityModal';
import { format, differenceInDays, parseISO } from 'date-fns';

function App() {
    const { trips, addTrip, activeTripId, setActiveTrip, addPhotoToItem, addActivity } = useTripStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const selectedItemRef = useRef<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
    const [activeDayIndex, setActiveDayIndex] = useState(0);

    const activeTrip = trips.find(t => t.id === activeTripId);

    const getCountdown = (date: string) => {
        const diff = differenceInDays(parseISO(date), new Date());
        if (diff < 0) return 'Trip Started!';
        return `${diff} Days Left`;
    };

    const handleCreateTrip = (newTrip: any) => {
        addTrip(newTrip);
        setActiveTrip(newTrip.id);
        setActiveDayIndex(0);
    };

    const handleAddActivity = (item: any) => {
        if (activeTrip && activeTrip.itinerary[activeDayIndex]) {
            addActivity(activeTrip.id, activeTrip.itinerary[activeDayIndex].date, item);
        }
    };

    const sortedItems = useMemo(() => {
        if (!activeTrip || !activeTrip.itinerary[activeDayIndex]) return [];
        return [...activeTrip.itinerary[activeDayIndex].items].sort((a, b) => a.time.localeCompare(b.time));
    }, [activeTrip, activeDayIndex]);

    const mapMarkers = sortedItems.map((item) => ({
        id: item.id,
        position: item.position,
        title: item.title
    }));

    const [activeTab, setActiveTab] = React.useState<'list' | 'map'>('list');

    const handleUploadClick = (itemId: string) => {
        selectedItemRef.current = itemId;
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !selectedItemRef.current || !activeTripId) return;

        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                addPhotoToItem(activeTripId, selectedItemRef.current!, reader.result as string);
            };
            reader.readAsDataURL(file);
        });

        // Reset input
        e.target.value = '';
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-64px)] flex flex-col">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />

                <CreateTripModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreateTrip}
                />

                <AddActivityModal
                    isOpen={isAddActivityModalOpen}
                    onClose={() => setIsAddActivityModalOpen(false)}
                    onAdd={handleAddActivity}
                />

                {!activeTrip ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center py-20 px-8 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 max-w-lg w-full">
                            <div className="bg-primary-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Plus className="w-10 h-10 text-primary-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">No active trips yet</h2>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Ready for your next adventure? Create a trip to start planning your itinerary and logging your best moments.
                            </p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-700 transition shadow-xl shadow-primary-200 active:scale-95"
                            >
                                <Plus className="w-5 h-5" />
                                Start Planning Now
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 flex flex-col flex-1 min-h-0">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 flex-shrink-0">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">{activeTrip.title}</h1>
                                    <button
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary-600 transition-colors"
                                        title="Create another trip"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500 text-sm md:text-base">
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <MapPin className="w-4 h-4 text-primary-500" />
                                        <span className="truncate max-w-[200px]">{activeTrip.destination}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Calendar className="w-4 h-4 text-primary-500" />
                                        <span>
                                            {format(parseISO(activeTrip.startDate), 'MMM dd')} - {format(parseISO(activeTrip.endDate), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary-50 px-4 py-2 md:px-6 md:py-3 rounded-2xl border border-primary-100 self-start md:self-auto">
                                <span className="text-[10px] md:text-xs font-bold text-primary-600 uppercase tracking-wider">Countdown</span>
                                <div className="text-lg md:text-2xl font-black text-primary-900 tracking-tighter">
                                    {getCountdown(activeTrip.startDate)}
                                </div>
                            </div>
                        </div>

                        {/* Mobile View Toggle */}
                        <div className="flex lg:hidden bg-slate-100 p-1 rounded-xl flex-shrink-0">
                            <button
                                onClick={() => setActiveTab('list')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Calendar className="w-4 h-4" />
                                List
                            </button>
                            <button
                                onClick={() => setActiveTab('map')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'map' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <MapPin className="w-4 h-4" />
                                Map
                            </button>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                            {/* Left Panel: List */}
                            <div className={`${activeTab === 'list' ? 'flex' : 'hidden'} lg:flex flex-col bg-white rounded-3xl shadow-sm border overflow-hidden`}>
                                <div className="p-4 md:p-6 border-b flex items-center justify-between flex-shrink-0 bg-slate-50/50">
                                    <h2 className="text-lg font-bold text-slate-900">Itinerary</h2>
                                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar max-w-[60%] px-1">
                                        {activeTrip.itinerary.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveDayIndex(index)}
                                                className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap ${activeDayIndex === index
                                                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-200'
                                                    : 'text-slate-600 hover:bg-white hover:shadow-sm'
                                                    }`}
                                            >
                                                Day {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 md:p-6 space-y-6 md:space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                                    {sortedItems.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                                            <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                                                <Calendar className="w-8 h-8 opacity-20" />
                                            </div>
                                            <p className="font-medium text-slate-500">No activities planned yet</p>
                                            <p className="text-xs px-8 mt-1">Start adding places to visit for Day {activeDayIndex + 1}!</p>
                                            <button
                                                onClick={() => setIsAddActivityModalOpen(true)}
                                                className="mt-6 flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition active:scale-95"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Activity
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="pb-4">
                                            {sortedItems.map((item) => (
                                                <div key={item.id} className="relative pl-6 md:pl-8 border-l-2 border-slate-100 last:border-0 pb-6 md:pb-8 last:pb-0">
                                                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary-500 border-4 border-white shadow-sm" />

                                                    <div className="bg-slate-50 rounded-2xl p-4 md:p-5 hover:bg-slate-100/50 transition border border-transparent hover:border-slate-200 group">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-xs md:text-sm font-black text-primary-600 tracking-tight">{item.time}</span>
                                                            <button
                                                                onClick={() => handleUploadClick(item.id)}
                                                                className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-slate-500 hover:text-primary-600 bg-white px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-xl border border-slate-100 shadow-sm transition active:scale-95 group-hover:border-primary-100"
                                                            >
                                                                <Camera className="w-3.5 h-3.5" />
                                                                Upload Photos
                                                            </button>
                                                        </div>
                                                        <h3 className="text-base md:text-lg font-bold text-slate-900">{item.title}</h3>
                                                        <div className="flex items-center gap-1 text-slate-500 text-xs md:text-sm mb-3">
                                                            <MapPin className="w-3.5 h-3.5 text-primary-400" />
                                                            <span>{item.locationName}</span>
                                                        </div>
                                                        <p className="text-slate-600 text-xs md:text-sm italic mb-4 leading-relaxed">{item.memo}</p>

                                                        {/* Photo Grid */}
                                                        {item.photos.length > 0 && (
                                                            <div className="grid grid-cols-3 gap-2.5 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                                {item.photos.map((photo, index) => (
                                                                    <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-sm border-2 border-white ring-1 ring-slate-100">
                                                                        <img src={photo} alt="" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            <button
                                                onClick={() => setIsAddActivityModalOpen(true)}
                                                className="mt-4 flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-primary-200 hover:text-primary-500 hover:bg-primary-50/30 transition-all active:scale-[0.99]"
                                            >
                                                <Plus className="w-5 h-5" />
                                                Add Another Activity
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Panel: Map */}
                            <div className={`${activeTab === 'map' ? 'block' : 'hidden'} lg:block bg-white rounded-[2.5rem] overflow-hidden relative shadow-sm border border-slate-200 p-2.5`}>
                                <div className="w-full h-full rounded-[2rem] overflow-hidden">
                                    <Map
                                        center={sortedItems[0]?.position || { lat: 48.8566, lng: 2.3522 }}
                                        markers={mapMarkers}
                                        bounds={activeTrip.bounds}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default App;
