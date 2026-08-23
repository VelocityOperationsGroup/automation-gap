import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import Reveal from '../components/Reveal'
import GapCheck from '../components/GapCheck'
import { BRAND, STATS, STATS_DISCLAIMER, HOW_IT_WORKS, VETTING_NOTE } from '../data/content'
import { CATEGORIES } from '../data/tools'

export default function Landing() {
  return (
    <div>
      <Hero />
      <StatsBar />
      <HowItWorks />
      <GapCheckSection />
      <DirectoryTeaser />
      <FinalCta />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8">
      <div className="ag-grain" />
      <div className="ag-glow ag-float pointer-events-none absolute left-1/2 top-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full" />
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-ag-line bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70"
        >
          <Sparkles size={14} className="text-ag-cyan" /> Free directory, always updated
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-display text-4xl font-bold leading-[1.05] text-white sm:text-6xl"
        >
          Your competitors are
          <br />
          <span className="text-ag-cyan">already</span> using AI.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-lg text-white/60"
        >
          {BRAND.tagline} Find the exact tool for the task you're still doing by hand — no jargon, no
          50-tool listicles, just what actually fits your business.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#gap-check"
            className="ag-pulse flex items-center gap-2 rounded-full bg-ag-cyan px-7 py-3.5 font-semibold text-ag-ink transition hover:bg-ag-cyan-light"
          >
            Take the 2-Minute Gap Check <ArrowRight size={18} />
          </a>
          <Link
            to="/directory"
            className="rounded-full border border-ag-line px-7 py-3.5 font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
          >
            Browse the directory
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function StatsBar() {
  return (
    <section className="border-y border-ag-line bg-ag-charcoal px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
        {STATS.map((s, i) => (
          <Reveal key={s.value} delay={i * 0.08} className="text-center">
            <p className="font-display text-4xl font-bold text-ag-cyan">{s.value}</p>
            <p className="mt-2 text-sm text-white/55">{s.label}</p>
          </Reveal>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-white/30">{STATS_DISCLAIMER}</p>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-ag-cyan">How it works</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            From "I don't even know where to start" to using it today.
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 sm:grid-cols-3">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-ag-line sm:block" />
          {HOW_IT_WORKS.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.1} className="relative">
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-ag-cyan/40 bg-ag-ink font-display text-sm font-bold text-ag-cyan">
                {step.step}
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function GapCheckSection() {
  return (
    <section id="gap-check" className="border-y border-ag-line bg-ag-charcoal px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-ag-cyan">Free tool</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">How big is your gap?</h2>
          <p className="mt-3 text-white/55">Six quick questions. Get matched tools, not a generic list.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <GapCheck />
        </Reveal>
      </div>
    </section>
  )
}

function DirectoryTeaser() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-ag-cyan">The directory</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Every category, browsable</h2>
          <p className="mt-3 flex items-center justify-center gap-2 text-sm text-white/55">
            <ShieldCheck size={16} className="text-ag-mint" /> {VETTING_NOTE}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.06}>
              <Link
                to="/directory"
                className="block h-full rounded-2xl border border-ag-line bg-ag-charcoal p-6 transition hover:border-ag-cyan/40 hover:bg-ag-cyan/5"
              >
                <h3 className="font-display text-lg font-bold text-white">{c.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{c.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ag-cyan">
                  Browse <ArrowRight size={14} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="px-4 pb-28 pt-4 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-4xl rounded-3xl border border-ag-cyan/30 bg-gradient-to-br from-ag-cyan/15 via-ag-charcoal to-ag-charcoal p-10 text-center sm:p-16">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          The gap doesn't close itself.
        </h2>
        <a
          href="#gap-check"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ag-cyan px-8 py-4 font-semibold text-ag-ink transition hover:bg-ag-cyan-light"
        >
          Take the Gap Check <ArrowRight size={18} />
        </a>
      </Reveal>
    </section>
  )
}
