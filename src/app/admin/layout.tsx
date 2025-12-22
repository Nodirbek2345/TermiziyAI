"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    LogOut,
    Menu,
    Briefcase,
    MessageCircle,
    GraduationCap,
    Image as ImageIcon
} from "lucide-react";

interface User {
    userId: number;
    email: string;
    name: string;
    role: string;
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch("/api/auth/me");
            const data = await res.json();

            if (data.authenticated) {
                setUser(data.user);
            } else {
                router.push("/login");
            }
        } catch {
            router.push("/login");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", { method: "POST" });
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-neutral-950 items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex h-screen bg-neutral-950 text-white overflow-hidden font-sans selection:bg-purple-500/30">
            {/* Sidebar */}
            <aside className="w-64 hidden md:flex flex-col border-r border-white/10 bg-neutral-900/50 backdrop-blur-xl relative z-10">
                <div className="p-6 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
                            T
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Termiziy AI
                        </span>
                    </Link>
                    <div className="mt-2 text-xs text-white/40 uppercase tracking-widest font-medium pl-1">
                        Admin Panel
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-sm font-bold text-white uppercase border border-white/10">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-medium text-white text-sm">{user.name}</div>
                            <div className="text-xs text-white/40">{user.role}</div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Bosh sahifa" />
                    <NavItem href="/admin/users" icon={<Users size={20} />} label="Foydalanuvchilar" />
                    <NavItem href="/admin/courses" icon={<BookOpen size={20} />} label="Kurslar" />
                    <NavItem href="/admin/projects" icon={<Briefcase size={20} />} label="Loyihalar" />
                    <NavItem href="/admin/reviews" icon={<MessageCircle size={20} />} label="Izohlar" />
                    <NavItem href="/admin/graduates" icon={<GraduationCap size={20} />} label="Bitiruvchilar" />
                    <NavItem href="/admin/media" icon={<ImageIcon size={20} />} label="Media" />
                    <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Sozlamalar" />
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full p-3 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span className="font-medium">Chiqish</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-neutral-950 to-neutral-950 -z-10 pointer-events-none" />

                {/* Header (Mobile mostly) */}
                <header className="h-16 border-b border-white/5 bg-neutral-900/30 backdrop-blur-md flex items-center justify-between px-6 md:hidden">
                    <div className="font-bold text-lg">Admin Panel</div>
                    <button className="p-2 -mr-2 text-white/60 hover:text-white">
                        <Menu size={24} />
                    </button>
                </header>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-white/60 hover:text-white hover:bg-white/5"
        >
            <div className="text-white/40 group-hover:text-white/80 transition-colors duration-200">
                {icon}
            </div>
            <span className="font-medium">{label}</span>
        </Link>
    );
}

