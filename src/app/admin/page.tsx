"use client";

import { useEffect, useState } from "react";
import {
    Users,
    BookOpen,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    MoreHorizontal,
    RefreshCcw
} from "lucide-react";

interface Stats {
    users: { total: number; active: number; trend: string };
    courses: { total: number; students: number; averageRating: string; trend: string };
    revenue: { total: string; trend: string };
    activity: { percentage: number; trend: string };
}

export default function AdminPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/stats');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Boshqaruv Paneli</h1>
                    <p className="text-white/40">Loyihangizning umumiy holati va statistikasi</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchStats}
                        disabled={loading}
                        className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/80 focus:outline-none focus:border-purple-500/50">
                        <option>Bugun</option>
                        <option>Bu hafta</option>
                        <option>Bu oy</option>
                    </select>
                    <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Hisobotni yuklash
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    // Skeleton loading
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 animate-pulse">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-white/5 rounded-xl" />
                                <div className="w-16 h-6 bg-white/5 rounded-lg" />
                            </div>
                            <div className="w-20 h-4 bg-white/5 rounded mb-2" />
                            <div className="w-24 h-8 bg-white/5 rounded" />
                        </div>
                    ))
                ) : stats && (
                    <>
                        <StatCard
                            title="Foydalanuvchilar"
                            value={stats.users.total.toLocaleString()}
                            trend={stats.users.trend}
                            icon={<Users size={24} />}
                            color="blue"
                        />
                        <StatCard
                            title="Jami Kurslar"
                            value={stats.courses.total.toString()}
                            trend={stats.courses.trend}
                            icon={<BookOpen size={24} />}
                            color="purple"
                        />
                        <StatCard
                            title="Daromad"
                            value={stats.revenue.total}
                            trend={stats.revenue.trend}
                            icon={<DollarSign size={24} />}
                            color="green"
                        />
                        <StatCard
                            title="Faollik"
                            value={`${stats.activity.percentage}%`}
                            trend={stats.activity.trend}
                            icon={<TrendingUp size={24} />}
                            color="orange"
                        />
                    </>
                )}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">So'nggi harakatlar</h3>
                        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">Barchasini ko'rish</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white/60 group-hover:text-white group-hover:scale-110 transition-all">
                                    <Users size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-white font-medium">Yangi foydalanuvchi qo'shildi</p>
                                        <span className="text-xs text-white/40">2 daqiqa oldin</span>
                                    </div>
                                    <p className="text-white/40 text-sm">Ali Valiyev ro'yxatdan o'tdi</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Courses */}
                <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Top Kurslar</h3>
                        <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="group">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-2xl">
                                            🐍
                                        </div>
                                        <div>
                                            <p className="text-white font-medium group-hover:text-purple-400 transition-colors">Python Asoslari</p>
                                            <p className="text-xs text-white/40">1,234 talaba</p>
                                        </div>
                                    </div>
                                    <div className="text-green-400 font-medium">+15%</div>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-purple-500 h-full rounded-full w-[70%]" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                        Barcha kurslarni ko'rish
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, icon, color }: { title: string; value: string; trend: string; icon: React.ReactNode; color: string }) {
    const colors: Record<string, string> = {
        blue: "from-blue-500 to-cyan-500",
        purple: "from-purple-500 to-pink-500",
        green: "from-emerald-500 to-green-500",
        orange: "from-orange-500 to-red-500",
    };

    const bgColors: Record<string, string> = {
        blue: "bg-blue-500/10 text-blue-400",
        purple: "bg-purple-500/10 text-purple-400",
        green: "bg-emerald-500/10 text-emerald-400",
        orange: "bg-orange-500/10 text-orange-400",
    };

    return (
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-all duration-500">
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <div className={`w-24 h-24 rounded-full blur-2xl bg-gradient-to-br ${colors[color]}`} />
            </div>

            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${bgColors[color]} group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg text-xs font-medium">
                    <ArrowUpRight size={14} />
                    {trend}
                </div>
            </div>

            <div>
                <p className="text-white/40 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
        </div>
    );
}

