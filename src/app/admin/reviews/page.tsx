"use client";

import { useEffect, useState } from "react";
import { Plus, MoreVertical, MessageCircle, RefreshCcw, Trash2, Star } from "lucide-react";

interface Review {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [isAddingReview, setIsAddingReview] = useState(false);
    const [newReview, setNewReview] = useState({ name: '', role: '', content: '', rating: 5 });

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/reviews');
            const data = await res.json();
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReview)
            });

            if (res.ok) {
                const created = await res.json();
                setReviews([created, ...reviews]);
                setIsAddingReview(false);
                setNewReview({ name: '', role: '', content: '', rating: 5 });
            } else {
                alert("Xatolik");
            }
        } catch (error) { console.error(error); }
    };

    const deleteReview = async (id: number) => {
        if (!confirm("O'chirmoqchimisiz?")) return;
        try {
            const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
            if (res.ok) setReviews(reviews.filter(r => r.id !== id));
        } catch (error) { console.error(error); }
    };

    const handleSaveReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReview) return;
        try {
            const res = await fetch(`/api/reviews/${editingReview.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingReview)
            });
            if (res.ok) {
                const updated = await res.json();
                setReviews(reviews.map(r => r.id === updated.id ? updated : r));
                setEditingReview(null);
            }
        } catch (error) { console.error(error); }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Izohlar</h1>
                    <p className="text-white/40 text-sm">{loading ? "Yuklanmoqda..." : `Jami ${reviews.length} ta izoh`}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchReviews} disabled={loading} className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-lg transition-colors">
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button onClick={() => setIsAddingReview(true)} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                        <Plus size={18} />
                        Yangi izoh
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-neutral-900/50 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{review.name}</h3>
                                    <p className="text-xs text-white/40">{review.role}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingReview(review)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white">
                                    <MoreVertical size={16} />
                                </button>
                                <button onClick={() => deleteReview(review.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex text-yellow-500 text-xs mb-2">
                            {Array(review.rating).fill('⭐').map((s, i) => <span key={i}>{s}</span>)}
                        </div>
                        <p className="text-sm text-white/60 italic">"{review.content}"</p>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {isAddingReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Yangi izoh</h2>
                        <form onSubmit={handleAddReview} className="space-y-4">
                            <input type="text" required placeholder="Ism" value={newReview.name} onChange={e => setNewReview({ ...newReview, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <input type="text" placeholder="Kasbi / Rol" value={newReview.role} onChange={e => setNewReview({ ...newReview, role: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <textarea required placeholder="Izoh matni" value={newReview.content} onChange={e => setNewReview({ ...newReview, content: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-white/60">Reyting:</span>
                                <input type="number" min="1" max="5" value={newReview.rating} onChange={e => setNewReview({ ...newReview, rating: parseInt(e.target.value) })} className="w-20 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsAddingReview(false)} className="px-4 py-2 text-white/60 hover:text-white">Bekor qilish</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 rounded-lg text-white">Qo'shish</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Izohni tahrirlash</h2>
                        <form onSubmit={handleSaveReview} className="space-y-4">
                            <input type="text" value={editingReview.name} onChange={e => setEditingReview({ ...editingReview, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <input type="text" value={editingReview.role} onChange={e => setEditingReview({ ...editingReview, role: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <textarea value={editingReview.content} onChange={e => setEditingReview({ ...editingReview, content: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <input type="number" min="1" max="5" value={editingReview.rating} onChange={e => setEditingReview({ ...editingReview, rating: parseInt(e.target.value) })} className="w-20 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setEditingReview(null)} className="px-4 py-2 text-white/60 hover:text-white">Bekor qilish</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 rounded-lg text-white">Saqlash</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
