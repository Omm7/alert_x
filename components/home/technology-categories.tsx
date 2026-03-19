"use client";

import { Code2, Cpu, Sparkles } from "lucide-react";

const orbitDots = [
  { id: 1, size: "h-2.5 w-2.5", delay: "0s", duration: "7s" },
  { id: 2, size: "h-3 w-3", delay: "-1.1s", duration: "8.5s" },
  { id: 3, size: "h-2 w-2", delay: "-2.2s", duration: "6.8s" },
  { id: 4, size: "h-3.5 w-3.5", delay: "-0.8s", duration: "9.1s" },
  { id: 5, size: "h-2.5 w-2.5", delay: "-3.2s", duration: "7.8s" },
  { id: 6, size: "h-2 w-2", delay: "-4.1s", duration: "8.8s" },
];

export function TechnologyCategories() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.22),transparent_42%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.2),transparent_40%),linear-gradient(180deg,rgba(15,23,42,0.88)_0%,rgba(2,6,23,0.95)_100%)] p-5 sm:p-6">
      <div className="pointer-events-none absolute -left-6 top-8 h-20 w-20 rounded-full bg-cyan-300/25 blur-2xl" />
      <div className="pointer-events-none absolute -right-10 bottom-2 h-28 w-28 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
          <Sparkles className="h-3.5 w-3.5" />
          Live Tech Pulse
        </div>

        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-100 leading-tight">
          Building Futures in Tech
        </h2>

        <p className="text-xs sm:text-sm text-slate-300/90 max-w-md">
          Opportunities are moving fast. Stay consistent, keep learning, and ship projects that stand out.
        </p>

        <div className="relative mt-3 h-40 sm:h-48">
          <div className="absolute left-1/2 top-1/2 flex h-20 w-20 sm:h-24 sm:w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/35 bg-slate-900/70 shadow-[0_0_30px_-12px_rgba(34,211,238,0.8)] backdrop-blur-md pulse-core">
            <Cpu className="h-8 w-8 text-cyan-300" />
          </div>

          <div className="absolute left-1/2 top-1/2 h-24 w-24 sm:h-28 sm:w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20" />
          <div className="absolute left-1/2 top-1/2 h-32 w-32 sm:h-36 sm:w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/15" />

          {orbitDots.map((dot, idx) => (
            <div
              key={dot.id}
              className="absolute left-1/2 top-1/2"
              style={{
                animationName: idx % 2 === 0 ? "orbitClockwise" : "orbitCounterClockwise",
                animationDuration: dot.duration,
                animationDelay: dot.delay,
                animationIterationCount: "infinite",
                animationTimingFunction: "linear",
              }}
            >
              <div className={`rounded-full ${dot.size} bg-gradient-to-br from-cyan-300 to-blue-400 shadow-[0_0_16px_rgba(34,211,238,0.8)]`} />
            </div>
          ))}

          <div className="absolute left-4 top-4 sm:left-8 sm:top-6 inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/30 bg-slate-900/70 px-2.5 py-1.5 text-[11px] text-cyan-100 float-chip-a">
            <Code2 className="h-3.5 w-3.5" />
            Learn
          </div>

          <div className="absolute bottom-4 right-4 sm:bottom-7 sm:right-8 rounded-lg border border-blue-300/30 bg-slate-900/70 px-2.5 py-1.5 text-[11px] text-blue-100 float-chip-b">
            Build
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes orbitClockwise {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateX(58px) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateX(58px) rotate(-360deg);
          }
        }

        @keyframes orbitCounterClockwise {
          from {
            transform: translate(-50%, -50%) rotate(360deg) translateX(72px) rotate(-360deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(0deg) translateX(72px) rotate(0deg);
          }
        }

        @keyframes pulseCore {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
          }
        }

        @keyframes floatA {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes floatB {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(5px);
          }
        }

        .pulse-core {
          animation: pulseCore 3.2s ease-in-out infinite;
        }

        .float-chip-a {
          animation: floatA 3.4s ease-in-out infinite;
        }

        .float-chip-b {
          animation: floatB 3.6s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          @keyframes orbitClockwise {
            from {
              transform: translate(-50%, -50%) rotate(0deg) translateX(46px) rotate(0deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(360deg) translateX(46px) rotate(-360deg);
            }
          }

          @keyframes orbitCounterClockwise {
            from {
              transform: translate(-50%, -50%) rotate(360deg) translateX(58px) rotate(-360deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(0deg) translateX(58px) rotate(0deg);
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pulse-core,
          .float-chip-a,
          .float-chip-b {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
