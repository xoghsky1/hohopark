import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Layout } from './components/Layout';
import { useTripStore } from './store/useTripStore';
import {
    Plus, MapPin, Calendar, Camera, Trash2, Edit2,
    Plane, Train, Bus, UtensilsCrossed, Hotel, Eye,
    Heart, Sparkles, Image as ImageIcon, Clock
} from 'lucide-react';
import { Map } from './components/Map';
import { CreateTripModal } from './components/CreateTripModal';
import { AddActivityModal } from './components/AddActivityModal';
import { EditActivityModal } from './components/EditActivityModal';
import { PhotoLightbox } from './components/PhotoLightbox';
import { format, differenceInDays, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ActivityType, ItineraryItem, Trip, GeoPosition } from './types';

const DEFAULT_MAP_CENTER: GeoPosition = { lat: 48.8566, lng: 2.3522 };
const DEFAULT_ACTIVITY_TIME = '12:00';

const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
    flight: '비행기',
    train: '기차',
    bus: '버스',
    dining: '맛집',
    accommodation: '숙소',
    sightseeing: '관광',
    other: '기타',
};

const ACTIVITY_ICON_CLASS = 'w-4 h-4';

/**
 * 부부의 여행 추억 기록 앱
 */
export function App() {
    const { trips, addTrip, activeTripId, setActiveTrip, addPhotoToItem, addActivity, deleteActivity, updateActivity } = useTripStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const selectedItemRef = useRef<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
    const [isEditActivityModalOpen, setIsEditActivityModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<ItineraryItem | null>(null);
    const [activeDayIndex, setActiveDayIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

    // Photo lightbox state
    const [lightbox, setLightbox] = useState<{
        photos: string[];
        index: number;
        locationName?: string;
        time?: string;
    } | null>(null);

    const activeTrip = trips.find(t => t.id === activeTripId);

    const getCountdown = (startDate: string, endDate: string) => {
        const now = new Date();
        const start = parseISO(startDate);
        const end = parseISO(endDate);
        const diffStart = differenceInDays(start, now);
        const diffEnd = differenceInDays(end, now);

        if (diffEnd < 0) return { label: '다녀온 여행', emoji: '🥰', sub: '추억이 가득해요' };
        if (diffStart <= 0 && diffEnd >= 0) return { label: '여행 중!', emoji: '✈️', sub: '지금 이 순간을 즐겨요' };
        if (diffStart <= 7) return { label: `D-${diffStart}`, emoji: '💕', sub: '곧 떠나요!' };
        return { label: `D-${diffStart}`, emoji: '🗓️', sub: '설레는 기다림' };
    };

    const handleCreateTrip = (newTrip: Trip) => {
        addTrip(newTrip);
        setActiveTrip(newTrip.id);
        setActiveDayIndex(0);
    };

    const handleAddActivity = (item: ItineraryItem) => {
        if (activeTrip && activeTrip.itinerary[activeDayIndex]) {
            addActivity(activeTrip.id, activeTrip.itinerary[activeDayIndex].date, item);
        }
    };

    const sortedItems = useMemo(() => {
        if (!activeTrip || !activeTrip.itinerary[activeDayIndex]) return [];
        return [...activeTrip.itinerary[activeDayIndex].items].sort((a, b) => a.time.localeCompare(b.time));
    }, [activeTrip, activeDayIndex]);

    const totalPhotos = useMemo(() => {
        if (!activeTrip) return 0;
        return activeTrip.itinerary.reduce((total, day) =>
            total + day.items.reduce((dayTotal, item) => dayTotal + item.photos.length, 0), 0);
    }, [activeTrip]);

    const mapMarkers = sortedItems.map((item, index) => ({
        id: item.id,
        position: item.position,
        title: item.title,
        time: item.time,
        index: index + 1
    }));

    const getActivityIcon = (type: ActivityType) => {
        switch (type) {
            case 'flight': return <Plane className={ACTIVITY_ICON_CLASS} />;
            case 'train': return <Train className={ACTIVITY_ICON_CLASS} />;
            case 'bus': return <Bus className={ACTIVITY_ICON_CLASS} />;
            case 'dining': return <UtensilsCrossed className={ACTIVITY_ICON_CLASS} />;
            case 'accommodation': return <Hotel className={ACTIVITY_ICON_CLASS} />;
            case 'sightseeing': return <Eye className={ACTIVITY_ICON_CLASS} />;
            default: return <MapPin className={ACTIVITY_ICON_CLASS} />;
        }
    };

    const getActivityTypeLabel = (type: ActivityType) => {
        return ACTIVITY_TYPE_LABELS[type];
    };

    const handleDeleteActivity = (itemId: string) => {
        if (activeTripId) {
            deleteActivity(activeTripId, itemId);
        }
    };

    const handleEditActivity = (item: ItineraryItem) => {
        setEditingActivity(item);
        setIsEditActivityModalOpen(true);
    };

    const handleUpdateActivity = (updates: Partial<ItineraryItem>) => {
        if (activeTripId && editingActivity) {
            updateActivity(activeTripId, editingActivity.id, updates);
            setEditingActivity(null);
        }
    };

    const handleAddActivityFromMap = (dayIndex: number, position: GeoPosition, locationName: string) => {
        if (!activeTripId || !activeTrip) return;
        const dayDate = activeTrip.itinerary[dayIndex]?.date;
        if (!dayDate) return;

        const newActivity: ItineraryItem = {
            id: crypto.randomUUID(),
            time: DEFAULT_ACTIVITY_TIME,
            title: locationName,
            locationName,
            position,
            activityType: 'sightseeing',
            memo: '',
            photos: [],
        };

        addActivity(activeTripId, dayDate, newActivity);
    };

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

        e.target.value = '';
    };

    const openLightbox = useCallback((photos: string[], index: number, locationName?: string, time?: string) => {
        setLightbox({ photos, index, locationName, time });
    }, []);

    const getPhotoGridClass = (count: number) => {
        if (count === 1) return 'photo-grid cols-1';
        if (count === 2) return 'photo-grid cols-2';
        return 'photo-grid cols-3';
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-64px)] flex flex-col">
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

                <EditActivityModal
                    isOpen={isEditActivityModalOpen}
                    onClose={() => setIsEditActivityModalOpen(false)}
                    onUpdate={handleUpdateActivity}
                    activity={editingActivity}
                />

                {/* Photo Lightbox */}
                {lightbox && (
                    <PhotoLightbox
                        photos={lightbox.photos}
                        currentIndex={lightbox.index}
                        isOpen={true}
                        onClose={() => setLightbox(null)}
                        onNavigate={(index) => setLightbox(prev => prev ? { ...prev, index } : null)}
                        locationName={lightbox.locationName}
                        time={lightbox.time}
                    />
                )}

                {!activeTrip ? (
                    /* ===== Empty State: 첫 여행 만들기 유도 ===== */
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center py-16 px-8 warm-card rounded-[2.5rem] max-w-lg w-full animate-scale-in">
                            {/* Floating Heart Animation */}
                            <div className="relative w-24 h-24 mx-auto mb-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-rose-200 rounded-3xl animate-float" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-4xl">💑</span>
                                </div>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 font-serif">
                                우리만의 여행을 시작해요
                            </h2>
                            <p className="text-slate-500 mb-2 leading-relaxed text-sm md:text-base">
                                함께 떠나는 여행, 함께 만드는 추억
                            </p>
                            <p className="text-slate-400 mb-8 text-xs md:text-sm">
                                사진과 메모로 소중한 순간을 영원히 간직하세요 ✨
                            </p>

                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="btn-romantic inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base shadow-xl"
                            >
                                <Heart className="w-5 h-5" fill="white" />
                                첫 번째 여행 만들기
                            </button>

                            {/* Trip list for returning users */}
                            {trips.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-primary-100/50">
                                    <p className="text-xs text-slate-400 mb-3 font-medium">이전 여행 기록</p>
                                    <div className="flex flex-col gap-2">
                                        {trips.map(trip => (
                                            <button
                                                key={trip.id}
                                                onClick={() => {
                                                    setActiveTrip(trip.id);
                                                    setActiveDayIndex(0);
                                                }}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-50/50 transition-all text-left group"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-rose-100 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                                                    ✈️
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-slate-700 text-sm truncate">{trip.title}</p>
                                                    <p className="text-xs text-slate-400 truncate">{trip.destination}</p>
                                                </div>
                                                <span className="text-xs text-primary-400 font-medium">
                                                    {format(parseISO(trip.startDate), 'yy.MM.dd')}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* ===== Active Trip View ===== */
                    <div className="space-y-5 flex flex-col flex-1 min-h-0">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 flex-shrink-0 animate-slide-up">
                            <div>
                                <div className="flex items-center gap-3 mb-1.5">
                                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight leading-tight font-serif">
                                        {activeTrip.title}
                                    </h1>
                                    <button
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="p-1.5 hover:bg-primary-50 rounded-lg text-slate-400 hover:text-primary-500 transition-colors"
                                        title="새 여행 만들기"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-sm">
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <MapPin className="w-4 h-4 text-primary-400" />
                                        <span className="truncate max-w-[200px]">{activeTrip.destination}</span>
                                    </div>
                                    <span className="text-primary-200">•</span>
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Calendar className="w-4 h-4 text-primary-400" />
                                        <span>
                                            {format(parseISO(activeTrip.startDate), 'M월 d일', { locale: ko })} — {format(parseISO(activeTrip.endDate), 'M월 d일', { locale: ko })}
                                        </span>
                                    </div>
                                    {totalPhotos > 0 && (
                                        <>
                                            <span className="text-primary-200">•</span>
                                            <div className="flex items-center gap-1.5 font-medium text-primary-500">
                                                <ImageIcon className="w-4 h-4" />
                                                <span>사진 {totalPhotos}장</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Countdown Badge */}
                            {(() => {
                                const countdown = getCountdown(activeTrip.startDate, activeTrip.endDate);
                                return (
                                    <div className="warm-card px-5 py-3 rounded-2xl self-start md:self-auto text-center min-w-[120px]">
                                        <div className="text-lg mb-0.5">{countdown.emoji}</div>
                                        <div className="text-xl md:text-2xl font-black gradient-text tracking-tighter leading-none">
                                            {countdown.label}
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-1 font-medium">{countdown.sub}</div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Mobile View Toggle */}
                        <div className="flex lg:hidden p-1 rounded-2xl flex-shrink-0 warm-card">
                            <button
                                onClick={() => setActiveTab('list')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'list'
                                        ? 'bg-white text-primary-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <Clock className="w-4 h-4" />
                                타임라인
                            </button>
                            <button
                                onClick={() => setActiveTab('map')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'map'
                                        ? 'bg-white text-primary-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <MapPin className="w-4 h-4" />
                                지도
                            </button>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                            {/* Left Panel: Timeline */}
                            <div className={`${activeTab === 'list' ? 'flex' : 'hidden'} lg:flex flex-col warm-card rounded-3xl overflow-hidden`}>
                                {/* Day Tabs */}
                                <div className="p-4 md:p-5 border-b border-primary-100/30 flex items-center justify-between flex-shrink-0">
                                    <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-primary-400" />
                                        추억 타임라인
                                    </h2>
                                    <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar max-w-[60%] px-1">
                                        {activeTrip.itinerary.map((day, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveDayIndex(index)}
                                                className={`px-3.5 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${activeDayIndex === index
                                                        ? 'day-tab-active'
                                                        : 'text-slate-500 hover:bg-white/80 hover:text-slate-700'
                                                    }`}
                                            >
                                                Day {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Current Day Date Display */}
                                {activeTrip.itinerary[activeDayIndex] && (
                                    <div className="px-4 md:px-5 py-2 bg-gradient-to-r from-primary-50/50 to-rose-50/30 text-xs text-slate-500 flex items-center gap-2 flex-shrink-0">
                                        <Calendar className="w-3 h-3 text-primary-400" />
                                        {format(parseISO(activeTrip.itinerary[activeDayIndex].date), 'yyyy년 M월 d일 EEEE', { locale: ko })}
                                    </div>
                                )}

                                {/* Items List */}
                                <div className="p-4 md:p-5 space-y-0 overflow-y-auto flex-1 custom-scrollbar">
                                    {sortedItems.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-50 to-rose-50 flex items-center justify-center mb-5 animate-float">
                                                <span className="text-3xl">📸</span>
                                            </div>
                                            <p className="font-bold text-slate-600 mb-1">아직 계획이 없어요</p>
                                            <p className="text-xs text-slate-400 px-8 mb-6 leading-relaxed">
                                                Day {activeDayIndex + 1}의 특별한 순간을 추가해보세요!
                                            </p>
                                            <button
                                                onClick={() => setIsAddActivityModalOpen(true)}
                                                className="btn-romantic flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
                                            >
                                                <Plus className="w-4 h-4" />
                                                추억 추가하기
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            {/* Timeline Line */}
                                            <div className="absolute left-[15px] top-4 bottom-4 w-[2px] timeline-line rounded-full" />

                                            {sortedItems.map((item, index) => (
                                                <div
                                                    key={item.id}
                                                    className="relative pl-10 pb-6 last:pb-0 animate-slide-up"
                                                    style={{ animationDelay: `${index * 80}ms` }}
                                                >
                                                    {/* Timeline Dot */}
                                                    <div className="absolute left-[8px] top-2 w-[16px] h-[16px] rounded-full timeline-dot z-10" />

                                                    {/* Card */}
                                                    <div className="bg-white/80 rounded-2xl p-4 hover:bg-white transition-all border border-primary-100/30 hover:border-primary-200/50 hover:shadow-md group">
                                                        {/* Header Row */}
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className="text-sm font-black text-primary-600 tracking-tight flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {item.time}
                                                                </span>
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-primary-50 to-rose-50 border border-primary-100/50 text-[10px] md:text-xs font-semibold text-slate-600">
                                                                    {getActivityIcon(item.activityType)}
                                                                    {getActivityTypeLabel(item.activityType)}
                                                                </span>
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleUploadClick(item.id)}
                                                                    className="flex items-center gap-1 text-[10px] font-bold text-primary-500 hover:text-primary-600 bg-primary-50 px-2.5 py-1.5 rounded-lg transition active:scale-95"
                                                                    title="사진 업로드"
                                                                >
                                                                    <Camera className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEditActivity(item)}
                                                                    className="flex items-center text-[10px] font-bold text-slate-400 hover:text-blue-500 bg-slate-50 px-2 py-1.5 rounded-lg transition active:scale-95"
                                                                    title="수정"
                                                                >
                                                                    <Edit2 className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteActivity(item.id)}
                                                                    className="flex items-center text-[10px] font-bold text-slate-400 hover:text-red-500 bg-slate-50 px-2 py-1.5 rounded-lg transition active:scale-95"
                                                                    title="삭제"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Title */}
                                                        <h3 className="text-base font-bold text-slate-800 mb-1">{item.title}</h3>

                                                        {/* Location */}
                                                        <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
                                                            <MapPin className="w-3 h-3 text-primary-300" />
                                                            <span>{item.locationName}</span>
                                                        </div>

                                                        {/* Memo */}
                                                        {item.memo && (
                                                            <div className="memo-text text-xs md:text-sm mb-3 leading-relaxed">
                                                                {item.memo}
                                                            </div>
                                                        )}

                                                        {/* Photo Grid */}
                                                        {item.photos.length > 0 && (
                                                            <div className={`${getPhotoGridClass(item.photos.length)} mt-3`}>
                                                                {item.photos.map((photo, photoIndex) => (
                                                                    <div
                                                                        key={photoIndex}
                                                                        className={`photo-item ${item.photos.length === 1 ? 'aspect-video' : 'aspect-square'
                                                                            }`}
                                                                        onClick={() => openLightbox(item.photos, photoIndex, item.locationName, item.time)}
                                                                    >
                                                                        <img
                                                                            src={photo}
                                                                            alt={`${item.title}의 추억 ${photoIndex + 1}`}
                                                                            loading="lazy"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Upload prompt if no photos */}
                                                        {item.photos.length === 0 && (
                                                            <button
                                                                onClick={() => handleUploadClick(item.id)}
                                                                className="mt-2 w-full py-3 border border-dashed border-primary-200/60 rounded-xl text-xs text-primary-400 hover:text-primary-500 hover:border-primary-300 hover:bg-primary-50/30 transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <Camera className="w-3.5 h-3.5" />
                                                                이 순간의 사진을 남겨보세요 📷
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add Activity Button */}
                                            <div className="relative pl-10 pt-2">
                                                <button
                                                    onClick={() => setIsAddActivityModalOpen(true)}
                                                    className="w-full py-4 border-2 border-dashed border-primary-200/50 rounded-2xl text-primary-400 font-bold text-sm hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                    추억 추가하기
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Panel: Map */}
                            <div className={`${activeTab === 'map' ? 'block' : 'hidden'} lg:block warm-card rounded-3xl overflow-hidden relative p-2`}>
                                <div className="w-full h-full rounded-[1.25rem] overflow-hidden">
                                    <Map
                                        center={sortedItems[0]?.position || DEFAULT_MAP_CENTER}
                                        markers={mapMarkers}
                                        bounds={activeTrip.bounds}
                                        days={activeTrip.itinerary.map((day, index) => ({
                                            date: day.date,
                                            dayNumber: index + 1,
                                        }))}
                                        onAddActivity={handleAddActivityFromMap}
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
