"use client";

import { useEffect, useState } from "react";
import { Search, Edit, Trash2, MoreHorizontal, UserPlus, RefreshCcw } from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string | null;
    phoneNumber: string | null;
    role: string;
    status: string;
    date: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', phoneNumber: '', role: 'Student', status: 'Active' });

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (res.ok) {
                const createdUser = await res.json();
                setUsers([createdUser, ...users]);
                setIsAddingUser(false);
                setNewUser({ name: '', email: '', phoneNumber: '', role: 'Student', status: 'Active' });
            } else {
                alert("Xatolik yuz berdi");
            }
        } catch (error) {
            console.error("Failed to create user", error);
        }
    };

    const deleteUser = async (id: number) => {
        if (!confirm("Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz?")) return;

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setUsers(users.filter(user => user.id !== id));
            } else {
                alert("Xatolik yuz berdi");
            }
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            const res = await fetch(`/api/users/${editingUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingUser)
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
                setEditingUser(null);
            } else {
                alert("Saqlashda xatolik");
            }
        } catch (error) {
            console.error("Failed to update user", error);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            const formattedData = data.map((u: any) => ({
                ...u,
                date: u.date || new Date(u.createdAt).toISOString().split('T')[0]
            }));
            setUsers(formattedData);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Foydalanuvchilar</h1>
                    <p className="text-white/40 text-sm">
                        {loading ? "Yuklanmoqda..." : `Jami ${users.length} nafar foydalanuvchi`}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={() => setIsAddingUser(true)}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        <UserPlus size={18} />
                        Yangi qo'shish
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-xl p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input
                        type="text"
                        placeholder="Ism, email yoki telefon orqali qidirish..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50"
                    />
                </div>
                <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/80 focus:outline-none focus:border-purple-500/50">
                    <option>Barcha rollar</option>
                    <option>Admin</option>
                    <option>Student</option>
                </select>
                <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/80 focus:outline-none focus:border-purple-500/50">
                    <option>Barcha holatlar</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden min-h-[300px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-white/40 gap-4">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        <p>Ma'lumotlar yuklanmoqda...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="p-4 text-xs font-medium text-white/40 uppercase tracking-wider">Foydalanuvchi</th>
                                    <th className="p-4 text-xs font-medium text-white/40 uppercase tracking-wider">Rol</th>
                                    <th className="p-4 text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-medium text-white/40 uppercase tracking-wider">Sana</th>
                                    <th className="p-4 text-xs font-medium text-white/40 uppercase tracking-wider text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-sm font-bold text-white uppercase border border-white/10">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{user.name}</div>
                                                    <div className="text-xs text-white/40">
                                                        {user.email && user.phoneNumber
                                                            ? `${user.email} | ${user.phoneNumber}`
                                                            : (user.email || user.phoneNumber || 'Bog\'lanish yo\'q')}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${user.role === 'Admin' || user.role === 'Teacher'
                                                ? 'bg-purple-400/10 text-purple-400 ring-purple-400/20'
                                                : 'bg-blue-400/10 text-blue-400 ring-blue-400/20'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${user.status === 'Active'
                                                ? 'text-emerald-400'
                                                : 'text-neutral-400'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-400' : 'bg-neutral-400'
                                                    }`} />
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-white/60">
                                            {user.date}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-white opacity-100">
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                                    title="Tahrirlash"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="p-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                    title="O'chirish"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && (
                    <div className="p-4 border-t border-white/5 flex items-center justify-center gap-2">
                        <button className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-white/60 text-sm hover:bg-white/10 disabled:opacity-50">Oldingi</button>
                        <button className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm font-medium">1</button>
                        <button className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-white/60 text-sm hover:bg-white/10">2</button>
                        <button className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-white/60 text-sm hover:bg-white/10">Keyingi</button>
                    </div>
                )}
            </div>

            {/* Add User Modal */}
            {isAddingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Yangi foydalanuvchi qo'shish</h2>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Ism</label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    placeholder="Foydalanuvchi ismi"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Email (ixtiyoriy)</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    placeholder="email@misol.uz"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Telefon raqam</label>
                                <input
                                    type="text"
                                    value={newUser.phoneNumber}
                                    onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    placeholder="+998"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Rol</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                >
                                    <option value="Admin" className="bg-neutral-800 text-white">Admin</option>
                                    <option value="Student" className="bg-neutral-800 text-white">Student</option>
                                    <option value="Teacher" className="bg-neutral-800 text-white">Teacher</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Status</label>
                                <select
                                    value={newUser.status}
                                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                >
                                    <option value="Active" className="bg-neutral-800 text-white">Active</option>
                                    <option value="Inactive" className="bg-neutral-800 text-white">Inactive</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddingUser(false)}
                                    className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors"
                                >
                                    Qo'shish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Foydalanuvchini tahrirlash</h2>
                        <form onSubmit={handleSaveUser} className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Ism</label>
                                <input
                                    type="text"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Email (ixtiyoriy)</label>
                                <input
                                    type="email"
                                    value={editingUser.email || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Telefon raqam</label>
                                <input
                                    type="text"
                                    value={editingUser.phoneNumber || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    placeholder="+998"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Rol</label>
                                <select
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                >
                                    <option value="Admin" className="bg-neutral-800 text-white">Admin</option>
                                    <option value="Student" className="bg-neutral-800 text-white">Student</option>
                                    <option value="Teacher" className="bg-neutral-800 text-white">Teacher</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Status</label>
                                <select
                                    value={editingUser.status}
                                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                >
                                    <option value="Active" className="bg-neutral-800 text-white">Active</option>
                                    <option value="Inactive" className="bg-neutral-800 text-white">Inactive</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
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
