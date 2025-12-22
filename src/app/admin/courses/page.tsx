"use client";

import { useEffect, useState } from "react";
import { Plus, MoreVertical, Users, Star, Clock, RefreshCcw, Trash2 } from "lucide-react";

interface Course {
    id: number;
    title: string;
    students: number;
    rating: number;
    duration: string;
    price: string;
    image: string;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', price: '', duration: '', students: 0, rating: 5.0, image: '' });

    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCourse)
            });

            if (res.ok) {
                const createdCourse = await res.json();
                setCourses([createdCourse, ...courses]);
                setIsAddingCourse(false);
                setNewCourse({ title: '', price: '', duration: '', students: 0, rating: 5.0, image: '' });
            } else {
                alert("Xatolik yuz berdi");
            }
        } catch (error) {
            console.error("Failed to create course", error);
        }
    };

    const deleteCourse = async (id: number) => {
        if (!confirm("Haqiqatan ham bu kursni o'chirmoqchimisiz?")) return;

        try {
            const res = await fetch(`/api/courses/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setCourses(courses.filter(course => course.id !== id));
            } else {
                alert("Xatolik yuz berdi");
            }
        } catch (error) {
            console.error("Failed to delete course", error);
        }
    };

    const handleEditClick = (course: Course) => {
        setEditingCourse(course);
    };

    const handleSaveCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCourse) return;

        try {
            const res = await fetch(`/api/courses/${editingCourse.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingCourse)
            });

            if (res.ok) {
                const updatedCourse = await res.json();
                setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
                setEditingCourse(null);
            } else {
                alert("Saqlashda xatolik");
            }
        } catch (error) {
            console.error("Failed to update course", error);
        }
    };

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/courses');
            const data = await res.json();
            setCourses(data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Kurslar</h1>
                    <p className="text-white/40 text-sm">
                        {loading ? "Yuklanmoqda..." : `Jami ${courses.length} ta kurs`}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchCourses}
                        disabled={loading}
                        className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                        <Plus size={18} />
                        Yangi kurs
                    </button>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    // Skeleton Loading State
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden h-[340px] animate-pulse">
                            <div className="h-40 bg-white/5" />
                            <div className="p-5 space-y-4">
                                <div className="h-6 bg-white/5 rounded w-3/4" />
                                <div className="h-4 bg-white/5 rounded w-full" />
                                <div className="h-4 bg-white/5 rounded w-1/2" />
                            </div>
                        </div>
                    ))
                ) : (
                    courses.map((course) => (
                        <div key={course.id} className="group bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1">
                            {/* Cover Image Placeholder */}
                            <div className="h-40 bg-white/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent z-10" />
                                <div className="absolute top-3 right-3 z-20 flex gap-2">
                                    <button
                                        onClick={() => handleEditClick(course)}
                                        className="p-1.5 rounded-lg bg-black/40 text-white hover:bg-white/20 backdrop-blur-md transition-colors"
                                        title="Tahrirlash"
                                    >
                                        <MoreVertical size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteCourse(course.id)}
                                        className="p-1.5 rounded-lg bg-black/40 text-white hover:bg-red-500/80 backdrop-blur-md transition-colors"
                                        title="O'chirish"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute bottom-3 left-3 z-20">
                                    <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-md">{course.price}</span>
                                </div>
                                {/* Mock Image Gradient for placeholder */}
                                <div className={`w-full h-full bg-gradient-to-br ${course.id % 4 === 1 ? 'from-blue-600 to-cyan-400' :
                                    course.id % 4 === 2 ? 'from-purple-600 to-pink-400' :
                                        course.id % 4 === 3 ? 'from-green-600 to-emerald-400' :
                                            'from-orange-600 to-red-400'
                                    } opacity-50 group-hover:scale-110 transition-transform duration-700`} />
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">{course.title}</h3>

                                <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Users size={14} />
                                        {course.students}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {course.duration}
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star size={14} fill="currentColor" />
                                        {course.rating}
                                    </div>
                                </div>

                                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden mb-4">
                                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full" style={{ width: `${Math.random() * 40 + 30}%` }} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-white/40">32% bitirgan</span>
                                    <button className="text-sm font-medium text-white/60 hover:text-white transition-colors">Batafsil</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Add New Placeholder Card (only show when not loading) */}
                {!loading && (
                    <button className="border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-white/20 hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all h-full min-h-[300px]">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                            <Plus size={24} />
                        </div>
                        <span className="font-medium">Yangi kurs yaratish</span>
                    </button>
                )}
            </div>

            {/* Add Course Modal */}
            {isAddingCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Yangi kurs yaratish</h2>
                        <form onSubmit={handleAddCourse} className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Nomi</label>
                                <input
                                    type="text"
                                    required
                                    value={newCourse.title}
                                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    placeholder="Kurs nomi"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Narxi</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCourse.price}
                                        onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                        placeholder="Bepul / 500,000 so'm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Davomiyligi</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCourse.duration}
                                        onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                        placeholder="2 oy"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">O'quvchilar</label>
                                    <input
                                        type="number"
                                        value={newCourse.students}
                                        onChange={(e) => setNewCourse({ ...newCourse, students: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Reyting</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={newCourse.rating}
                                        onChange={(e) => setNewCourse({ ...newCourse, rating: parseFloat(e.target.value) || 0 })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddingCourse(false)}
                                    className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors"
                                >
                                    Yaratish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Course Modal */}
            {editingCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Kursni tahrirlash</h2>
                        <form onSubmit={handleSaveCourse} className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Nomi</label>
                                <input
                                    type="text"
                                    value={editingCourse.title}
                                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Narxi</label>
                                    <input
                                        type="text"
                                        value={editingCourse.price}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Davomiyligi</label>
                                    <input
                                        type="text"
                                        value={editingCourse.duration}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">O'quvchilar</label>
                                    <input
                                        type="number"
                                        value={editingCourse.students}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, students: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Reyting</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={editingCourse.rating}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, rating: parseFloat(e.target.value) || 0 })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditingCourse(null)}
                                    className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors"
                                >
                                    Saqlash
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
