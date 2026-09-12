import Logo from "../../assets/Koaldavpic.png";
import {
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Flame,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,_#ede9fe_0%,_#f8f7ff_40%,_#eef2ff_100%)] dark:bg-[radial-gradient(ellipse_at_top,_#1e1b4b_0%,_#0b0f19_50%,_#020617_100%)] p-4 sm:p-6 lg:p-8 transition-colors duration-300"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="animate-auth-card mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_25px_70px_rgba(108,99,255,0.14)] dark:border-slate-800/90 dark:bg-[#0F172A] dark:shadow-[0_25px_70px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] transition-all duration-300">
        {/* ── Left column: Hero Showcase ── */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#4F46E5] via-[#6366F1] to-[#38BDF8] p-8 text-white lg:flex lg:flex-col lg:justify-between">
          {/* Ambient Breathing Glow Orbs */}
          <div className="pointer-events-none absolute -left-12 -top-12 h-52 w-52 rounded-full bg-white/15 blur-3xl animate-pulse-glow" />
          <div className="pointer-events-none absolute right-0 top-1/4 h-48 w-48 rounded-full bg-[#38BDF8]/30 blur-3xl animate-pulse-glow-delayed" />
          <div className="pointer-events-none absolute bottom-0 left-8 h-48 w-48 rounded-full bg-purple-400/25 blur-3xl animate-pulse-glow" />

          {/* Top: Brand Header & Headline */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 group cursor-default">
              <img
                src={Logo}
                alt="Logo"
                className="h-11 w-11 rounded-2xl object-cover shadow-md ring-2 ring-white/25 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
              />
              <div>
                <h2 className="text-xl font-black leading-tight tracking-tight text-white transition-colors">
                  KAOL DAV
                </h2>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80">
                  Peak Performance &amp; Goals
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white/25 hover:scale-[1.02]">
                <Sparkles size={12} className="text-yellow-300 animate-pulse" />
                <span>Your Life, Organized</span>
              </div>
              <h3 className="text-2xl xl:text-3xl font-extrabold leading-snug text-white">
                Build momentum with goals, money &amp; daily habits.
              </h3>
              <p className="text-xs text-white/85 max-w-sm leading-relaxed">
                Stay consistent with smart trackers, clear milestone visuals,
                and automated analytics.
              </p>
            </div>
          </div>

          {/* Middle: Compact preview card with gentle floating animation */}
          <div className="relative z-10 my-3">
            <div className="animate-float-slow rounded-2xl border border-white/25 bg-white/15 p-4 shadow-2xl backdrop-blur-xl space-y-3 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
              {/* Window Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90 shadow-sm" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90 shadow-sm" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90 shadow-sm" />
                  <span className="ml-1 text-[11px] font-semibold text-white/90">
                    Live Progress
                  </span>
                </div>
                <span className="rounded-full border border-white/20 bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-white/30">
                  Today
                </span>
              </div>

              {/* 3 Metric Stat Cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-white/15 bg-white/10 p-2.5 transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-lg cursor-default">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-200">
                    <CheckCircle2
                      size={12}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                    <span>Goal</span>
                  </div>
                  <p className="mt-1 text-base font-extrabold text-white tracking-tight">
                    8/10
                  </p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/10 p-2.5 transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-lg cursor-default">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-200">
                    <TrendingUp
                      size={12}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                    <span>Finance</span>
                  </div>
                  <p className="mt-1 text-base font-extrabold text-white tracking-tight">
                    $2.4k
                  </p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/10 p-2.5 transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-lg cursor-default">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-200">
                    <Flame
                      size={12}
                      className="text-amber-300 transition-transform duration-300 group-hover:scale-110"
                    />
                    <span>Streak</span>
                  </div>
                  <p className="mt-1 text-base font-extrabold text-white tracking-tight">
                    6 days
                  </p>
                </div>
              </div>

              {/* Completion Bar */}
              <div className="rounded-xl border border-white/15 bg-black/10 p-2.5">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-white/90">
                    Overall Goal Progress
                  </span>
                  <span className="font-bold text-emerald-300">84%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 animate-shimmer transition-all duration-700 ease-out"
                    style={{ width: "84%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Feature Trust Badges */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-3 text-[11px] font-medium text-white/90">
            <div className="flex items-center gap-1 transition-transform duration-200 hover:scale-105 cursor-default">
              <Zap size={13} className="text-yellow-300" />
              <span>Fast &amp; Intuitive</span>
            </div>
            <div className="flex items-center gap-1 transition-transform duration-200 hover:scale-105 cursor-default">
              <ShieldCheck size={13} className="text-emerald-300" />
              <span>Safe &amp; Private</span>
            </div>
            <div className="flex items-center gap-1 transition-transform duration-200 hover:scale-105 cursor-default">
              <Sparkles size={13} className="text-cyan-300" />
              <span>Goal Analytics</span>
            </div>
          </div>
        </div>

        {/* ── Right column: Form View ── */}
        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10 bg-white dark:bg-[#0F172A] transition-colors duration-300">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
