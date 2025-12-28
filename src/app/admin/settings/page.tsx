"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, User, Bell, Shield, Key, Bot, Sparkles, CheckCircle, XCircle, MessageSquare, Cpu, Terminal, Layout, Monitor, Image } from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'ai' | 'ai-tech'>('profile');

    // AI Tech State
    // AI Tech State
    const [frontendMode, setFrontendMode] = useState(false);
    const [layoutLock, setLayoutLock] = useState(false);

    // Fetch Settings on Load
    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setFrontendMode(data.frontendMode);
                    setLayoutLock(data.layoutLock);
                }
            })
            .catch(err => console.error("Settings load error", err));
    }, []);

    const toggleSetting = async (key: 'frontendMode' | 'layoutLock', value: boolean, label: string) => {
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [key]: value })
            });
            const data = await res.json();
            if (data.success) {
                if (key === 'frontendMode') setFrontendMode(value);
                if (key === 'layoutLock') setLayoutLock(value);

                // Log to terminal
                setCommandHistory(prev => [...prev, {
                    type: 'output',
                    content: `> ${label}: ${value ? 'ACTIVATED [ON]' : 'DEACTIVATED [OFF]'}`
                }]);
            }
        } catch (error) {
            console.error(error);
            setCommandHistory(prev => [...prev, { type: 'output', content: `> Xatolik: Sozlama saqlanmadi.` }]);
        }
    };

    const [commandInput, setCommandInput] = useState("");
    const [commandHistory, setCommandHistory] = useState<{ type: 'input' | 'output', content: string }[]>([
        { type: 'output', content: '> Tizim diagnostikasi... OK' },
        { type: 'output', content: '> UI komponentlari yuklandi...' },
        { type: 'output', content: 'Termiziy AI Texnik tizimiga xush kelibsiz! Har qanday buyruqni kiriting.' }
    ]);
    const [processingCommand, setProcessingCommand] = useState(false);
    const [aiStatus, setAiStatus] = useState<'checking' | 'active' | 'error'>('checking');
    const [testMessage, setTestMessage] = useState("");
    const [testResponse, setTestResponse] = useState("");
    const [testLoading, setTestLoading] = useState(false);

    // Profile State
    const [profileData, setProfileData] = useState({
        name: '',
        surname: '',
        email: '',
        phoneNumber: '',
        bio: '',
        image: ''
    });
    const [profileLoading, setProfileLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (data.authenticated && data.user) {
                setProfileData({
                    name: data.user.name || '',
                    surname: data.user.surname || '',
                    email: data.user.email || '',
                    phoneNumber: data.user.phoneNumber || '',
                    bio: data.user.bio || '',
                    image: data.user.image || ''
                });
            }
        } catch (e) {
            console.error("Profile load error", e);
        }
    };

    const handleProfileSave = async () => {
        setProfileLoading(true);
        try {
            const res = await fetch('/api/auth/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });
            const data = await res.json();
            if (data.success) {
                alert("Profil saqlandi!");
            } else {
                alert("Xatolik: " + data.error);
            }
        } catch (e) {
            alert("Server xatosi");
        } finally {
            setProfileLoading(false);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Upload to Cloudinary via our Media API
            const res = await fetch('/api/media', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setProfileData(prev => ({ ...prev, image: data.result.secure_url }));
            } else {
                alert("Rasm yuklashda xatolik: " + data.error);
            }
        } catch {
            alert("Serverga ulanishda xatolik");
        }
    };

    // AI holatini tekshirish
    useEffect(() => {
        checkAIStatus();
    }, []);

    const checkAIStatus = async () => {
        setAiStatus('checking');
        try {
            const res = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'test' })
            });
            const data = await res.json();
            setAiStatus(data.success ? 'active' : 'error');
        } catch {
            setAiStatus('error');
        }
    };

    const testAI = async () => {
        if (!testMessage.trim() || testLoading) return;
        setTestLoading(true);
        setTestResponse("");

        try {
            const res = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: testMessage })
            });
            const data = await res.json();
            setTestResponse(data.success ? data.response : `Xato: ${data.error}`);
        } catch {
            setTestResponse("Serverga ulanishda xatolik");
        } finally {
            setTestLoading(false);
        }
    };
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of terminal
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [commandHistory]);

    const handleCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter' || !commandInput.trim() || processingCommand) return;

        const cmd = commandInput.trim();
        setProcessingCommand(true);
        setCommandHistory(prev => [...prev, { type: 'input', content: cmd }]);
        setCommandInput("");

        const lowerCmd = cmd.toLowerCase();

        // 1. LOCAL LOGIC (OFFLINE SMARTS)
        const localResponses: Record<string, string> = {
            'salom': 'Assalomu alaykum! Sizga qanday yordam bera olaman?',
            'qalay': 'Rahmat, yaxshiman. Tizim barqaror ishlamoqda. O\'zingiz yaxshimisiz?',
            'isming nima': 'Mening ismim Termiziy AI Texnik. Men ushbu platformani boshqarishda yordam beraman.',
            'nima qila olasan': 'Men quyidagilarni bajarishim mumkin:\n- Sahifalarga yo\'naltirish\n- Tizim holatini tekshirish\n- Dizaynni o\'zgartirish (tez orada)\n- Savollarga javob berish'
        };

        // Exact match check
        if (localResponses[lowerCmd]) {
            setCommandHistory(prev => [...prev, { type: 'output', content: localResponses[lowerCmd] }]);
            setProcessingCommand(false);
            return;
        }

        // Navigation Commands (Regex)
        if (lowerCmd.includes("bor") || lowerCmd.includes("o't") || lowerCmd.includes("och")) {
            if (lowerCmd.includes("home") || lowerCmd.includes("uy") || lowerCmd.includes("bosh")) {
                setCommandHistory(prev => [...prev, { type: 'output', content: "Bosh sahifaga yo'naltirilmoqda..." }]);
                router.push('/');
                setProcessingCommand(false);
                return;
            }
            if (lowerCmd.includes("sozlamalar") || lowerCmd.includes("settings")) {
                setCommandHistory(prev => [...prev, { type: 'output', content: "Sozlamalar bo'limidasiz." }]);
                setProcessingCommand(false);
                return;
            }
            if (lowerCmd.includes("kurs")) {
                setCommandHistory(prev => [...prev, { type: 'output', content: "Kurslar sahifasiga yo'naltirilmoqda..." }]);
                router.push('/courses'); // Assuming /courses exists
                setProcessingCommand(false);
                return;
            }
        }

        // System Commands
        if (lowerCmd === 'clear' || lowerCmd === 'tozalash') {
            setCommandHistory([]);
            setProcessingCommand(false);
            return;
        }

        if (lowerCmd === 'help' || lowerCmd === 'yordam') {
            setCommandHistory(prev => [...prev, {
                type: 'output',
                content: `Mavjud buyruqlar:
- "Bosh sahifaga o't" - Navigatsiya
- "Tizim holati" - Diagnostika
- "Clear" - Tozalash
- "Salom", "Qalay" - Muloqot`
            }]);
            setProcessingCommand(false);
            return;
        }

        if (lowerCmd === 'limit' || lowerCmd === 'quota' || lowerCmd === 'hisob') {
            setCommandHistory(prev => [...prev, { type: 'output', content: "Limitlar tekshirilmoqda..." }]);
            try {
                const res = await fetch('/api/ai-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: "Ping" })
                });
                const data = await res.json();

                if (data.debug?.limits) {
                    const { requests, tokens, debug_headers } = data.debug.limits;
                    let content = `📊 Limit Holati (${data.debug.provider}):\n- So'rovlar: ${requests || "Noma'lum"}\n- Tokenlar: ${tokens || "Noma'lum"}`;

                    if ((!requests || !tokens) && debug_headers) {
                        const relevant = Object.keys(debug_headers)
                            .filter(k => k.toLowerCase().includes('limit') || k.toLowerCase().includes('remain'))
                            .map(k => `${k}: ${debug_headers[k]}`)
                            .join('\n');
                        if (relevant) content += `\n\n🔍 Debug Headers:\n${relevant}`;
                    }

                    setCommandHistory(prev => [...prev, {
                        type: 'output',
                        content: content
                    }]);
                } else {
                    setCommandHistory(prev => [...prev, { type: 'output', content: `Limit ma'lumotlari olinmadi (${data.debug?.provider || 'Unknown'}).` }]);
                }
            } catch (e) {
                setCommandHistory(prev => [...prev, { type: 'output', content: "Tekshirishda xatolik yuz berdi." }]);
            }
            setProcessingCommand(false);
            return;
        }

        // 2. REMOTE AI (FALLBACK)
        try {
            const res = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `Sen AI Texnik tizimisan. Foydalanuvchi buyrug'i: "${cmd}". 
                    Agar bu buyruq "logoni o'zgartir", "fonni o'zgartir" kabi vizual o'zgarish bo'lsa, "Bajarildi: [buyruq]" deb javob ber.
                    Agar savol bo'lsa, javob ber. Qisqa va lo'nda bo'l.`
                })
            });
            const data = await res.json();

            if (data.success) {
                setCommandHistory(prev => [...prev, { type: 'output', content: data.response }]);
            } else {
                // Fallback if API fails (quota or other error)
                console.warn("AI API Error:", data.error);
                setCommandHistory(prev => [...prev, {
                    type: 'output',
                    content: `AI (Online) vaqtincha ishlamayapti (${data.error}). Lekin men lokal rejimda ishlayapman. "Yordam" deb yozing.`
                }]);
            }
        } catch {
            setCommandHistory(prev => [...prev, { type: 'output', content: "Serverga ulanishda xatolik. Lokal rejimdaman." }]);
        } finally {
            setProcessingCommand(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Sozlamalar</h1>
                <p className="text-white/40 text-sm">Profilingiz va tizim sozlamalarini boshqaring</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Settings Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    <SettingsNav
                        icon={<User size={18} />}
                        label="Profil"
                        active={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                    />
                    <SettingsNav
                        icon={<Bot size={18} />}
                        label="AI Agent"
                        active={activeTab === 'ai'}
                        onClick={() => setActiveTab('ai')}
                    />
                    <SettingsNav
                        icon={<Cpu size={18} />}
                        label="AI Texnik"
                        active={activeTab === 'ai-tech'}
                        onClick={() => setActiveTab('ai-tech')}
                    />
                    <SettingsNav
                        icon={<Image size={18} />}
                        label="Media Menejer"
                        onClick={() => router.push('/admin/media')}
                    />
                    <SettingsNav icon={<Bell size={18} />} label="Bildirishnomalar" />
                    <SettingsNav icon={<Key size={18} />} label="Xavfsizlik" />
                    <SettingsNav icon={<Shield size={18} />} label="Admin Huquqlari" />
                </div>

                {/* content */}
                <div className="lg:col-span-3 space-y-6">
                    {activeTab === 'profile' && (
                        /* Profile Section */
                        <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <User size={20} className="text-purple-400" />
                                Profil Ma'lumotlari
                            </h2>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-bold text-white uppercase shadow-xl shadow-purple-500/20 overflow-hidden relative group">
                                    {profileData.image ? (
                                        <img src={profileData.image} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        profileData.name.charAt(0) || 'A'
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => document.getElementById('avatar-input')?.click()}>
                                        <Image size={24} className="text-white" />
                                    </div>
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        id="avatar-input"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <button
                                        onClick={() => document.getElementById('avatar-input')?.click()}
                                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors mb-2"
                                    >
                                        Rasmni o'zgartirish
                                    </button>
                                    <p className="text-xs text-white/40">JPG, PNG format (max 2MB)</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/60">Ism</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/60">Familiya</label>
                                    <input
                                        type="text"
                                        value={profileData.surname}
                                        onChange={e => setProfileData({ ...profileData, surname: e.target.value })}
                                        placeholder="Familiya kiriting"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/60">Email</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/60">Telefon</label>
                                    <input
                                        type="tel"
                                        value={profileData.phoneNumber}
                                        onChange={e => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 mb-8">
                                <label className="text-xs font-medium text-white/60">Bio</label>
                                <textarea
                                    rows={4}
                                    value={profileData.bio}
                                    onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50"
                                    placeholder="O'zingiz haqingizda qisqacha..."
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleProfileSave}
                                    disabled={profileLoading}
                                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-purple-500/25"
                                >
                                    {profileLoading ? (
                                        <span className="animate-spin">⌛</span>
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    Saqlash
                                </button>
                            </div>

                        </div>
                    )}

                    {activeTab === 'ai' && (
                        /* AI Agent Settings */
                        <div className="space-y-6">
                            {/* AI Status Card */}
                            <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Sparkles size={20} className="text-purple-400" />
                                    AI Agent Holati
                                </h2>

                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${aiStatus === 'active' ? 'bg-green-500/20' :
                                            aiStatus === 'error' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                                            }`}>
                                            {aiStatus === 'active' ? (
                                                <CheckCircle className="text-green-400" size={24} />
                                            ) : aiStatus === 'error' ? (
                                                <XCircle className="text-red-400" size={24} />
                                            ) : (
                                                <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Gemini AI</p>
                                            <p className={`text-sm ${aiStatus === 'active' ? 'text-green-400' :
                                                aiStatus === 'error' ? 'text-red-400' : 'text-yellow-400'
                                                }`}>
                                                {aiStatus === 'active' ? 'Faol va ishlayapti' :
                                                    aiStatus === 'error' ? 'Xatolik - API kalitini tekshiring' : 'Tekshirilmoqda...'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={checkAIStatus}
                                        className="text-sm text-white/60 hover:text-white px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        Qayta tekshirish
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 bg-white/5 rounded-xl text-center">
                                        <p className="text-2xl font-bold text-white">Gemini 2.0</p>
                                        <p className="text-xs text-white/40">Model versiyasi</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl text-center">
                                        <p className="text-2xl font-bold text-white">1024</p>
                                        <p className="text-xs text-white/40">Max tokenlar</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl text-center">
                                        <p className="text-2xl font-bold text-white">0.7</p>
                                        <p className="text-xs text-white/40">Harorat</p>
                                    </div>
                                </div>
                            </div>

                            {/* Test AI Chat */}
                            <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <MessageSquare size={20} className="text-purple-400" />
                                    AI ni Sinab Ko'rish
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={testMessage}
                                            onChange={(e) => setTestMessage(e.target.value)}
                                            placeholder="Test xabarini yozing..."
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                                            onKeyDown={(e) => e.key === 'Enter' && testAI()}
                                        />
                                        <button
                                            onClick={testAI}
                                            disabled={testLoading || !testMessage.trim()}
                                            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-all"
                                        >
                                            {testLoading ? '...' : 'Yuborish'}
                                        </button>
                                    </div>

                                    {testResponse && (
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                            <p className="text-xs text-white/40 mb-2">AI Javobi:</p>
                                            <p className="text-white text-sm whitespace-pre-wrap">{testResponse}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* API Configuration Info */}
                            <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Key size={20} className="text-purple-400" />
                                    API Sozlamalari
                                </h2>

                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4">
                                    <p className="text-amber-300 text-sm">
                                        ⚠️ API kaliti <code className="bg-black/30 px-2 py-0.5 rounded">.env</code> faylida saqlanadi.
                                        Xavfsizlik uchun kalitni hech kimga bermang.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                                        <span className="text-white/60 text-sm">API Provider</span>
                                        <span className="text-white text-sm font-medium">Google Gemini</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                                        <span className="text-white/60 text-sm">Endpoint</span>
                                        <span className="text-white text-sm font-medium">/api/ai-chat</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                                        <span className="text-white/60 text-sm">Til</span>
                                        <span className="text-white text-sm font-medium">O'zbek (default)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ai-tech' && (
                        /* AI Technician Control Panel */
                        <div className="space-y-6">
                            <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <Cpu size={20} className="text-purple-400" />
                                    AI Texnik
                                </h2>
                                <p className="text-white/40 text-sm mb-6">
                                    Veb-saytning tashqi ko'rinishi va funksional qismlarini boshqarish markazi.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    <div
                                        className={`p-4 bg-white/5 rounded-xl border transition-colors cursor-pointer ${frontendMode ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 hover:border-purple-500/30'}`}
                                        onClick={() => toggleSetting('frontendMode', !frontendMode, 'Frontend Rejimi')}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <Monitor className={frontendMode ? "text-purple-400" : "text-blue-400"} size={24} />
                                            <div className={`w-8 h-4 rounded-full relative transition-colors ${frontendMode ? 'bg-purple-600' : 'bg-white/20'}`}>
                                                <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${frontendMode ? 'right-1' : 'left-1'}`}></div>
                                            </div>
                                        </div>
                                        <h3 className="font-medium text-white">Frontend Rejimi</h3>
                                        <p className="text-xs text-white/40 mt-1">{frontendMode ? 'Faollashtirilgan' : 'Sayt dizaynini jonli tahrirlash'}</p>
                                    </div>

                                    <div
                                        className={`p-4 bg-white/5 rounded-xl border transition-colors cursor-pointer ${layoutLock ? 'border-green-500 bg-green-500/10' : 'border-white/5 hover:border-green-500/30'}`}
                                        onClick={() => toggleSetting('layoutLock', !layoutLock, 'Layout Qulflash')}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <Layout className={layoutLock ? "text-green-400" : "text-white/40"} size={24} />
                                            <div className={`w-8 h-4 rounded-full relative transition-colors ${layoutLock ? 'bg-green-600' : 'bg-white/20'}`}>
                                                <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${layoutLock ? 'right-1' : 'left-1'}`}></div>
                                            </div>
                                        </div>
                                        <h3 className="font-medium text-white">Layoutni Qulflash</h3>
                                        <p className="text-xs text-white/40 mt-1">{layoutLock ? 'Qulflangan' : 'Komponentlar joylashuvini qotirish'}</p>
                                    </div>
                                </div>

                                <div className="bg-black/80 rounded-xl p-4 border border-white/10 font-mono shadow-inner shadow-black/50 h-[300px] flex flex-col">
                                    <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                                        <Terminal size={16} className="text-green-400" />
                                        <span className="text-xs font-bold text-green-400 uppercase tracking-wider">AI Command Line</span>
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-2 mb-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2" ref={scrollRef}>
                                        {commandHistory.map((cmd, idx) => (
                                            <div key={idx} className={`text-sm ${cmd.type === 'input' ? 'text-white font-bold' : 'text-white/70'}`}>
                                                {cmd.type === 'input' ? (
                                                    <span className="text-purple-400 mr-2">$</span>
                                                ) : (
                                                    <span className="text-green-500/50 mr-2">&gt;</span>
                                                )}
                                                {cmd.type === 'output' && idx === commandHistory.length - 1 ? (
                                                    <Typewriter text={cmd.content} />
                                                ) : (
                                                    cmd.content
                                                )}
                                            </div>
                                        ))}
                                        {processingCommand && (
                                            <div className="text-sm text-green-500 animate-pulse">
                                                &gt; Bajarilmoqda...
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 items-center border-t border-white/10 pt-3">
                                        <span className="text-green-500 font-bold animate-pulse">$</span>
                                        <input
                                            type="text"
                                            value={commandInput}
                                            onChange={(e) => setCommandInput(e.target.value)}
                                            onKeyDown={handleCommand}
                                            disabled={processingCommand}
                                            placeholder="Buyruq kiriting (home, clear, help...)"
                                            className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder:text-white/20"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SettingsNav({
    icon,
    label,
    active = false,
    onClick
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                ${active
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-white/5'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }
            `}
        >
            <div className={active ? 'text-purple-400' : ''}>
                {icon}
            </div>
            <span className="font-medium text-sm">{label}</span>
        </button>
    );
}


function Typewriter({ text }: { text: string }) {
    const [display, setDisplay] = useState('');

    useEffect(() => {
        setDisplay('');
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplay(prev => text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 15);
        return () => clearInterval(interval);
    }, [text]);

    return <span>{display}{display.length < text.length && <span className="animate-pulse">|</span>}</span>
}
