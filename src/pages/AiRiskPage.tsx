import { motion } from 'framer-motion'
import { ArrowRight, ShieldAlert, ExternalLink } from 'lucide-react'
import Reveal from '../components/Reveal'
import { CATEGORIES } from '../data/tools'
import { CATEGORY_RISKS } from '../data/risks'

const BACKSTOP_URL = 'https://vogbackstop.netlify.app'

export default function AiRiskPage() {
  return (
    <div>
      <Hero />
      <RiskByCategory />
      <PolicyGapSection />
      <BackstopCta />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8">
      <div className="ag-grain" />
      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-ag-line bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70"
        >
          <ShieldAlert size={14} className="text-ag-coral" /> The part the tool pages don't mention
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl"
        >
          The tools that save you 12 hours a week can also cost you a lawsuit.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-lg text-white/60"
        >
          Every tool in our directory does something well. None of them come with a lawyer. Here's what
          adopting AI actually means for your liability — and what to do about it.
        </motion.p>
      </div>
    </section>
  )
}

function RiskByCategory() {
  return (
    <section className="border-y border-ag-line bg-ag-charcoal px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-ag-coral">Where it comes from</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            One real exposure per category
          </h2>
          <p className="mt-3 text-white/55">Matched to the exact tools we recommend, not a generic warning.</p>
        </Reveal>

        <div className="mt-12 space-y-4">
          {CATEGORY_RISKS.map((item, i) => {
            const category = CATEGORIES.find((c) => c.id === item.categoryId)
            return (
              <Reveal key={item.categoryId} delay={i * 0.06}>
                <div className="flex gap-4 rounded-2xl border border-ag-line bg-ag-ink p-6">
                  <ShieldAlert size={20} className="mt-0.5 shrink-0 text-ag-coral" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ag-cyan">{category?.label}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/75">{item.risk}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function PolicyGapSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-ag-coral">The part people miss</span>
        <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
          Your general liability policy probably doesn't cover this
        </h2>
        <p className="mt-4 text-white/60">
          A lot of standard GL and cyber policies have started adding explicit AI exclusions — so the
          coverage you already pay for may not extend to a mistake one of these tools makes on your behalf.
          The only way to know for sure is to ask your carrier directly, in writing.
        </p>
      </Reveal>
    </section>
  )
}

function BackstopCta() {
  return (
    <section className="px-4 pb-28 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-4xl rounded-3xl border border-ag-coral/30 bg-gradient-to-br from-ag-coral/15 via-ag-charcoal to-ag-charcoal p-10 text-center sm:p-16">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Backstop covers exactly this gap.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/60">
          A sibling project of ours — AI risk &amp; E&amp;O insurance built specifically for small businesses
          using tools like the ones in this directory. Take their 2-minute risk check to see where you
          actually stand.
        </p>
        <a
          href={BACKSTOP_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ag-coral px-8 py-4 font-semibold text-ag-ink transition hover:brightness-110"
        >
          Check your exposure at Backstop <ArrowRight size={18} />
        </a>
        <p className="mt-4">
          <a
            href={BACKSTOP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/60"
          >
            vogbackstop.netlify.app <ExternalLink size={11} />
          </a>
        </p>
      </Reveal>
    </section>
  )
}
