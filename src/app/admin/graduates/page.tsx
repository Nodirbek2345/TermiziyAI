"use client";

import { useEffect, useState } from "react";
import { Plus, MoreVertical, GraduationCap, RefreshCcw, Trash2 } from "lucide-react";

interface Graduate {
    id: number;
    name: string;
    company: string;
    story: string;
    image: string;
}

export default function GraduatesPage() {
    const [graduates, setGraduates] = useState<Graduate[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingGraduate, setEditingGraduate] = useState<Graduate | null>(null);
    const [isAddingGraduate, setIsAddingGraduate] = useState(false);
    const [newGraduate, setNewGraduate] = useState({ name: '', company: '', story: '', image: '' });

    const fetchGraduates = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/graduates');
            const data = await res.json();
            setGraduates(data);
        } catch (error) {
            console.error("Failed to fetch graduates", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGraduates();
    }, []);

    const handleAddGraduate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/graduates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGraduate)
            });

            if (res.ok) {
                const created = await res.json();
                setGraduates([created, ...graduates]);
                setIsAddingGraduate(false);
                setNewGraduate({ name: '', company: '', story: '', image: '' });
            } else {
                alert("Xatolik");
            }
        } catch (error) { console.error(error); }
    };

    const deleteGraduate = async (id: number) => {
        if (!confirm("O'chirmoqchimisiz?")) return;
        try {
            const res = await fetch(`/api/graduates/${id}`, { method: 'DELETE' });
            if (res.ok) setGraduates(graduates.filter(g => g.id !== id));
        } catch (error) { console.error(error); }
    };

    const handleSaveGraduate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingGraduate) return;
        try {
            const res = await fetch(`/api/graduates/${editingGraduate.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingGraduate)
            });
            if (res.ok) {
                const updated = await res.json();
                setGraduates(graduates.map(g => g.id === updated.id ? updated : g));
                setEditingGraduate(null);
            }
        } catch (error) { console.error(error); }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Bitiruvchilar</h1>
                    <p className="text-white/40 text-sm">{loading ? "Yuklanmoqda..." : `Jami ${graduates.length} ta bitiruvchi`}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchGraduates} disabled={loading} className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-lg transition-colors">
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button onClick={() => setIsAddingGraduate(true)} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                        <Plus size={18} />
                        Yangi qo'shish
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {graduates.map((graduate) => (
                    <div key={graduate.id} className="bg-neutral-900/50 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-800 flex-shrink-0 overflow-hidden">
                                    {graduate.image ? <img src={graduate.image} alt={graduate.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🎓</div>}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{graduate.name}</h3>
                                    <p className="text-xs text-purple-400 font-medium">{graduate.company}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingGraduate(graduate)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white">
                                    <MoreVertical size={16} />
                                </button>
                                <button onClick={() => deleteGraduate(graduate.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-white/60 line-clamp-3">{graduate.story}</p>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {isAddingGraduate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Yangi bitiruvchi</h2>
                        <form onSubmit={handleAddGraduate} className="space-y-4">
                            <input type="text" required placeholder="Ismi" value={newGraduate.name} onChange={e => setNewGraduate({ ...newGraduate, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <input type="text" placeholder="Ish joyi / Kompaniya" value={newGraduate.company} onChange={e => setNewGraduate({ ...newGraduate, company: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <textarea placeholder="Muvaffaqiyat hikoyasi" value={newGraduate.story} onChange={e => setNewGraduate({ ...newGraduate, story: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <input type="text" placeholder="Rasm URL" value={newGraduate.image} onChange={e => setNewGraduate({ ...newGraduate, image: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsAddingGraduate(false)} className="px-4 py-2 text-white/60 hover:text-white">Bekor qilish</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 rounded-lg text-white">Qo'shish</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingGraduate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Bitiruvchini tahrirlash</h2>
                        <form onSubmit={handleSaveGraduate} className="space-y-4">
                            <input type="text" value={editingGraduate.name} onChange={e => setEditingGraduate({ ...editingGraduate, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <input type="text" value={editingGraduate.company} onChange={e => setEditingGraduate({ ...editingGraduate, company: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <textarea value={editingGraduate.story} onChange={e => setEditingGraduate({ ...editingGraduate, story: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <input type="text" value={editingGraduate.image} onChange={e => setEditingGraduate({ ...editingGraduate, image: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setEditingGraduate(null)} className="px-4 py-2 text-white/60 hover:text-white">Bekor qilish</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 rounded-lg text-white">Saqlash</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
