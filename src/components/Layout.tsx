import React from 'react';
import { Plane, Map as MapIcon, Calendar, Menu, X } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-600 p-2 rounded-lg">
                            <Plane className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900">HOMI</span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="/" className="text-slate-600 hover:text-primary-600 font-medium flex items-center gap-2 transition-colors">
                            <Calendar className="w-5 h-5" />
                            Trips
                        </a>
                        <a href="/explore" className="text-slate-600 hover:text-primary-600 font-medium flex items-center gap-2 transition-colors">
                            <MapIcon className="w-5 h-5" />
                            Explore
                        </a>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-slate-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-b px-4 py-4 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
                        <a href="/" className="text-slate-600 font-medium py-2">Trips</a>
                        <a href="/explore" className="text-slate-600 font-medium py-2">Explore</a>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
};
