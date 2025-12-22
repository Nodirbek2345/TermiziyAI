'use client';

import { useState } from 'react';
import { Trash2, Copy, Check, ExternalLink, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

interface MediaResource {
    public_id: string;
    secure_url: string;
    format: string;
    resource_type: string;
    created_at: string;
}

interface MediaGalleryProps {
    resources: MediaResource[];
    onDelete: (public_id: string) => Promise<void>;
}

export default function MediaGallery({ resources, onDelete }: MediaGalleryProps) {
    const [copyingId, setCopyingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleCopy = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopyingId(id);
        setTimeout(() => setCopyingId(null), 2000);
    };

    const handleDelete = async (public_id: string) => {
        if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return;

        setDeletingId(public_id);
        await onDelete(public_id);
        setDeletingId(null);
    };

    if (resources.length === 0) {
        return (
            <div className="text-center py-12 text-white/30 border border-white/10 rounded-xl bg-white/5">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p>Hozircha fayllar yo'q</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {resources.map((res) => (
                <div key={res.public_id} className="group relative aspect-square bg-black/50 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all">
                    {/* Preview */}
                    {res.resource_type === 'video' ? (
                        <video src={res.secure_url} className="w-full h-full object-cover" />
                    ) : (
                        <img src={res.secure_url} alt={res.public_id} className="w-full h-full object-cover" />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <div className="flex gap-2 justify-end mb-auto pt-2">
                            <a
                                href={res.secure_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                            >
                                <ExternalLink size={16} />
                            </a>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => handleCopy(res.secure_url, res.public_id)}
                                className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-2 transition-colors"
                            >
                                {copyingId === res.public_id ? (
                                    <>
                                        <Check size={14} className="text-green-400" />
                                        Nusxalandi
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} />
                                        URL Nusxalash
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => handleDelete(res.public_id)}
                                disabled={deletingId === res.public_id}
                                className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {deletingId === res.public_id ? (
                                    <span className="animate-spin">⌛</span>
                                ) : (
                                    <Trash2 size={14} />
                                )}
                                O'chirish
                            </button>
                        </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur rounded text-[10px] text-white/70 uppercase font-mono">
                        {res.format}
                    </div>
                </div>
            ))}
        </div>
    );
}
