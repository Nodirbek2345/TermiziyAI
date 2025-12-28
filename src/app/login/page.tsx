"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, LogIn, KeyRound, ArrowLeft, Check, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showResetForm, setShowResetForm] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [resetLoading, setResetLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetError, setResetError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                router.push("/admin");
            } else {
                setError(data.message || "Kirish xatosi");
            }
        } catch {
            setError("Serverga ulanishda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetError("");
        setResetLoading(true);
        setResetSuccess(false);

        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: resetEmail, newPassword }),
            });

            const data = await res.json();

            if (data.success) {
                setResetSuccess(true);
                setTimeout(() => {
                    setShowResetForm(false);
                    setResetSuccess(false);
                    setEmail(resetEmail);
                    setPassword(newPassword);
                }, 2000);
            } else {
                setResetError(data.message || "Parolni tiklashda xatolik");
            }
        } catch {
            setResetError("Serverga ulanishda xatolik");
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20" />
                <div className="absolute top-0 -right-1/4 w-1/2 h-1/2 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-purple-500/30 relative overflow-hidden group">
                            <ShieldCheck size={32} className="relative z-10" />
                            <div className="absolute inset-0 bg-white/20 blur-xl group-hover:blur-2xl transition-all" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Termiziy AI</h1>
                </div>

                {/* Login Form */}
                {!showResetForm ? (
                    <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center animate-shake">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm text-white/60 mb-2 font-medium">Email manzil</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-50 transition-opacity blur" />
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email manzilingiz"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-transparent transition-colors relative z-10 [&:-webkit-autofill]:shadow-[0_0_0_100px_#171717_inset] [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                            required
                                            autoComplete="off"
                                            name="email_field_random"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-white/60 mb-2 font-medium">Parol</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-50 transition-opacity blur" />
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Himoyalangan parolingiz"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-transparent transition-colors relative z-10 [&:-webkit-autofill]:shadow-[0_0_0_100px_#171717_inset] [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                            required
                                            autoComplete="new-password"
                                            name="password_field_random"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-20"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <LogIn size={20} />
                                        Kirish
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <button
                                onClick={() => setShowResetForm(true)}
                                className="w-full text-white/40 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"
                            >
                                <KeyRound size={16} />
                                Parolni tiklash
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Reset Password Form */
                    <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        {resetSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Check className="text-green-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Parol yangilandi!</h3>
                                <p className="text-white/40 text-sm">Kirish sahifasiga qaytish...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-6" autoComplete="off">
                                {resetError && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center">
                                        {resetError}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm text-white/60 mb-2 font-medium">Email manzil</label>
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-50 transition-opacity blur" />
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                placeholder="Email manzilingiz"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-transparent transition-colors relative z-10 [&:-webkit-autofill]:shadow-[0_0_0_100px_#171717_inset] [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                                required
                                                autoComplete="off"
                                                name="reset_email_random"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-2 font-medium">Yangi parol</label>
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-50 transition-opacity blur" />
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Yangi parolni kiriting"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-transparent transition-colors relative z-10 [&:-webkit-autofill]:shadow-[0_0_0_100px_#171717_inset] [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                                required
                                                minLength={6}
                                                autoComplete="new-password"
                                                name="new_password_random"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={resetLoading}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {resetLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <KeyRound size={20} />
                                            Parolni yangilash
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {!resetSuccess && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <button
                                    onClick={() => {
                                        setShowResetForm(false);
                                        setResetError("");
                                    }}
                                    className="w-full text-white/40 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                    <ArrowLeft size={16} />
                                    Kirishga qaytish
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <p className="text-center text-white/20 text-sm mt-6">
                    Termiziy AI Admin Panel v1.0
                </p>
            </div>
        </div>
    );
}

