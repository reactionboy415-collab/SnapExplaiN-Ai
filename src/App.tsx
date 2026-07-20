import { useState, useEffect } from "react";
import {
  Sparkles,
  Shield,
  Zap,
  Lock,
  ChevronDown,
  Github,
  HelpCircle,
  FileText,
  Clock,
  LayoutGrid,
  Heart,
  MousePointerClick,
  UploadCloud
} from "lucide-react";
import { ThemeToggle } from "./components/ThemeToggle";
import { InteractiveShowcase } from "./components/InteractiveShowcase";
import { AnalysisHistory } from "./components/AnalysisHistory";
import { AnalyzerView } from "./components/AnalyzerView";
import { AnalysisItem } from "./types";
import { FAQ_ITEMS } from "./constants";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("snapexplain_theme");
    if (saved) return saved === "dark";
    // Default to dark mode for that premium Linear.app feel
    return true;
  });

  // History state
  const [historyItems, setHistoryItems] = useState<AnalysisItem[]>(() => {
    const saved = localStorage.getItem("snapexplain_history");
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation / Focus selection states
  const [selectedHistoricalItem, setSelectedHistoricalItem] = useState<AnalysisItem | null>(null);
  const [prepopulatedImage, setPrepopulatedImage] = useState<string | null>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // App Launch State (smoothly scroll down to workspace or keep overlay)
  const [appLaunched, setAppLaunched] = useState<boolean>(false);

  // Sync theme with HTML tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("snapexplain_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("snapexplain_theme", "light");
    }
  }, [isDarkMode]);

  // Sync history with LocalStorage
  const handleAnalysisSuccess = (newItem: AnalysisItem) => {
    const updated = [newItem, ...historyItems];
    setHistoryItems(updated);
    localStorage.setItem("snapexplain_history", JSON.stringify(updated));
    setSelectedHistoricalItem(newItem);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = historyItems.filter(item => item.id !== id);
    setHistoryItems(updated);
    localStorage.setItem("snapexplain_history", JSON.stringify(updated));
    if (selectedHistoricalItem?.id === id) {
      setSelectedHistoricalItem(null);
    }
  };

  const handleClearAllHistory = () => {
    setHistoryItems([]);
    localStorage.removeItem("snapexplain_history");
    setSelectedHistoricalItem(null);
  };

  const handleSelectExampleImage = (imageSrc: string) => {
    setPrepopulatedImage(imageSrc);
    // Smooth scroll to the app workspace container
    const el = document.getElementById("app-workspace");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setAppLaunched(true);
  };

  return (
    <div className="min-h-screen font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 relative overflow-hidden selection:bg-blue-500/20">
      {/* Background ambient lighting glows */}
      <div className="glow-spot top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="glow-spot top-[1000px] right-1/4 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* FIXED NAV HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/60 dark:border-zinc-900/60 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/15">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 dark:from-white dark:via-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
                SnapExplaiN AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono font-bold uppercase tracking-wider text-blue-500 px-1.5 py-0.5 rounded-md bg-blue-500/5 border border-blue-500/10">
                v1.0 Beta
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            <a href="#problem-section" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Problem
            </a>
            <a href="#interactive-showcase" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Examples
            </a>
            <a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              How It Works
            </a>
            <a href="#faq-section" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              FAQ
            </a>
            <a href="#pricing-section" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Pricing
            </a>
          </nav>

          {/* Right Header Panel Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
            
            <a
              href="#app-workspace"
              onClick={() => setAppLaunched(true)}
              className="px-4.5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              Launch Core App
            </a>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32 overflow-hidden" id="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Animated Hackathon Submission Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/5 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>International Hackathon Submissions Showcase</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight max-w-5xl mx-auto"
          >
            Point. Snap.{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-500 dark:from-blue-400 dark:via-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent">
              Understand.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg lg:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            SnapExplaiN AI is an advanced AI visual explainer. Upload any photo—from prescriptions and complex charts to warning lights and document small print—and receive instant, tailored explanations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
          >
            <a
              href="#app-workspace"
              onClick={() => setAppLaunched(true)}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-500/15 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Get Started Free</span>
              <Zap className="w-4 h-4 text-yellow-300 transition-transform group-hover:scale-110" />
            </a>

            <a
              href="#interactive-showcase"
              className="w-full sm:w-auto px-8 py-4 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-2xl font-bold text-base transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Explore Use Cases</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </a>
          </motion.div>

        </div>
      </section>

      {/* CORE WORKSPACE APP CONTAINER */}
      <section className="py-12 sm:py-16 border-t border-b border-zinc-200/50 dark:border-zinc-900/50 bg-zinc-50/50 dark:bg-zinc-950/20 relative" id="app-workspace">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Local History and Telemetry Stats */}
            <div className="xl:col-span-3 flex flex-col gap-6">
              <div className="p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-900 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md shadow-sm h-full flex flex-col justify-between">
                <AnalysisHistory
                  items={historyItems}
                  onSelectItem={(item) => {
                    setSelectedHistoricalItem(item);
                    setAppLaunched(true);
                  }}
                  onDeleteItem={handleDeleteHistoryItem}
                  onClearAll={handleClearAllHistory}
                />

                <div className="mt-8 pt-6 border-t border-zinc-200/50 dark:border-zinc-900/50">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 dark:text-zinc-500 mb-2">
                    <Lock className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-bold uppercase">Privacy Standard</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    All scanned images are proxy-routed securely server-side. No images are permanently recorded. History is stored purely in client cache.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Ingest & Result panel workspace */}
            <div className="xl:col-span-9">
              <div className="p-1 rounded-3xl bg-gradient-to-b from-zinc-200/50 to-zinc-200/20 dark:from-zinc-800/40 dark:to-zinc-900/10">
                <div className="p-6 md:p-8 rounded-3xl bg-white/90 dark:bg-zinc-950/90 shadow-xl border border-zinc-100/30 dark:border-zinc-900/10 min-h-[420px] flex flex-col justify-center">
                  <AnalyzerView
                    onAnalysisSuccess={handleAnalysisSuccess}
                    selectedHistoricalItem={selectedHistoricalItem}
                    onClearSelectedHistoricalItem={() => setSelectedHistoricalItem(null)}
                    prepopulatedImage={prepopulatedImage}
                    onClearPrepopulatedImage={() => setPrepopulatedImage(null)}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PROBLEM STATEMENT */}
      <section className="py-20 sm:py-28 relative" id="problem-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-500 mb-2 block">
            The Friction Point
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight leading-tight">
            Obscure Symbols, Hidden Jargon, Endless Confusion.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Whether it is decoding vehicle instrument cluster lights, interpreting complex chemical structures on packaging labels, understanding government policy documents, or reading handwriting, standard search engines fail. They demand keyword queries when you only have visual confusion.
          </p>

          {/* Problem comparison grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14 text-left">
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 font-bold">
                ✕
              </div>
              <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">Conventional Search Clumsiness</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Requires taking a photo, navigating through complex crop rails, selecting narrow category tags, and browsing forum links filled with conflicting answers and ads.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 font-bold">
                ✓
              </div>
              <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">The SnapExplaiN Direct Experience</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Zero tags. Zero categories. Simply snap any document, circuit, label, or diagram. Our secure backend SSL proxy-routes the image to our advanced visual engine to output structured, context-rich guides instantly.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* DEMO INTERACTIVE SHOWCASE CONTAINER */}
      <section className="py-16 sm:py-24 bg-zinc-50 dark:bg-zinc-900/20 border-t border-b border-zinc-200/50 dark:border-zinc-900/50" id="interactive-showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-500 mb-2 block">
              Live Playground
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
              Interactive Example Sandboxes
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 leading-relaxed">
              Don't have an image on hand? Click through our preconfigured sandboxes to see how SnapExplaiN AI interprets and dissects various common real-world visual items.
            </p>
          </div>

          <InteractiveShowcase onSelectExample={handleSelectExampleImage} />

        </div>
      </section>

      {/* DETAILED FEATURE GRID */}
      <section className="py-20 sm:py-28" id="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-500 mb-2 block">
              Advanced Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
              Engineered for Seamless Utility
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 leading-relaxed">
              Crafted with a premium Apple/Linear.app visual language, built for speed, offline local persistence, and production-grade security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/55 dark:border-zinc-900 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-zinc-950 dark:text-zinc-50 mb-2">Drag & Drop Upload</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Seamless desktop ingestion. Simply grab any file from your explorer or screenshot tray and slide it anywhere over the active window.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/55 dark:border-zinc-900 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-zinc-950 dark:text-zinc-50 mb-2">Pasted Ingestion</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Fast clipboard integration. Use standard global paste actions <code className="bg-zinc-100 dark:bg-zinc-900 px-1 py-0.5 rounded-md font-mono text-xs">Ctrl+V</code> directly in the browser to ingest screenshot captures instantly.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/55 dark:border-zinc-900 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-zinc-950 dark:text-zinc-50 mb-2">Private Local History</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Sandbox-safe. We do not store your data on external databases. All analysis records and thumbnails remain entirely in your private browser cache.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/55 dark:border-zinc-900 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-zinc-950 dark:text-zinc-50 mb-2">Secure Proxy SSL</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Masked outbound telemetry. The client browser communicates purely with our secure rate-limited Express handler to keep headers hidden.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/55 dark:border-zinc-900 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-zinc-950 dark:text-zinc-50 mb-2">Keyboard Ingestion</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  High accessibility standard. Fully compliant with WCAG keyboard controls. Complete form actions, camera closers, and selections via standard tabs.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/55 dark:border-zinc-900 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-zinc-950 dark:text-zinc-50 mb-2">One-Click Portability</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Export summaries. Quickly download formatted markdown txt reports, copy plain texts to clipboard, or simulate direct share keys instantly.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-28 border-t border-zinc-200/50 dark:border-zinc-900/50 bg-zinc-50/50 dark:bg-zinc-950/20" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-500 mb-2 block">
              Workflow Overview
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
              Three Simple Actions
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 leading-relaxed">
              No categories to select, no complex prompt styling. The automatic engine parses the layouts natively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="flex flex-col gap-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-extrabold text-lg">
                1
              </div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Upload or Snap</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Take a direct smartphone snapshot, upload a photo, drop any image file, or paste directly from clipboard.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-extrabold text-lg">
                2
              </div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">AI Deciphers</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                The secure back-end routes request to the visual core, analyzing layouts, colors, and textures instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-extrabold text-lg">
                3
              </div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Get instant details</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Review a clean markdown report, print, copy key highlights, download to local logs, or generate direct share links.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 sm:py-28" id="faq-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-500 mb-2 block">
              Common Questions
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm overflow-hidden transition-all duration-300"
                  id={`faq-${index}`}
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 font-bold text-zinc-900 dark:text-zinc-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-500" : "text-zinc-400"}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-900/60 mt-2">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* PRICING (COMING SOON) */}
      <section className="py-20 sm:py-28 border-t border-zinc-200/50 dark:border-zinc-900/50 bg-zinc-50/50 dark:bg-zinc-950/20" id="pricing-section">
        <div className="max-w-md mx-auto px-4 text-center">
          
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-500 mb-2 block">
            Flexible Plans
          </span>
          <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
            Pricing Models
          </h2>

          <div className="mt-10 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 relative shadow-md">
            
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-blue-500 text-[10px] font-bold text-white uppercase tracking-wider">
              Coming Soon
            </div>

            <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">SnapExplaiN Premium</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Unlock limitless industrial batch processing</p>

            <div className="my-6">
              <span className="text-4xl font-black text-zinc-900 dark:text-zinc-50">$19</span>
              <span className="text-zinc-500 dark:text-zinc-400 text-sm"> / month</span>
            </div>

            <ul className="text-sm text-zinc-600 dark:text-zinc-400 text-left space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-blue-500 font-bold">✓</span>
                <span>Unlimited uploads (no rate limits)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500 font-bold">✓</span>
                <span>Advanced multi-page PDF document exports</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500 font-bold">✓</span>
                <span>Sync history securely across devices</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500 font-bold">✓</span>
                <span>API developers keys integration</span>
              </li>
            </ul>

            <button
              disabled
              className="w-full py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 font-bold text-sm cursor-not-allowed"
            >
              Subscription Unavailable
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-zinc-500 dark:text-zinc-400 text-sm">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-zinc-50">SnapExplaiN AI</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a href="#hero-section" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Platform
            </a>
            <span>•</span>
            <a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              How It Works
            </a>
            <span>•</span>
            <a href="#faq-section" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Support
            </a>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse fill-rose-500" />
            <span>Open Source hackathon submission 2026</span>
          </div>

        </div>
      </footer>
    </div>
  );
}
