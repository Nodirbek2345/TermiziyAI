'use client'

import { Moon, Sun, Send, Sparkles, Zap, Trophy, Users, Brain, Cpu, Network, Bot, Instagram, Youtube, Facebook, Briefcase, Code, Image as ImageIcon, TrendingUp, GraduationCap, MapPin } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import UniversalAgent from "@/components/UniversalAgent"

/* =========================
   PROMPT ANALYZER (FREE)
========================= */
function analyzePrompt(prompt: string) {
  let score = 0
  const feedback: string[] = []

  if (prompt.length > 50) score += 30
  else feedback.push("Prompt juda qisqa, batafsilroq yozing")

  if (/misol|example/i.test(prompt)) score += 20
  else feedback.push("Misollar so‘ralmagan")

  if (/qadam|bosqich|step/i.test(prompt)) score += 20
  else feedback.push("Bosqichlar aniqlanmagan")

  if (/format|ro‘yxat|list/i.test(prompt)) score += 30
  else feedback.push("Natija formati ko‘rsatilmagan")

  return { score, feedback }
}

/* =========================
   FAKE AI RESPONSE
========================= */
function fakeAIResponse(score: number) {
  if (score < 40)
    return "❌ Javob noaniq bo‘ladi. Prompt yetarli emas."

  if (score < 70)
    return "⚠️ Qisman foydali javob olinadi, lekin aniqlik kam."

  return "✅ Juda yaxshi prompt! Aniq va foydali javob olinadi."
}

/* =========================
   PROMPT COACH (FREE)
========================= */
function promptCoach(score: number) {
  if (score < 40)
    return "👉 Vazifani aniq yozing va natija formatini ko‘rsating."

  if (score < 70)
    return "👉 Misollar va bosqichlar qo‘shsangiz, prompt kuchayadi."

  return "🔥 Zo‘r! Endi murakkabroq vazifalarni sinab ko‘ring."
}

/* =========================
   HUQUQIY MA’LUMOTLAR BAZASI
========================= */
type LegalItem = {
  title: string
  content: string
  keywords: string[]
}

const legalData: LegalItem[] = [
  {
    title: "Mehnat shartnomasi",
    content:
      "Mehnat shartnomasi ish beruvchi va xodim o‘rtasidagi yozma kelishuv bo‘lib, unda ish shartlari, huquq va majburiyatlar belgilanadi.",
    keywords: ["mehnat", "ish", "shartnoma", "xodim"],
  },
  {
    title: "Mualliflik huquqi",
    content:
      "Mualliflik huquqi asar muallifining shaxsiy va mulkiy huquqlarini himoya qiladi.",
    keywords: ["mualliflik", "huquq", "asar"],
  },
  {
    title: "Shaxsiy ma’lumotlar",
    content:
      "Shaxsiy ma’lumotlar jismoniy shaxsga oid har qanday axborot bo‘lib, ularni himoya qilish qonun bilan belgilanadi.",
    keywords: ["shaxsiy", "ma’lumot", "himoya"],
  },
  {
    title: "Axborot texnologiyalari huquqi",
    content:
      "Axborot texnologiyalari huquqi IT sohasidagi munosabatlarni, dasturiy ta’minot va ma’lumotlar bazalarini huquqiy jihatdan tartibga soladi.",
    keywords: ["it", "axborot", "texnologiya", "dastur"],
  },
]

export default function Home() {
  const [darkMode, setDarkMode] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [view, setView] = useState<'hero' | 'contact' | 'courses' | 'paid-courses' | 'legal'>('hero')
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null) // Dropdown holati (index yoki null)

  // PromptTry State
  const [prompt, setPrompt] = useState("")
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string[]>([])
  const [aiResult, setAiResult] = useState("")
  const [coach, setCoach] = useState("")

  const runPlayground = () => {
    const analysis = analyzePrompt(prompt)
    setScore(analysis.score)
    setFeedback(analysis.feedback)
    setAiResult(fakeAIResponse(analysis.score))
    setCoach(promptCoach(analysis.score))
  }

  // Legal Search State
  const [legalQuery, setLegalQuery] = useState("")
  const [legalResults, setLegalResults] = useState<LegalItem[]>([])
  const [legalSearched, setLegalSearched] = useState(false)
  const [legalLoading, setLegalLoading] = useState(false)

  const handleLegalSearch = async () => {
    const q = legalQuery.trim()
    setLegalSearched(true)

    if (!q) {
      setLegalResults([])
      return
    }

    setLegalLoading(true)
    setLegalResults([]) // Clear previous results

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Quyidagi huquqiy savolga O'zbekiston qonunchiligi asosida javob bering: ${q}`,
          history: []
        })
      })

      const data = await response.json()

      if (data.success) {
        setLegalResults([{
          title: "Termiziy AI Javobi",
          content: data.response,
          keywords: ["ai", "yordamchi", "huquq", "qonun"]
        }])
      } else {
        setLegalResults([{
          title: "Xatolik",
          content: "Kechirasiz, javob olishda xatolik yuz berdi. Iltimos qayta urinib ko'ring. (" + data.error + ")",
          keywords: ["error"]
        }])
      }
    } catch (error) {
      console.error(error)
      setLegalResults([{
        title: "Aloqa Xatosi",
        content: "Server bilan bog'lanishda xatolik yuz berdi. Internetni tekshiring.",
        keywords: ["error"]
      }])
    } finally {
      setLegalLoading(false)
    }
  }

  // Dashboard State (Moved to line 184)

  // Dynamic Data State
  const [projects, setProjects] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [graduates, setGraduates] = useState<any[]>([])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalContent, setModalContent] = useState<any[]>([])
  const [modalType, setModalType] = useState<"project" | "review" | "graduate" | "text">("project")
  const [activeYear, setActiveYear] = useState<2025 | 2026>(2025);

  // Dashboard Data
  const statsData = {
    2025: {
      registered: 751318,
      graduates: 439860,
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
        { name: "Google Cloud Asoslari", count: 90450, color: "from-blue-600 to-cyan-400" },
        { name: "Data Science & AI for Business", count: 85420, color: "from-cyan-600 to-blue-400" },
      ]
    },
    2026: {
      registered: 1205100,
      graduates: 980200,
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

  const currentStats = statsData[activeYear];

  useEffect(() => {
    fetch('/api/projects').then(res => res.json()).then(data => Array.isArray(data) && setProjects(data)).catch(console.error)
    fetch('/api/reviews').then(res => res.json()).then(data => Array.isArray(data) && setReviews(data)).catch(console.error)
    fetch('/api/graduates').then(res => res.json()).then(data => Array.isArray(data) && setGraduates(data)).catch(console.error)
  }, [])

  const openInfoModal = (title: string, type: "project" | "review" | "graduate" | "text", filter?: string, text?: string) => {
    setModalTitle(title)
    setModalType(type)
    setModalOpen(true)

    if (type === 'project') {
      setModalContent(filter ? projects.filter(p => p.category === filter) : projects)
    } else if (type === 'review') {
      setModalContent(reviews)
    } else if (type === 'graduate') {
      setModalContent(graduates)
    } else if (type === 'text' && text) {
      setModalContent([{ text }])
    } else {
      setModalContent([])
    }
  }

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])

  // Dropdown tashqariga bosilganda yopish
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isInsideAnyDropdown = dropdownRefs.current.some(
        (ref) => ref && ref.contains(event.target as Node)
      )

      if (!isInsideAnyDropdown) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 3D Particle System
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationFrameId: number

    class Particle {
      x: number
      y: number
      z: number
      size: number
      speedX: number
      speedY: number
      speedZ: number
      color: string

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.z = Math.random() * 1000
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.speedZ = Math.random() * 2 + 1
        // Colors: Light mode uses darker shades, Dark mode uses lighter shades
        const colors = darkMode
          ? ['#60A5FA', '#A78BFA', '#EC4899', '#10B981']
          : ['#2563EB', '#7C3AED', '#DB2777', '#059669']
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.z -= this.speedZ

        if (this.z < 1) {
          this.z = 1000
          this.x = Math.random() * canvas!.width
          this.y = Math.random() * canvas!.height
        }

        if (this.x < 0 || this.x > canvas!.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas!.height) this.speedY *= -1
      }

      draw() {
        const scale = 1000 / (1000 + this.z)
        const x2d = (this.x - canvas!.width / 2) * scale + canvas!.width / 2
        const y2d = (this.y - canvas!.height / 2) * scale + canvas!.height / 2
        const size = this.size * scale

        ctx!.fillStyle = this.color
        ctx!.globalAlpha = 1 - this.z / 1000
        ctx!.beginPath()
        ctx!.arc(x2d, y2d, size, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    const particles: Particle[] = []
    // Mobil qurilmalarda kamroq zarracha (50 ta), kompyuterda ko'proq (150 ta)
    const particleCount = window.innerWidth < 768 ? 50 : 150

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      // Clear with fade effect based on theme
      // Dark mode: dark blue fade, Light mode: slate-300 fade
      // Dark mode: dark blue fade, Light mode: transparent (let gradient show) or very light fade
      ctx!.fillStyle = darkMode ? 'rgba(15, 23, 42, 0.1)' : 'rgba(255, 255, 255, 0.05)'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [darkMode])

  // Mouse tracking for 3D tilt (Optimized)
  useEffect(() => {
    // Mobil qurilmalarda 3D efektni o'chirish (batareya va unumdorlik uchun)
    if (window.innerWidth < 768) return

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        setMousePos({
          x: (e.clientX / window.innerWidth - 0.5) * 20,
          y: (e.clientY / window.innerHeight - 0.5) * 20
        })
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToContact = () => {
    handleViewChange('contact')
    setTimeout(() => {
      if (contactRef.current) {
        contactRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  const sendToTelegram = async () => {
    if (!name || !phone) {
      alert("Iltimos, ism va telefon raqamini to'ldiring!")
      return
    }

    try {
      // Foydalanuvchini bazaga saqlash
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email || null,
          phoneNumber: phone,
          role: 'Student',
          status: 'Active',
          message: message || null
        })
      })

      if (res.ok) {
        alert("✅ Siz muvaffaqiyatli ro'yxatdan o'tdingiz!")
        setName("")
        setPhone("")
        setEmail("")
        setMessage("")
        handleViewChange('paid-courses')
      } else {
        const data = await res.json()
        alert("❌ Xatolik: " + (data.error || "Noma'lum xato") + (data.details ? `\n\nTafsilot: ${data.details}` : ""))
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("❌ Serverga ulanishda xatolik! Internet aloqasini tekshiring.")
    }
  }


  // History API - Browser Back Button Support
  useEffect(() => {
    // Initial state replacement to ensure we have a state to pop back to
    window.history.replaceState({ view: 'hero' }, '', window.location.pathname)

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setView(event.state.view)
      } else {
        // Fallback to default view if no state (e.g. initial load)
        setView('hero')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Custom navigation function that pushes state to history
  const handleViewChange = (newView: 'hero' | 'contact' | 'courses' | 'paid-courses' | 'legal') => {
    setView(newView)
    window.history.pushState({ view: newView }, '', window.location.pathname)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <div className={darkMode ? "dark" : ""}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      <main className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${darkMode ? "bg-slate-950 text-white" : "bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 text-slate-900"}`}>

        {/* Animated gradient orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob will-change-transform" />
          <div className="absolute top-0 -right-1/4 w-1/2 h-1/2 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000 will-change-transform" />
          <div className="absolute -bottom-1/4 left-1/3 w-1/2 h-1/2 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000 will-change-transform" />
        </div>

        {/* Neural network grid */}
        <div className="fixed inset-0 pointer-events-none opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(96, 165, 250, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(96, 165, 250, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `perspective(1000px) rotateX(60deg) scale(2) translateY(-50%)`
          }} />
        </div>

        {/* Dark Mode Toggle - Only Visible in Hero */}
        {view === 'hero' && (
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`fixed top-[5%] right-4 md:right-8 z-50 p-3 md:p-4 rounded-2xl backdrop-blur-lg md:backdrop-blur-2xl transition-all shadow-2xl hover:scale-110 group ${darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white/10 border-white/20 hover:bg-white/30 shadow-lg"}`}
            style={{ borderWidth: 1 }}
          >
            <div className="relative">
              {darkMode ? <Sun className="w-6 h-6 md:w-7 md:h-7 group-hover:rotate-180 transition-transform duration-500" /> : <Moon className="w-6 h-6 md:w-7 md:h-7" />}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
            </div>
          </button>
        )}

        {/* Floating Social Icons - Only Visible in Hero */}
        {view === 'hero' && (
          <div className="fixed top-[5%] left-4 md:left-8 z-50 flex gap-2 md:gap-3">
            {[
              { Icon: Instagram, link: 'https://www.instagram.com/', color: 'hover:text-pink-500' },
              { Icon: Youtube, link: 'https://www.youtube.com/', color: 'hover:text-red-500' },
              { Icon: Facebook, link: 'https://www.facebook.com/?locale=ru_RU', color: 'hover:text-blue-500' }
            ].map(({ Icon, link, color }, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2.5 md:p-3 rounded-xl backdrop-blur-lg md:backdrop-blur-2xl transition-all hover:scale-110 cursor-pointer group border ${darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 active:bg-white/20" : "bg-white/10 border-white/20 hover:bg-white/30 active:bg-white/50 shadow-lg"}`}
                style={{
                  animation: `float 3s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`
                }}
              >
                <Icon className={`w-5 h-5 md:w-6 md:h-6 text-cyan-400 transition-colors ${color}`} />
              </a>
            ))}
          </div>
        )}

        {/* HERO Section with 3D effect */}
        {view === 'hero' && (
          <section className="container mx-auto px-6 pt-24 pb-12 md:pt-48 md:pb-40 text-center relative z-10">
            <div
              className="inline-flex items-center gap-2 md:gap-3 mb-6 md:mb-10 px-4 md:px-8 py-2 md:py-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-cyan-500/20 backdrop-blur-xl"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
                boxShadow: '0 0 50px rgba(6, 182, 212, 0.2)'
              }}
            >
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-cyan-400 animate-pulse" />
              <span className="text-sm md:text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                AIni biz bilan o&apos;rganing
              </span>
            </div>

            <h1
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[9rem] font-black mb-6 md:mb-10 relative"
              style={{
                transform: `
                  translateY(${scrollY * 0.05}px) 
                  perspective(1000px) 
                  rotateX(${mousePos.y * 0.3}deg) 
                  rotateY(${mousePos.x * 0.3}deg)
                `,
                transformStyle: 'preserve-3d'
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent blur-3xl opacity-50">
                TERMIZIY
              </span>
              <span className="relative bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                TERMIZIY
              </span>
              <br />
              <span className="relative bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x animation-delay-1000">
                AI
              </span>
            </h1>

            <p className={`text-base md:text-4xl mb-8 md:mb-16 max-w-5xl mx-auto font-light leading-relaxed ${darkMode ? "text-gray-300" : "text-slate-600"}`}>
              <span className="text-cyan-400 font-semibold">Sun&apos;iy intellekt</span> •{' '}
              <span className="text-purple-400 font-semibold">ChatGPT</span> •{' '}
              <span className="text-pink-400 font-semibold">Midjourney</span> •{' '}
              <span className="text-emerald-400 font-semibold">Professional</span> kurslar
            </p>

            {/* 3D Stats Cards */}


            <div className="flex flex-row gap-3 md:gap-6 justify-center w-full px-4 md:px-0">
              <button
                onClick={scrollToContact}
                className="group relative flex-1 md:flex-none text-sm md:text-2xl px-4 py-3 md:px-14 md:py-8 rounded-xl md:rounded-2xl font-bold overflow-hidden hover:scale-105 transition-all duration-300 md:min-w-[200px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-gradient-x" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 md:w-6 md:h-6" />
                  Kursga yozilish
                </span>
              </button>
              <button
                onClick={() => handleViewChange('legal')}
                className="flex-1 md:flex-none text-sm md:text-2xl px-4 py-3 md:px-14 md:py-8 rounded-xl md:rounded-2xl border border-cyan-500/30 hover:bg-cyan-500/10 backdrop-blur-xl transition-all font-bold hover:scale-105 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] md:min-w-[200px]"
              >
                Huquqiy IT
              </button>
            </div>

            {/* 3D Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 max-w-6xl mx-auto mt-12 md:mt-24 mb-20 md:mb-60 px-2 md:px-0">
              {[
                {
                  icon: <Users className="w-10 h-10" />,
                  number: "Hamjamiyat",
                  label: "Batafsil", // O'zgartirildi
                  color: "from-cyan-500 to-blue-500",
                  items: [
                    { label: "Bitiruvchilarimiz", subLabel: "Muvaffaqiyat hikoyalari", icon: "👨‍🎓", onClick: () => openInfoModal("Bizning Bitiruvchilar", "graduate") },
                    { label: "Talabalar fikrlari", subLabel: "Reviews", icon: "⭐", onClick: () => openInfoModal("Talabalar Fikrlari", "review") },
                    { label: "Telegram / Discord", subLabel: "Guruhga qo'shiling", icon: "💬", onClick: () => window.open("https://t.me/termiziy_ai", "_blank") }
                  ]
                },
                {
                  icon: <Trophy className="w-10 h-10" />,
                  number: "Real Caselar",
                  label: "Batafsil", // O'zgartirildi
                  color: "from-purple-500 to-pink-500",
                  items: [
                    { label: "ChatGPT loyihalari", subLabel: "Matn va kod", icon: "🤖", onClick: () => openInfoModal("ChatGPT Loyihalari", "project", "ChatGPT") },
                    { label: "Midjourney ishlar", subLabel: "Dizayn va san'at", icon: "🎨", onClick: () => openInfoModal("Midjourney Ishlar", "project", "Midjourney") },
                    { label: "AI botlar & agentlar", subLabel: "Avtomatlashtirish", icon: "🧠", onClick: () => openInfoModal("AI Botlar", "project", "Bot") }
                  ]
                },
                {
                  icon: <Sun className="w-10 h-10" />,
                  number: "Kurslar",
                  label: "Batafsil",
                  color: "from-purple-500 to-pink-500",
                  items: [
                    { label: "AI kurslar", subLabel: "Professional ta'lim", icon: "🎓", onClick: () => handleViewChange('courses') },
                    { label: "AI kutubxona", subLabel: "Resurslar to'plami", icon: "📚", onClick: () => openInfoModal('AI kutubxona', 'text', undefined, 'Sun\'iy intellekt bo\'yicha eng so\'nggi kitoblar va qo\'llanmalar tez orada shu yerda bo\'ladi.') },
                    { label: "Foydali AI", subLabel: "AI vositalar", icon: "⚡", onClick: () => openInfoModal('Foydali AI', 'text', undefined, 'Ishingizni osonlashtiruvchi eng sara AI vositalar ro\'yxati shakllantirilmoqda.') }
                  ]
                },
                {
                  icon: <Zap className="w-10 h-10" />,
                  number: "Natijalar",
                  label: "Batafsil", // O'zgartirildi
                  color: "from-emerald-500 to-cyan-500",
                  items: [
                    { label: "100% amaliyot", subLabel: "Real loyihalar", icon: "✅", onClick: () => openInfoModal('100% Amaliyot', 'text', undefined, "Bizning barcha kurslarimiz real keyslar va amaliyotga asoslangan. Siz shunchaki nazariyani emas, balki haqiqiy loyihalarni qanday qilishni o'rganasiz.") },
                    { label: "Ishga tayyor bilim", subLabel: "Karyera", icon: "🎯", onClick: () => openInfoModal('Ishga tayyor', 'text', undefined, "Bitiruvchilarimiz ishga joylashishda ko'mak oladilar. Biz eng yaxshi talabalarni hamkor kompaniyalarga tavsiya qilamiz.") },
                    { label: "Mentor yordami", subLabel: "24/7 qo'llab-quvvatlash", icon: "🧠", onClick: () => openInfoModal('Mentor yordami', 'text', undefined, "Sizga shaxsiy mentor biriktiriladi. O'qish davomida yuzaga kelgan har qanday savollaringizga javob olishingiz mumkin.") }
                  ]
                }
              ].map((stat, i) => (
                <div
                  key={i}
                  ref={(el) => { dropdownRefs.current[i] = el }}
                  className="group relative"
                >
                  <div
                    className={`relative p-6 md:p-8 rounded-2xl md:rounded-3xl backdrop-blur-lg md:backdrop-blur-2xl border transition-all duration-300 active:scale-95 active:opacity-80 ${darkMode ? "bg-white/5 border-white/10 active:bg-white/15" : "bg-white/10 border-white/20 active:bg-white/40 shadow-lg"} cursor-pointer`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    onClick={() => setActiveDropdown(activeDropdown === i ? null : i)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 rounded-2xl md:rounded-3xl transition-opacity blur-xl`} />
                    <div className="flex justify-center mb-3 md:mb-4 text-cyan-400">{stat.icon}</div>
                    <div className={`text-2xl md:text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 whitespace-nowrap text-center`}>
                      {stat.number}
                    </div>
                    <div className={`text-xs md:text-sm font-semibold text-center ${darkMode ? "text-gray-400" : "text-slate-600"}`}>{stat.label}</div>
                  </div>

                  {/* Dropdown Menu */}
                  {activeDropdown === i && (
                    <div
                      className={`absolute top-full mt-3 rounded-2xl bg-slate-900/95 backdrop-blur-lg md:backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden animate-slideDown z-50 w-72 md:w-64 mx-0 ${i % 2 === 0 ? "left-0" : "right-0"} md:left-1/2 md:right-auto md:-translate-x-1/2`}
                    >
                      <div className="p-2">
                        {stat.items.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation()
                              item.onClick()
                              setActiveDropdown(null)
                            }}
                            className="w-full px-4 py-3 rounded-xl text-left hover:bg-cyan-500/10 transition-all group/item"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <span className="text-xl">{item.icon}</span>
                              </div>
                              <div>
                                <div className="text-white font-semibold group-hover/item:text-cyan-400 transition-colors">
                                  {item.label}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {item.subLabel}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* New Info Grid Section */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto mb-20 md:mb-40 px-2 md:px-4 relative z-10`}>

              {/* Column 1: Kimlar uchun? */}
              <div className={`p-4 md:p-8 rounded-2xl md:rounded-3xl backdrop-blur-lg md:backdrop-blur-2xl border transition-all duration-300 hover:shadow-2xl ${darkMode ? "bg-white/5 border-white/10" : "bg-white/10 border-white/20 shadow-lg"}`}>
                <h3 className={`text-xl md:text-3xl font-bold mb-4 md:mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent`}>
                  Kimlar uchun?
                </h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: "Talabalar", desc: "AI yordamida yangi bilim va kasb o‘rganish" },
                    { label: "Biznes egalari", desc: "Ishni tezlashtirish va xarajatni kamaytirish" },
                    { label: "Dasturchilar", desc: "Kod yozishni oson va tez qilish" },
                    { label: "Dizaynerlar", desc: "Rasmlar va dizaynni AI bilan yaratish" },
                    { label: "Freelancerlar", desc: "Buyurtmalarni tez bajarish va ko‘proq daromad" }
                  ].map((item, i) => (
                    <div key={i} className="group relative">
                      <span
                        className={`px-6 py-3 rounded-full text-base font-medium backdrop-blur-md border transition-all hover:scale-105 cursor-default inline-block ${darkMode ? "bg-white/10 text-cyan-300 border-white/10 hover:bg-white/20" : "bg-white/40 text-slate-700 border-white/40 hover:bg-white/60 shadow-sm"}`}
                      >
                        {item.label}
                      </span>
                      {/* Tooltip */}
                      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 rounded-xl backdrop-blur-lg md:backdrop-blur-2xl border shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20 text-center ${darkMode ? "bg-slate-900/90 border-white/10 text-gray-200" : "bg-white/90 border-white/20 text-slate-700"}`}>
                        <p className="text-xs leading-relaxed font-medium">{item.desc}</p>
                        {/* Arrow */}
                        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-b border-r rotate-45 ${darkMode ? "bg-slate-900/90 border-white/10" : "bg-white/90 border-white/20"}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Biz nimani o'rgatamiz? */}
              <div className={`p-4 md:p-8 rounded-2xl md:rounded-3xl backdrop-blur-lg md:backdrop-blur-2xl border transition-all duration-300 hover:shadow-2xl flex flex-col ${darkMode ? "bg-white/5 border-white/10" : "bg-white/10 border-white/20 shadow-lg"}`}>
                <h3 className={`text-xl md:text-3xl font-bold mb-4 md:mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent`}>
                  Biz nimani o'rgatamiz?
                </h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    { title: "AI asoslari", icon: <Brain className="w-4 h-4" />, color: "text-purple-400", desc: "ChatGPT’dan to‘g‘ri foydalanish" },
                    { title: "Midjourney", icon: <ImageIcon className="w-4 h-4" />, color: "text-pink-400", desc: "Matndan rasm yaratish" },
                    { title: "AI biznesda", icon: <Briefcase className="w-4 h-4" />, color: "text-blue-400", desc: "Kundalik ishlarni avtomatlashtirish" },
                    { title: "Amaliy mashqlar", icon: <Code className="w-4 h-4" />, color: "text-emerald-400", desc: "O‘rganib darhol sinab ko‘rish" }
                  ].map((item, i) => (
                    <div key={i} className="group relative">
                      <span
                        className={`px-6 py-3 rounded-full text-base font-medium backdrop-blur-md border transition-all hover:scale-105 cursor-default flex items-center gap-2 ${darkMode ? "bg-white/10 text-gray-200 border-white/10 hover:bg-white/20" : "bg-white/40 text-slate-700 border-white/40 hover:bg-white/60 shadow-sm"}`}
                      >
                        <span className={item.color}>{item.icon}</span>
                        {item.title}
                      </span>
                      {/* Tooltip */}
                      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 rounded-xl backdrop-blur-lg md:backdrop-blur-2xl border shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20 text-center ${darkMode ? "bg-slate-900/90 border-white/10 text-gray-200" : "bg-white/90 border-white/20 text-slate-700"}`}>
                        <p className="text-xs leading-relaxed font-medium">{item.desc}</p>
                        {/* Arrow */}
                        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-b border-r rotate-45 ${darkMode ? "bg-slate-900/90 border-white/10" : "bg-white/90 border-white/20"}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Qanday o'qitamiz? */}
              <div className={`p-4 md:p-8 rounded-2xl md:rounded-3xl backdrop-blur-lg md:backdrop-blur-2xl border transition-all duration-300 hover:shadow-2xl flex flex-col ${darkMode ? "bg-white/5 border-white/10" : "bg-white/10 border-white/20 shadow-lg"}`}>
                <h3 className={`text-xl md:text-3xl font-bold mb-4 md:mb-8 bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent`}>
                  Qanday o'qitamiz?
                </h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    { title: "Kursga yozilasiz", icon: "📝", desc: "Bir necha daqiqada boshlaysiz" },
                    { title: "Darslarni ko'rasiz", icon: "📺", desc: "Video va jonli tushuntirish" },
                    { title: "Mashq qilasiz", icon: "💻", desc: "Real misollar bilan" },
                    { title: "Natija olasiz", icon: "🚀", desc: "Bilim, tajriba va sertifikat" }
                  ].map((step, i) => (
                    <div key={i} className="group relative">
                      <span
                        className={`px-6 py-3 rounded-full text-base font-medium backdrop-blur-md border transition-all hover:scale-105 cursor-default flex items-center gap-2 ${darkMode ? "bg-white/10 text-gray-200 border-white/10 hover:bg-white/20" : "bg-white/40 text-slate-700 border-white/40 hover:bg-white/60 shadow-sm"}`}
                      >
                        <span>{step.icon}</span>
                        {step.title}
                      </span>

                      {/* Tooltip */}
                      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 rounded-xl backdrop-blur-lg md:backdrop-blur-2xl border shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20 text-center ${darkMode ? "bg-slate-900/90 border-white/10 text-gray-200" : "bg-white/90 border-white/20 text-slate-700"}`}>
                        <p className="text-xs leading-relaxed font-medium">{step.desc}</p>
                        {/* Arrow */}
                        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-b border-r rotate-45 ${darkMode ? "bg-slate-900/90 border-white/10" : "bg-white/90 border-white/20"}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DASHBOARD SECTION - STATIC RESULTS */}
            <div className="max-w-7xl mx-auto mb-20 md:mb-40 px-3 md:px-4 relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-10 text-white leading-tight">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Yillar kesimida</span>
                <br className="md:hidden" /> erishilgan natijalar
              </h2>

              {/* Year Toggle - Premium Style */}
              <div className="flex justify-center mb-10">
                <div className="bg-slate-900/80 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 flex gap-1 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50" />
                  {[2025, 2026].map((year) => (
                    <button
                      key={year}
                      onClick={() => setActiveYear(year as 2025 | 2026)}
                      className={`relative z-10 px-8 py-3 rounded-xl text-base font-bold transition-all duration-300 ${activeYear === year ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/40 backdrop-blur-lg md:backdrop-blur-2xl border border-white/10 rounded-3xl p-4 md:p-8">

                {/* Top Statistics Cards - Mobile Grid v2 (2 columns) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
                  {/* Card 1 */}
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-4 md:p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-slate-400 text-xs md:text-sm font-medium leading-tight">Ro'yxatdan<br />o'tganlar</span>
                        <div className="p-1.5 md:p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                          <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                        </div>
                      </div>
                      <div className="mb-2">
                        <span className="text-xl md:text-3xl font-black text-white block tracking-tight group-hover:scale-105 transition-transform origin-left">
                          {currentStats.registered.toLocaleString()}
                        </span>
                        <span className="text-slate-500 text-[10px] md:text-xs font-medium">nafar</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2 bg-emerald-500/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md w-fit">
                        <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 text-emerald-400" />
                        <span className="text-emerald-400 text-[10px] md:text-xs font-bold">{currentStats.growth}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-4 md:p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300">
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-slate-400 text-xs md:text-sm font-medium leading-tight">Bitirganlar<br />soni</span>
                        <div className="p-1.5 md:p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                          <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                        </div>
                      </div>
                      <div className="mb-2">
                        <span className="text-xl md:text-3xl font-black text-white block tracking-tight group-hover:scale-105 transition-transform origin-left">
                          {currentStats.graduates.toLocaleString()}
                        </span>
                        <span className="text-slate-500 text-[10px] md:text-xs font-medium">nafar</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2 bg-emerald-500/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md w-fit">
                        <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 text-emerald-400" />
                        <span className="text-emerald-400 text-[10px] md:text-xs font-bold">17%</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-4 md:p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] transition-all duration-300">
                    <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-slate-400 text-xs md:text-sm font-medium leading-tight">Erkak/Ayol<br />nisbati</span>
                        <div className="flex -space-x-1">
                          <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-blue-500/20 border-2 border-slate-800 flex items-center justify-center text-[8px] md:text-[10px] text-blue-400 font-bold">M</div>
                          <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-pink-500/20 border-2 border-slate-800 flex items-center justify-center text-[8px] md:text-[10px] text-pink-400 font-bold">F</div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-baseline gap-1 md:gap-2 group-hover:scale-105 transition-transform origin-left">
                          <span className="text-xl md:text-3xl font-black text-blue-400 tracking-tight">{currentStats.genderRatio.m}</span>
                          <span className="text-slate-500 text-[10px] md:text-sm font-medium">:</span>
                          <span className="text-xl md:text-3xl font-black text-pink-400 tracking-tight">{currentStats.genderRatio.f}</span>
                        </div>
                        <span className="text-slate-500 text-[10px] md:text-xs font-medium">har 100 tadan</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-4 md:p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300">
                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-slate-400 text-xs md:text-sm font-medium leading-tight">Top<br />hudud</span>
                        <div className="p-1.5 md:p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                          <MapPin className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                        </div>
                      </div>
                      <div className="mb-2">
                        <span className="text-lg md:text-3xl font-black text-white block tracking-tight group-hover:scale-105 transition-transform origin-left truncate">
                          {currentStats.fastestRegion}
                        </span>
                        <span className="text-slate-500 text-[10px] md:text-xs font-medium">
                          {currentStats.fastestRegion === "Andijon" ? "viloyati" : "shahri"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-2 bg-emerald-500/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md w-fit">
                        <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 text-emerald-400" />
                        <span className="text-emerald-400 text-[10px] md:text-xs font-bold">{currentStats.growth}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Left Column: Region Ranking */}
                  <div className="bg-slate-800/40 rounded-3xl p-8 border border-white/5 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h4 className="font-bold text-xl text-white">Hududlar reytingi</h4>
                        <p className="text-sm text-slate-400 mt-1">Platforma orqali kurs bitirganlar soni bo'yicha</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded-xl">
                        <MapPin className="w-6 h-6 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {currentStats.regionRanking.map((region, i) => (
                        <div key={i} className="relative h-14 rounded-xl overflow-hidden group bg-slate-900/50 border border-white/5">
                          <div
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${region.color} transition-all duration-1000 group-hover:brightness-110 opacity-80`}
                            style={{ width: `${(region.count / 350000) * 100}%` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-between px-6 z-10">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 flex items-center justify-center bg-black/20 rounded-full text-xs font-bold text-white/70">
                                {i + 1}
                              </span>
                              <span className="font-semibold text-white drop-shadow-md truncate max-w-[120px] md:max-w-none">{region.name}</span>
                            </div>
                            <span className="font-bold text-white drop-shadow-md bg-black/20 px-3 py-1 rounded-lg border border-white/10">
                              {region.count.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Course Ranking */}
                  <div className="bg-slate-800/40 rounded-3xl p-8 border border-white/5 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h4 className="font-bold text-xl text-white">Kurslar reytingi</h4>
                        <p className="text-sm text-slate-400 mt-1">Platforma orqali tugatilgan top 5 kurslar</p>
                      </div>
                      <div className="p-2 bg-amber-500/10 rounded-xl">
                        <Trophy className="w-6 h-6 text-amber-400" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {currentStats.courseRanking.map((course, i) => (
                        <div key={i} className="relative h-16 rounded-xl overflow-hidden group bg-slate-900/50 border border-white/5">
                          <div
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${course.color} transition-all duration-1000 group-hover:brightness-110 opacity-80`}
                            style={{ width: `${(course.count / 350000) * 100}%` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-between px-6 z-10">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-black/20 rounded-full text-xs font-bold text-white/70">
                                {i + 1}
                              </span>
                              <span className="font-semibold text-white truncate drop-shadow-md text-sm md:text-base">{course.name}</span>
                            </div>
                            <span className="flex-shrink-0 font-bold text-white drop-shadow-md bg-black/20 px-3 py-1 rounded-lg border border-white/10 ml-4">
                              {course.count.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </section >
        )
        }

        {/* CONTACT Section - Hero qismida */}
        {
          view === 'contact' && (
            <section ref={contactRef} className="container mx-auto px-3 md:px-6 py-12 md:py-40 relative z-10">
              <h2 className="text-4xl md:text-8xl font-black text-center mb-12 md:mb-24 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight pb-4">
                Ro&apos;yhatdan o&apos;tish
              </h2>

              <div
                className={`max-w-3xl mx-auto p-6 md:p-12 rounded-3xl backdrop-blur-lg md:backdrop-blur-2xl border shadow-2xl relative overflow-hidden mobile-disable-3d ${darkMode ? "bg-white/5 border-white/10" : "bg-white/10 border-white/20 shadow-xl"}`}
                style={{
                  transform: `perspective(1000px) rotateX(${mousePos.y * 0.2}deg) rotateY(${mousePos.x * 0.2}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />

                <div className="relative space-y-8">
                  <div className="group">
                    <label className={`text-xl font-semibold block mb-3 ${darkMode ? "text-gray-300" : "text-slate-700"}`}>F.I.Sh.</label>
                    <input
                      type="text"
                      placeholder="Ismingizni kiriting"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-6 py-5 rounded-xl border-2 focus:border-cyan-400 focus:outline-none transition-all text-lg backdrop-blur-xl ${darkMode ? "bg-white/5 border-white/10 group-hover:bg-white/10 focus:bg-white/10" : "bg-white/10 border-white/30 group-hover:bg-white/30 focus:bg-white/30 shadow-inner"}`}
                    />
                  </div>

                  <div className="group">
                    <label className={`text-xl font-semibold block mb-3 ${darkMode ? "text-gray-300" : "text-slate-700"}`}>Email (ixtiyoriy)</label>
                    <input
                      type="email"
                      placeholder="email@misol.uz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-6 py-5 rounded-xl border-2 focus:border-cyan-400 focus:outline-none transition-all text-lg backdrop-blur-xl ${darkMode ? "bg-white/5 border-white/10 group-hover:bg-white/10 focus:bg-white/10" : "bg-white/10 border-white/30 group-hover:bg-white/30 focus:bg-white/30 shadow-inner"}`}
                    />
                  </div>

                  <div className="group">
                    <label className={`text-xl font-semibold block mb-3 ${darkMode ? "text-gray-300" : "text-slate-700"}`}>Telefon</label>
                    <input
                      type="tel"
                      placeholder="+998 __ ___ __ __"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-6 py-5 rounded-xl border-2 focus:border-cyan-400 focus:outline-none transition-all text-lg backdrop-blur-xl ${darkMode ? "bg-white/5 border-white/10 group-hover:bg-white/10 focus:bg-white/10" : "bg-white/10 border-white/30 group-hover:bg-white/30 focus:bg-white/30 shadow-inner"}`}
                    />
                  </div>

                  <div className="group">
                    <label className={`text-xl font-semibold block mb-3 ${darkMode ? "text-gray-300" : "text-slate-700"}`}>Xabar (ixtiyoriy)</label>
                    <textarea
                      placeholder="Xabaringizni yozing..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`w-full px-6 py-5 rounded-xl border-2 focus:border-cyan-400 focus:outline-none transition-all min-h-44 resize-none text-lg backdrop-blur-xl ${darkMode ? "bg-white/5 border-white/10 group-hover:bg-white/10 focus:bg-white/10" : "bg-white/10 border-white/30 group-hover:bg-white/30 focus:bg-white/30 shadow-inner"}`}
                    />
                  </div>

                  <button
                    onClick={sendToTelegram}
                    className="group relative w-full text-xl py-7 rounded-xl font-bold flex items-center justify-center gap-3 overflow-hidden hover:scale-105 transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-gradient-x" />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <Send className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Kurslarga o&apos;tish</span>
                  </button>
                </div>
              </div>
            </section>
          )
        }

        {/* COURSES Section - Tasdiqdan keyin ko'rinadi */}
        {
          view === 'courses' && (
            <section className="container mx-auto px-6 py-20 md:py-40 relative z-10">
              <h2 className="text-3xl md:text-7xl font-black text-center mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI kurslari
              </h2>
              <p className={`text-center mb-16 text-xl ${darkMode ? "text-gray-400" : "text-slate-600"}`}>
                Professional va amaliy ko&apos;nikmalar
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 max-w-[1600px] mx-auto px-2 md:px-0">
                {/* Kurs 1 - Generativ AI */}
                <a
                  href="https://www.coursera.org/programs/learning-program-h13rq/learn/introduction-to-generative-ai?collectionId=2mufz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group rounded-2xl overflow-hidden border hover:shadow-2xl hover:scale-105 transition-all duration-300 ${darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white/10 border-white/20 hover:bg-white/30 shadow-lg"}`}
                >
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-20 h-20 text-emerald-300 opacity-70" />
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      BEPUL
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors min-h-[3rem]">
                      Generativ Sun&apos;iy Intellektga Kirish
                    </h3>
                    <div className="flex gap-2 mt-3">
                      <div className={`flex-1 py-3 rounded-xl border transition-all text-sm font-bold flex items-center justify-center cursor-pointer ${darkMode ? "border-white/20 text-white hover:bg-white/10" : "border-slate-500/30 text-slate-700 hover:bg-slate-500/10"}`}>
                        Batafsil
                      </div>
                      <div className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 transition-all text-sm font-bold text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center cursor-pointer">
                        Boshlash →
                      </div>
                    </div>
                  </div>
                </a>

                {/* Kurs 2 - Google Cloud */}
                <a
                  href="https://www.coursera.org/programs/learning-program-h13rq/learn/gcp-fundamentals?collectionId=2mufz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group rounded-2xl overflow-hidden border hover:shadow-2xl hover:scale-105 transition-all duration-300 ${darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white/10 border-white/20 hover:bg-white/30 shadow-lg"}`}
                >
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Network className="w-20 h-20 text-blue-300 opacity-70" />
                    </div>
                    <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      BEPUL
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors min-h-[3rem]">
                      Google Cloud Asoslari: Asosiy Infratuzilma
                    </h3>
                    <div className="flex gap-2 mt-3">
                      <div className={`flex-1 py-3 rounded-xl border transition-all text-sm font-bold flex items-center justify-center cursor-pointer ${darkMode ? "border-white/20 text-white hover:bg-white/10" : "border-slate-500/30 text-slate-700 hover:bg-slate-500/10"}`}>
                        Batafsil
                      </div>
                      <div className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all text-sm font-bold text-white shadow-lg shadow-blue-500/20 flex items-center justify-center cursor-pointer">
                        Boshlash →
                      </div>
                    </div>
                  </div>
                </a>

                {/* Kurs 3 - ChatGPT, DALL-E, GPT-4 */}
                <a
                  href="https://www.coursera.org/programs/learning-program-h13rq/learn/build-ai-apps-with-chatgpt-dalle-gpt4?collectionId=2mufz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group rounded-2xl overflow-hidden border hover:shadow-2xl hover:scale-105 transition-all duration-300 ${darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white/10 border-white/20 hover:bg-white/30 shadow-lg"}`}
                >
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Cpu className="w-20 h-20 text-cyan-300 opacity-70" />
                    </div>
                    <div className="absolute top-3 right-3 bg-cyan-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      BEPUL
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors min-h-[3rem]">
                      ChatGPT, DALL·E va GPT-4 dasturi Sun&apos;iy Intellekt Ilovalari Yaratish
                    </h3>
                    <div className="flex gap-2 mt-3">
                      <div className={`flex-1 py-3 rounded-xl border transition-all text-sm font-bold flex items-center justify-center cursor-pointer ${darkMode ? "border-white/20 text-white hover:bg-white/10" : "border-slate-500/30 text-slate-700 hover:bg-slate-500/10"}`}>
                        Batafsil
                      </div>
                      <div className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all text-sm font-bold text-white shadow-lg shadow-cyan-500/20 flex items-center justify-center cursor-pointer">
                        Boshlash →
                      </div>
                    </div>
                  </div>
                </a>

                {/* Kurs 4 - Dasturlashga Kirish */}
                <a
                  href="https://www.coursera.org/programs/learning-program-h13rq/learn/intro-programming?collectionId=2mufz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group rounded-2xl overflow-hidden border hover:shadow-2xl hover:scale-105 transition-all duration-300 ${darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white/10 border-white/20 hover:bg-white/30 shadow-lg"}`}
                >
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-20 h-20 text-purple-300 opacity-70" />
                    </div>
                    <div className="absolute top-3 right-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      BEPUL
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors min-h-[3rem]">
                      O&apos;zingiz Kod Yozing: Dasturlashga Kirish
                    </h3>
                    <div className="flex gap-2 mt-3">
                      <div className={`flex-1 py-3 rounded-xl border transition-all text-sm font-bold flex items-center justify-center cursor-pointer ${darkMode ? "border-white/20 text-white hover:bg-white/10" : "border-slate-500/30 text-slate-700 hover:bg-slate-500/10"}`}>
                        Batafsil
                      </div>
                      <div className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-all text-sm font-bold text-white shadow-lg shadow-purple-500/20 flex items-center justify-center cursor-pointer">
                        Boshlash →
                      </div>
                    </div>
                  </div>
                </a>

                {/* Kurs 5 - IoT */}
                <a
                  href="https://www.coursera.org/programs/learning-program-h13rq/learn/iot-wireless-cloud-computing?collectionId=2mufz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group rounded-2xl overflow-hidden border hover:shadow-2xl hover:scale-105 transition-all duration-300 ${darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white/10 border-white/20 hover:bg-white/30 shadow-lg"}`}
                >
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-orange-900 via-amber-900 to-yellow-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-20 h-20 text-orange-300 opacity-70" />
                    </div>
                    <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      YANGI
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors min-h-[3rem]">
                      IoT (Narsalar interneti) Simsiz va Bulutli Hisoblash — Yangi
                    </h3>
                    <div className="flex gap-2 mt-3">
                      <div className={`flex-1 py-3 rounded-xl border transition-all text-sm font-bold flex items-center justify-center cursor-pointer ${darkMode ? "border-white/20 text-white hover:bg-white/10" : "border-slate-500/30 text-slate-700 hover:bg-slate-500/10"}`}>
                        Batafsil
                      </div>
                      <div className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition-all text-sm font-bold text-white shadow-lg shadow-orange-500/20 flex items-center justify-center cursor-pointer">
                        Boshlash →
                      </div>
                    </div>
                  </div>
                </a>
              </div>

              {/* PROMPT TRY SECTION */}
              <div className="mt-40 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black text-center mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight pb-4">
                  🧠 PromptTry
                </h2>
                <p className={`text-center mb-12 text-lg ${darkMode ? "text-gray-400" : "text-slate-600"}`}>
                  AI simulyatsiya
                </p>

                <div className={`p-8 rounded-3xl border backdrop-blur-xl ${darkMode ? "bg-white/5 border-white/10" : "bg-white/10 border-white/20 shadow-xl"}`}>

                  {/* PROMPT INPUT */}
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Prompt yozing..."
                    className={`w-full h-40 p-6 rounded-2xl border text-lg focus:outline-none transition-all resize-none ${darkMode ? "bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-cyan-500/50" : "bg-white/40 border-white/30 text-slate-800 placeholder:text-slate-500 focus:border-cyan-500/50"}`}
                  />

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={runPlayground}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                    >
                      Sinab ko‘rish
                    </button>
                  </div>

                  {/* RESULT */}
                  {score !== null && (
                    <div className="mt-8 space-y-4 animate-slideDown">
                      <div className={`p-6 rounded-2xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-white/20 border-white/20"}`}>
                        <h3 className={`font-bold mb-2 ${darkMode ? "text-gray-200" : "text-slate-700"}`}>📊 Prompt Score</h3>
                        <div className="flex items-end gap-2">
                          <span className={`text-4xl font-black ${score > 70 ? "text-emerald-400" : score > 40 ? "text-amber-400" : "text-red-400"}`}>{score}</span>
                          <span className="text-gray-500 mb-1">/ 100</span>
                        </div>
                      </div>

                      <div className={`p-6 rounded-2xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-white/20 border-white/20"}`}>
                        <h3 className={`font-bold mb-2 ${darkMode ? "text-gray-200" : "text-slate-700"}`}>🤖 AI Natija (Simulyatsiya)</h3>
                        <p className={`text-lg ${darkMode ? "text-gray-300" : "text-slate-700"}`}>{aiResult}</p>
                      </div>

                      {feedback.length > 0 && (
                        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                          <h3 className="font-bold text-red-400 mb-2">
                            ❌ Kamchiliklar
                          </h3>
                          <ul className="list-disc list-inside space-y-1">
                            {feedback.map((f, i) => (
                              <li key={i} className={darkMode ? "text-red-200/80" : "text-red-800/80"}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                        <h3 className="font-bold text-emerald-400 mb-2">
                          🧑‍🏫 Prompt Coach
                        </h3>
                        <p className={darkMode ? "text-emerald-200/80" : "text-emerald-800/80"}>{coach}</p>
                      </div>
                    </div>
                  )}

                  {/* EXAMPLES */}
                  <div className="mt-12 grid md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-red-500/5 dashed border border-red-500/20">
                      <h3 className="font-bold text-red-400 mb-2">
                        ❌ Yomon prompt
                      </h3>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-slate-600"}`}>
                        AI haqida aytib ber
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-emerald-500/5 dashed border border-emerald-500/20">
                      <h3 className="font-bold text-emerald-400 mb-2">
                        ✅ Yaxshi prompt
                      </h3>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-slate-600"}`}>
                        AI Playground nima va beginnerlar uchun qanday foyda beradi?
                        3 ta misol va bosqichlar bilan tushuntir, ro‘yxat formatida.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </section>
          )
        }

        {/* PAID COURSES Section - Form submitdan keyin ochiladi */}
        {
          view === 'paid-courses' && (
            <section className="container mx-auto px-6 py-20 md:py-40 relative z-10">
              <h2 className="text-3xl md:text-7xl font-black text-center mb-6 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                Pullik kurslar
              </h2>
              <p className={`text-center mb-16 text-xl ${darkMode ? "text-gray-400" : "text-slate-600"}`}>
                Chuqurlashtirilgan professional ta&apos;lim
              </p>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Kurs 1 - AI Engineering */}
                <div className={`p-8 rounded-3xl backdrop-blur-lg md:backdrop-blur-2xl border transition-all duration-300 hover:scale-105 group relative overflow-hidden ${darkMode ? "bg-white/5 border-white/10 hover:border-amber-500/50" : "bg-white/10 border-white/20 hover:border-amber-500/50 shadow-xl"}`}>
                  <div className="absolute top-0 right-0 p-4">
                    <span className="px-4 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold border border-amber-500/50">
                      PREMIUM
                    </span>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                    <Cpu className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white">AI Engineering Masterclass</h3>
                  <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-slate-600"}`}>
                    Katta tillar modellari (LLMs), RAG tizimlari va AI agentlarini noldan ishlab chiqishni o'rganing.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-amber-500">✓</span> Python & PyTorch
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-amber-500">✓</span> OpenAI & LangChain
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-amber-500">✓</span> Real loyihalar portfolioga
                    </li>
                  </ul>
                  <button className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <span>Kursga yozilish</span>
                    <span className="text-white/70 text-sm line-through">$400</span>
                    <span>$199</span>
                  </button>
                </div>

                {/* Kurs 2 - Data Science & AI */}
                <div className={`p-8 rounded-3xl backdrop-blur-lg md:backdrop-blur-2xl border transition-all duration-300 hover:scale-105 group relative overflow-hidden ${darkMode ? "bg-white/5 border-white/10 hover:border-blue-500/50" : "bg-white/10 border-white/20 hover:border-blue-500/50 shadow-xl"}`}>
                  <div className="absolute top-0 right-0 p-4">
                    <span className="px-4 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold border border-blue-500/50">
                      BUSINESS
                    </span>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                    <Network className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Data Science & AI for Business</h3>
                  <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-slate-600"}`}>
                    Biznes ma'lumotlarini tahlil qilish, bashorat qilish va AI strategiyalarini joriy etish.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-blue-500">✓</span> Data Analysis & Vizualizatsiya
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-blue-500">✓</span> Machine Learning asoslari
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-blue-500">✓</span> Biznes keyslar
                    </li>
                  </ul>
                  <button className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <span>Kursga yozilish</span>
                    <span className="text-white/70 text-sm line-through">$350</span>
                    <span>$149</span>
                  </button>
                </div>
              </div>
            </section>
          )
        }

        {/* LEGAL SEARCH SECTION - Android 8 Style UI */}
        {
          view === 'legal' && (
            <section className="container mx-auto px-6 py-20 md:py-40 relative z-10">
              <div className="max-w-3xl mx-auto">
                {/* Header with Back Button */}
                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={() => handleViewChange('hero')}
                    className={`p-2 rounded-full transition-colors ${darkMode ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m15 18-6-6 6-6" /></svg>
                  </button>
                  <div>
                    <h1 className="text-2xl font-medium tracking-tight">Huquqiy Axborot</h1>
                    <p className={`text-sm ${darkMode ? "text-white/60" : "text-slate-500"}`}>
                      O'zbekiston Respublikasi Qonunchiligi
                    </p>
                  </div>
                </div>

                {/* Material Search Bar */}
                <div className={`relative mb-8 shadow-lg rounded-2xl overflow-hidden transition-all ${darkMode ? "bg-white/5" : "bg-white"}`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 ${darkMode ? "text-white/40" : "text-slate-400"}`}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                  </div>
                  <input
                    value={legalQuery}
                    onChange={(e) => setLegalQuery(e.target.value)}
                    placeholder="Qonun yoki qarorni qidiring..."
                    className={`w-full py-4 pl-12 pr-4 bg-transparent border-none focus:ring-0 focus:outline-none text-base placeholder:text-opacity-50 ${darkMode ? "text-white placeholder:text-white" : "text-slate-900 placeholder:text-slate-500"}`}
                  />
                  <button
                    onClick={handleLegalSearch}
                    disabled={legalLoading}
                    className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {legalLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Izlanmoqda...
                      </>
                    ) : (
                      "Qidirish"
                    )}
                  </button>
                </div>

                {/* Status/Results */}
                <div className="space-y-4">
                  {legalLoading && (
                    <div className="text-center py-12">
                      <div className="animate-pulse flex flex-col items-center">
                        <div className={`h-4 w-48 rounded mb-4 ${darkMode ? "bg-white/10" : "bg-slate-200"}`}></div>
                        <div className={`h-3 w-64 rounded ${darkMode ? "bg-white/5" : "bg-slate-100"}`}></div>
                      </div>
                      <p className={`mt-4 ${darkMode ? "text-white/40" : "text-slate-400"}`}>AI qonunlar bazasini tahlil qilmoqda...</p>
                    </div>
                  )}

                  {!legalLoading && legalSearched && legalResults.length === 0 && (
                    <div className="text-center py-12">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${darkMode ? "bg-white/5" : "bg-slate-100"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-8 h-8 ${darkMode ? "text-white/20" : "text-slate-300"}`}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                      </div>
                      <p className={darkMode ? "text-white/40" : "text-slate-400"}>
                        Hech narsa topilmadi
                      </p>
                    </div>
                  )}

                  {legalResults.map((item, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-2xl transition-all hover:shadow-lg hover:scale-[1.01] ${darkMode ? "bg-white/5 border border-white/5 hover:bg-white/10" : "bg-white border border-slate-100 shadow-sm hover:shadow-md"}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-lg ${darkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
                            {item.title}
                          </h3>
                          <p className={`text-sm leading-relaxed ${darkMode ? "text-white/70" : "text-slate-600"}`}>
                            {item.content}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {item.keywords.map((k, i) => (
                              <span
                                key={i}
                                className={`text-xs px-2 py-1 rounded-md ${darkMode ? "bg-white/5 text-white/40" : "bg-slate-100 text-slate-500"}`}
                              >
                                #{k}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        }



        {/* FOOTER - Faqat 'hero' holatida ko'rsatish (ixtiyoriy) */}
        {
          view === 'hero' && (
            <footer className={`relative border-t py-16 text-center backdrop-blur-lg md:backdrop-blur-2xl ${darkMode ? "border-white/10 bg-white/5" : "border-white/20 bg-white/30"}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent" />
              <p className="text-xl mb-4 relative z-10 font-semibold">© 2025-2030 Termiziy AI</p>
              <p className="text-gray-400 relative z-10">Sun&apos;iy Intellekt</p>
              <div className="flex justify-center gap-6 mt-6">
                {[Brain, Cpu, Network, Bot].map((Icon, i) => (
                  <Icon key={i} className="w-6 h-6 text-gray-600 hover:text-cyan-400 transition-colors cursor-pointer" />
                ))}
              </div>
            </footer>
          )
        }

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-1000 {
            animation-delay: 1s;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          @media (max-width: 768px) {
            .mobile-disable-3d {
              transform: none !important;
            }
          }
        `}</style>

        {/* Info Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setModalOpen(false)}>
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 lg:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative shadow-2xl" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                {modalTitle}
              </h2>

              <div className="space-y-4">
                {modalContent.length === 0 ? (
                  <p className="text-white/40 text-center py-10">Ma'lumot topilmadi.</p>
                ) : (
                  modalType === 'project' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {modalContent.map((item: any, i: number) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                          {item.image && <div className="h-32 bg-slate-800 rounded-xl mb-3 overflow-hidden"><img src={item.image} alt={item.title} className="w-full h-full object-cover" /></div>}
                          <h3 className="font-bold text-white mb-1">{item.title}</h3>
                          <p className="text-sm text-white/60">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : modalType === 'review' ? (
                    <div className="space-y-4">
                      {modalContent.map((item: any, i: number) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white">
                              {item.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-white">{item.name}</p>
                              <p className="text-xs text-white/40">{item.role}</p>
                            </div>
                            <div className="ml-auto flex text-yellow-500 text-xs">
                              {Array(item.rating).fill('⭐').map((s, si) => <span key={si}>{s}</span>)}
                            </div>
                          </div>
                          <p className="text-white/80 text-sm italic">"{item.content}"</p>
                        </div>
                      ))}
                    </div>
                  ) : modalType === 'graduate' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {modalContent.map((item: any, i: number) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4 items-start">
                          <div className="w-16 h-16 rounded-xl bg-slate-800 flex-shrink-0 overflow-hidden">
                            {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🎓</div>}
                          </div>
                          <div>
                            <h3 className="font-bold text-white">{item.name}</h3>
                            <p className="text-xs text-purple-400 font-medium mb-1">{item.company}</p>
                            <p className="text-xs text-white/60 line-clamp-2">{item.story}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : modalType === 'text' ? (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      {modalContent.map((item: any, i: number) => (
                        <p key={i} className="text-lg text-white/80 leading-relaxed text-center">
                          {item.text}
                        </p>
                      ))}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        )
        }

        {/* Universal AI Agent - Bottom Right */}
        <UniversalAgent />
      </main >
    </div >
  )
}