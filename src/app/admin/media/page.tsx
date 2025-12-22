'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MediaUploader from '@/components/admin/MediaUploader';
import MediaGallery from '@/components/admin/MediaGallery';
import { Loader2, RefreshCw } from 'lucide-react';

export default function MediaPage() {
    const [resources, setResources] = useState([]);
    const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video' | 'raw'>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchResources = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/media', { cache: 'no-store' });
            const data = await res.json();

            if (data.success) {
                setResources(data.resources);
                setError(null);
            } else {
                setError(data.error || 'Fayllarni yuklashda xatolik');
            }
        } catch (err) {
            setError('Serverga ulanishda xatolik');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (public_id: string) => {
        try {
            // Encode the ID to handle slashes correctly
            const encodedId = encodeURIComponent(public_id);
            const res = await fetch(`/api/media/${encodedId}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (data.success) {
                // Optimistic update or refetch
                setResources(prev => prev.filter((r: any) => r.public_id !== public_id));
            } else {
                alert("Xatolik: " + data.error);
            }
        } catch (err) {
            alert("O'chirishda xatolik yuz berdi");
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const filteredResources = resources.filter((res: any) => {
        if (activeTab === 'all') return true;
        return res.resource_type === activeTab;
    });

    const tabs = [
        { id: 'all', label: 'Barchasi' },
        { id: 'image', label: 'Rasmlar' },
        { id: 'video', label: 'Videolar' },
        { id: 'raw', label: 'Hujjatlar' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Media Menejer</h1>
                    <p className="text-white/50 mt-1">Rasm va videolarni boshqarish markazi</p>
                </div>
                <button
                    onClick={fetchResources}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                    title="Yangilash"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Uploader Section */}
            <MediaUploader onUploadSuccess={fetchResources} />

            {/* Gallery Section */}
            {/* Tabs & Gallery Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white/80">Yuklangan Fayllar</h2>

                    <div className="flex bg-white/5 p-1 rounded-xl">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="animate-spin text-purple-500" size={32} />
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                        {error}
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 min-h-[300px]">
                        <MediaGallery resources={filteredResources} onDelete={handleDelete} />
                    </div>
                )}
            </div>
        </div>
    );
}
