'use client'

import React, { useState, useEffect } from "react"

/* =========================
   TYPES
========================= */
type ChatMessage = {
    role: 'user' | 'assistant'
    text: string
}

/* =========================
   AGENT COMPONENT
========================= */
export default function UniversalAgent() {
    const [isOpen, setIsOpen] = useState(false)
    const [question, setQuestion] = useState("")
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleAsk = async () => {
        if (!question.trim() || isLoading) return

        const userMessage = question.trim()
        setQuestion("")

        // Foydalanuvchi xabarini qo'shish
        const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userMessage }]
        setMessages(newMessages)
        setIsLoading(true)

        try {
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.map(m => ({ role: m.role, text: m.text }))
                })
            })

            const data = await response.json()

            if (data.success) {
                setMessages([...newMessages, { role: 'assistant', text: data.response }])
            } else {
                setMessages([...newMessages, { role: 'assistant', text: `❌ Xato: ${data.error || 'Noma\'lum xato'}` }])
            }
        } catch (error) {
            console.error('AI chat error:', error)
            setMessages([...newMessages, { role: 'assistant', text: '❌ Serverga ulanishda xatolik' }])
        } finally {
            setIsLoading(false)
        }
    }

    const clearChat = () => {
        setMessages([])
    }

    return (
        <>
            {/* Floating Button - Softer Design */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] w-14 h-14 md:w-16 md:h-16 rounded-3xl text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.9) 50%, rgba(236, 72, 153, 0.9) 100%)',
                    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                <span className="text-xl md:text-2xl relative z-10 transition-transform duration-300 group-hover:scale-110">
                    {isOpen ? '✕' : '🤖'}
                </span>
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)' }} />
            </button>

            {/* Agent Panel - Premium Glassmorphism */}
            {isOpen && (
                <div
                    className="fixed bottom-20 right-4 left-4 md:left-auto md:bottom-28 md:right-8 z-[100] md:w-[400px] rounded-3xl overflow-hidden animate-slideUp shadow-2xl"
                    style={{
                        background: 'linear-gradient(145deg, rgba(30, 27, 75, 0.95) 0%, rgba(20, 20, 40, 0.98) 100%)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 0 80px -20px rgba(139, 92, 246, 0.3)',
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    {/* Header - Soft Gradient */}
                    <div className="relative px-5 py-4 md:px-6 md:py-5 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
                                    style={{ boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)' }}>
                                    <span className="text-xl md:text-2xl">🤖</span>
                                </div>
                                <div>
                                    <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Termiziy AI</h2>
                                    <p className="text-[10px] md:text-xs text-emerald-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            {messages.length > 0 && (
                                <button
                                    onClick={clearChat}
                                    className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    Tozalash
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="p-4 md:p-5 space-y-4 max-h-[50vh] md:max-h-[350px] overflow-y-auto"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139, 92, 246, 0.3) transparent' }}>

                        {messages.length === 0 && !isLoading && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">💬</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">Savolingizni yozing yoki tanlang:</p>
                                <div className="flex flex-wrap gap-2 justify-center px-4">
                                    {["AI kurslari qanaqa?", "Narxlar qancha?", "Sertifikat beriladimi?", "Ro'yxatdan o'tish"].map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setQuestion(q); handleAsk() }}
                                            className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-gray-300 transition-colors"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                                        : 'bg-white/5 border border-white/10 text-gray-200'
                                        }`}
                                    style={{
                                        borderRadius: msg.role === 'user' ? '20px 20px 8px 20px' : '20px 20px 20px 8px'
                                    }}
                                >
                                    {msg.role === 'assistant' && i === messages.length - 1 ? (
                                        <Typewriter text={msg.text} />
                                    ) : (
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl" style={{ borderRadius: '20px 20px 20px 8px' }}>
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-5 pt-0">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Savolingizni yozing..."
                                className="flex-1 px-4 py-3.5 rounded-2xl text-white placeholder:text-gray-400 text-sm focus:outline-none transition-all duration-300"
                                style={{
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1) inset'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1), 0 2px 10px rgba(0,0,0,0.1) inset'
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                                    e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1) inset'
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleAsk}
                                disabled={isLoading || !question.trim()}
                                className="px-5 py-3.5 rounded-2xl text-white text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                                style={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                                }}
                            >
                                {isLoading ? '...' : "Jo'natish"}
                            </button>
                        </div>
                    </div>

                    {/* Footer Glow */}
                    <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />
                </div>
            )}

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </>
    )
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

    return <p className="whitespace-pre-wrap leading-relaxed">{display}{display.length < text.length && <span className="animate-pulse">|</span>}</p>
}

