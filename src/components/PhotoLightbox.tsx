import React, { useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

interface PhotoLightboxProps {
    photos: string[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (index: number) => void;
    locationName?: string;
    time?: string;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
    photos,
    currentIndex,
    isOpen,
    onClose,
    onNavigate,
    locationName,
    time,
}) => {
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
        if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) onNavigate(currentIndex + 1);
    }, [currentIndex, photos.length, onClose, onNavigate]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen || photos.length === 0) return null;

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <div className="relative w-full h-full flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Navigation */}
                {currentIndex > 0 && (
                    <button
                        onClick={() => onNavigate(currentIndex - 1)}
                        className="absolute left-4 md:left-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}
                {currentIndex < photos.length - 1 && (
                    <button
                        onClick={() => onNavigate(currentIndex + 1)}
                        className="absolute right-4 md:right-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                )}

                {/* Main Image */}
                <img
                    src={photos[currentIndex]}
                    alt={`추억 사진 ${currentIndex + 1}`}
                    className="lightbox-image"
                    key={currentIndex}
                />

                {/* Bottom Info Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="max-w-2xl mx-auto text-center">
                        {(locationName || time) && (
                            <div className="flex items-center justify-center gap-3 text-white/80 text-sm mb-2">
                                {time && <span className="font-medium">{time}</span>}
                                {time && locationName && <Heart className="w-3 h-3 text-primary-300" fill="currentColor" />}
                                {locationName && <span>{locationName}</span>}
                            </div>
                        )}
                        <div className="flex items-center justify-center gap-2">
                            {photos.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => onNavigate(i)}
                                    className={`transition-all duration-300 rounded-full ${i === currentIndex
                                            ? 'w-8 h-2 bg-white'
                                            : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
