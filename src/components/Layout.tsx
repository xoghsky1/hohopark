import React from 'react';
import { Heart, Map as MapIcon, Calendar, Menu, X, Sparkles } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Subtle floating particles background */}
            <div className="particles-bg" aria-hidden="true">
                {['💕', '✨', '🌸', '💫', '🦋'].map((emoji, i) => (
                    <span
                        key={i}
                        className="particle"
                        style={{
                            left: `${15 + i * 18}%`,
                            top: `${10 + (i % 3) * 30}%`,
                            animationDelay: `${i * 1.5}s`,
                            animationDuration: `${6 + i * 2}s`,
                            fontSize: `${16 + (i % 3) * 6}px`,
                        }}
                    >
                        {emoji}
                    </span>
                ))}
            </div>

            {/* Header */}
            <header className="glass sticky top-0 z-50 border-b border-primary-100/50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="relative">
                            <div className="bg-gradient-to-br from-primary-500 to-rose-500 p-2 rounded-xl shadow-lg shadow-primary-200/50">
                                <Heart className="text-white w-5 h-5" fill="white" />
                            </div>
                            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-warm-400 animate-pulse" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xl font-bold tracking-tight text-slate-800 font-serif">우리의 여행</span>
                            <span className="text-[10px] text-primary-400 font-medium tracking-widest">OUR JOURNEY</span>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        <a href="/" className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50/50 font-medium transition-all">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">여행 목록</span>
                        </a>
                        <a href="/explore" className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50/50 font-medium transition-all">
                            <MapIcon className="w-4 h-4" />
                            <span className="text-sm">탐색하기</span>
                        </a>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isMobileMenuOpen && (
                    <div className="md:hidden glass border-t border-primary-100/30 px-4 py-4 flex flex-col gap-2 animate-in slide-in-from-top duration-200">
                        <a href="/" className="flex items-center gap-3 text-slate-700 font-medium py-3 px-4 rounded-xl hover:bg-primary-50/50 transition-all">
                            <Calendar className="w-5 h-5 text-primary-500" />
                            여행 목록
                        </a>
                        <a href="/explore" className="flex items-center gap-3 text-slate-700 font-medium py-3 px-4 rounded-xl hover:bg-primary-50/50 transition-all">
                            <MapIcon className="w-5 h-5 text-primary-500" />
                            탐색하기
                        </a>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative z-10">
                {children}
            </main>
        </div>
    );
};
