"use client";

import { useEffect, useState, useRef } from "react";
import { Users, GraduationCap, TrendingUp, MapPin, Trophy } from "lucide-react";

// Custom hook for polling
function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay !== null) {
            const id = setInterval(() => savedCallback.current(), delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default function AdminStatsPage() {
    const [activeYear, setActiveYear] = useState<2025 | 2026>(2025);

    // Mock Data - in real app, fetch from API based on activeYear
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/stats');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useInterval(() => {
        fetchStats();
    }, 5000);

    // Mock Data for charts/rankings (API doesn't support these yet)
    const mockRankings = {
        2025: {
            genderRatio: { m: 51, f: 49 },
            fastestRegion: "Andijon",
            growth: 25,
            regionRanking: [
                { name: "Samarqand viloyati", count: 181129, color: "from-blue-600 to-blue-500" },
                { name: "Qashqadaryo viloyati", count: 161661, color: "from-blue-600 to-blue-500" },
                { name: "Surxondaryo viloyati", count: 155460, color: "from-blue-500 to-cyan-500" },
                { name: "Toshkent viloyati", count: 141165, color: "from-blue-500 to-cyan-500" },
                { name: "Farg'ona viloyati", count: 128254, color: "from-blue-500 to-cyan-500" },
                { name: "Toshkent shahri", count: 215400, color: "from-indigo-600 to-purple-600" },
            ],
            courseRanking: [
                { name: "O'zingiz Kod Yozing: Dasturlashga Kirish", count: 234170, color: "from-emerald-600 to-emerald-400" },
                { name: "Generativ Sun'iy Intellektga Kirish", count: 210550, color: "from-emerald-600 to-teal-400" },
                { name: "AI Engineering Masterclass", count: 100421, color: "from-amber-600 to-orange-400" },
            ]
        },
        2026: {
            genderRatio: { m: 48, f: 52 },
            fastestRegion: "Termiz",
            growth: 42,
            regionRanking: [
                { name: "Toshkent shahri", count: 320000, color: "from-indigo-600 to-purple-600" },
                { name: "Navoiy viloyati", count: 195000, color: "from-blue-600 to-blue-500" },
                { name: "Buxoro viloyati", count: 175000, color: "from-blue-600 to-blue-500" },
                { name: "Termiz shahri", count: 155000, color: "from-blue-500 to-cyan-500" },
            ],
            courseRanking: [
                { name: "AI Engineering Masterclass", count: 310000, color: "from-amber-600 to-orange-400" },
                { name: "Data Science & AI for Business", count: 280000, color: "from-cyan-600 to-blue-400" },
            ]
        }
    };

    const currentMock = mockRankings[activeYear];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Platforma Statistikasi
                    </h1>
                    <p className="text-white/40 mt-1">Yillar kesimida erishilgan natijalar tahlili</p>
                </div>

                {/* Year Toggle */}
                <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex gap-1">
                    {([2025, 2026] as const).map((year) => (
                        <button
                            key={year}
                            onClick={() => setActiveYear(year)}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeYear === year ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Registered */}
                <StatsCard
                    title="Ro'yxatdan o'tganlar"
                    value={loading ? "..." : stats?.users?.total?.toLocaleString() || "0"}
                    subtitle="nafar"
                    icon={<Users size={20} className="text-blue-400" />}
                    trend="+14%"
                    trendColor="emerald"
                    color="blue"
                />

                {/* Graduates */}
                <StatsCard
                    title="Bitirganlar"
                    value={loading ? "..." : stats?.graduates?.total?.toLocaleString() || "0"}
                    subtitle="nafar"
                    icon={<GraduationCap size={20} className="text-purple-400" />}
                    trend="+17%"
                    trendColor="emerald"
                    color="purple"
                />

                {/* Gender Ratio */}
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5 relative overflow-hidden h-full">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-white/40 text-sm font-medium">Erkak-ayol nisbati</span>
                        <div className="flex -space-x-1">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-white/10 flex items-center justify-center text-[10px] text-blue-400 font-bold">M</div>
                            <div className="w-6 h-6 rounded-full bg-pink-500/20 border border-white/10 flex items-center justify-center text-[10px] text-pink-400 font-bold">F</div>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-black text-blue-400 tracking-tight">{currentMock.genderRatio.m}</span>
                        <span className="text-white/40 text-sm font-medium">ga</span>
                        <span className="text-3xl font-black text-pink-400 tracking-tight">{currentMock.genderRatio.f}</span>
                    </div>
                    <span className="text-white/40 text-xs font-medium">har 100 inson ichida</span>
                </div>

                {/* Fastest Region */}
                {/* Fastest Region */}
                <StatsCard
                    title="Eng tez o'sayotgan"
                    value={currentMock.fastestRegion}
                    subtitle={currentMock.fastestRegion === "Andijon" ? "viloyati" : "shahri"}
                    icon={<MapPin size={20} className="text-cyan-400" />}
                    trend={`+${currentMock.growth}%`}
                    trendColor="emerald"
                    color="cyan"
                />
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Region Ranking */}
                <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h4 className="font-bold text-xl text-white">Hududlar reytingi</h4>
                            <p className="text-sm text-white/40 mt-1">Bitiruvchilar soni bo'yicha</p>
                        </div>
                        <div className="p-2 bg-white/5 rounded-xl">
                            <MapPin className="w-5 h-5 text-white/40" />
                        </div>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {currentMock.regionRanking.map((region: any, i: number) => (
                            <RankingBar key={i} index={i + 1} name={region.name} count={region.count} color={region.color} max={350000} />
                        ))}
                    </div>
                </div>

                {/* Course Ranking */}
                <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h4 className="font-bold text-xl text-white">Kurslar reytingi</h4>
                            <p className="text-sm text-white/40 mt-1">Top kurslar</p>
                        </div>
                        <div className="p-2 bg-amber-500/10 rounded-xl">
                            <Trophy className="w-5 h-5 text-amber-400" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {currentMock.courseRanking.map((course: any, i: number) => (
                            <RankingBar key={i} index={i + 1} name={course.name} count={course.count} color={course.color} max={350000} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, subtitle, icon, trend, trendColor, color }: any) {
    return (
        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 relative overflow-hidden group hover:bg-white/10 transition-colors h-full">
            <div className={`absolute top-0 right-0 p-32 bg-${color}-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none`} />

            <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-white/40 text-sm font-medium">{title}</span>
                        <div className={`p-2 rounded-lg bg-${color}-500/10`}>
                            {icon}
                        </div>
                    </div>
                    <div className="mb-2">
                        <span className="text-3xl font-black text-white block tracking-tight">{value}</span>
                        <span className="text-white/40 text-xs font-medium">{subtitle}</span>
                    </div>
                </div>

                {trend && (
                    <div className={`flex items-center gap-1.5 mt-2 bg-${trendColor}-500/10 px-2 py-1 rounded-md w-fit`}>
                        <TrendingUp className={`w-3 h-3 text-${trendColor}-400`} />
                        <span className={`text-${trendColor}-400 text-xs font-bold`}>{trend}</span>
                        <span className={`text-${trendColor}-400/60 text-[10px] uppercase tracking-wide ml-1`}>o'sish</span>
                    </div>
                )}
            </div>
        </div>
    )
}

function RankingBar({ index, name, count, color, max }: any) {
    return (
        <div className="relative h-14 rounded-xl overflow-hidden group bg-black/20 border border-white/5">
            <div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color} transition-all duration-1000 opacity-60`}
                style={{ width: `${(count / max) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-6 z-10">
                <div className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-black/20 rounded-full text-xs font-bold text-white/70">
                        {index}
                    </span>
                    <span className="font-semibold text-white text-sm">{name}</span>
                </div>
                <span className="font-bold text-white bg-black/20 px-3 py-1 rounded-lg border border-white/10 text-xs">
                    {count.toLocaleString()}
                </span>
            </div>
        </div>
    )
}
