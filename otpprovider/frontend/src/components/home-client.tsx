'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Icon } from './icons';
import { Reveal } from './reveal';
import type { Currency, Lang, SiteConfig } from '@/lib/site-config';

const TICKER_EVENTS = [
  { channel: 'sms', place: 'Dubai', flag: '🇦🇪', ms: '1.4s' },
  { channel: 'whatsapp', place: 'Jakarta', flag: '🇮🇩', ms: '1.1s' },
  { channel: 'voice', place: 'Riyadh', flag: '🇸🇦', ms: '2.0s' },
  { channel: 'email', place: 'Cairo', flag: '🇪🇬', ms: '0.9s' },
  { channel: 'sms', place: 'Manila', flag: '🇵🇭', ms: '1.6s' },
  { channel: 'whatsapp', place: 'Lagos', flag: '🇳🇬', ms: '1.3s' },
  { channel: 'voice', place: 'Istanbul', flag: '🇹🇷', ms: '1.8s' },
  { channel: 'email', place: 'London', flag: '🇬🇧', ms: '1.0s' },
] as const;

const CHANNEL_ICON: Record<string, string> = { sms: 'sms', whatsapp: 'whatsapp', voice: 'phone', email: 'mail' };

export default function HomeClient({ config }: { config: SiteConfig }) {
  const [lang, setLang] = useState<Lang>('ar');
  const [currency, setCurrency] = useState<Currency>('USD');
  const isAr = lang === 'ar';

  const t = useMemo(
    () => ({
      nav: {
        services: isAr ? 'الخدمات' : 'Services',
        how: isAr ? 'كيف تعمل' : 'How it works',
        packages: isAr ? 'الباقات' : 'Pricing',
        testimonials: isAr ? 'آراء العملاء' : 'Customers',
        contact: isAr ? 'تواصل معنا' : 'Contact',
        login: isAr ? 'دخول العملاء' : 'Client login',
        start: isAr ? 'ابدأ مجاناً' : 'Start free',
      },
      heroEyebrow: isAr ? 'بنية تحتية للتحقّق بخطوة واحدة' : 'One-time verification infrastructure',
      heroTitle: isAr ? 'رمز التحقق يوصل، والعميل بيتأكد… في أقل من ثانيتين' : 'The code lands, the customer confirms — in under two seconds',
      heroSub: isAr
        ? `${config.brandName} يرسل رموز تحقق فورية عبر SMS وواتساب والمكالمة الصوتية والبريد الإلكتروني، بمعدل تسليم أعلى من 99% في أكثر من 180 دولة.`
        : `${config.brandName} delivers instant SMS, WhatsApp, Voice and Email one-time codes with 99%+ delivery across 180+ countries.`,
      ctaPrimary: isAr ? 'اطلب عرض سعر' : 'Get a quote',
      ctaSecondary: isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp',
      loginHint: isAr ? 'دخول بالبريد الإلكتروني أو بحساب جوجل — وكلمة السر محفوظة بأمان' : 'Sign in with email or Google — your password is stored securely',
      tickerTitle: isAr ? 'تسليم مباشر الآن' : 'Live delivery feed',
      tickerLive: isAr ? 'مباشر' : 'LIVE',
      servicesEyebrow: isAr ? 'منتجاتنا' : 'Our products',
      servicesTitle: isAr ? 'كل قناة تحقق، من مزوّد واحد' : 'Every verification channel, one provider',
      servicesSub: isAr
        ? 'وصل رمز التحقق مهما كانت حالة العميل: شبكة ضعيفة، رقم غير نشط، أو تفضيل قناة معينة.'
        : 'Reach the customer whatever their situation: weak signal, dead number, or a preferred channel.',
      howEyebrow: isAr ? 'طريقة العمل' : 'How it works',
      howTitle: isAr ? 'من التكامل إلى أول رمز تحقق في دقائق' : 'From integration to first OTP in minutes',
      howSteps: [
        {
          n: '01',
          title: isAr ? 'اربط API بتاعنا' : 'Connect the API',
          desc: isAr ? 'مفتاح واحد وطلب REST بسيط، مع SDKs جاهزة لأشهر اللغات.' : 'One key, a simple REST call, and ready SDKs for the languages you use.',
        },
        {
          n: '02',
          title: isAr ? 'اختر القناة المناسبة' : 'Pick the right channel',
          desc: isAr ? 'SMS أو واتساب أو مكالمة صوتية أو إيميل — أو خلّي النظام يختار تلقائي حسب توفر القناة.' : 'SMS, WhatsApp, Voice or Email — or let smart routing pick automatically.',
        },
        {
          n: '03',
          title: isAr ? 'تحقق وتابع' : 'Verify & track',
          desc: isAr ? 'تأكيد فوري للعميل، ولوحة تحكم فيها كل عملية تحقق وتقاريرها لحظة بلحظة.' : 'Instant confirmation for the user, plus a dashboard tracking every verification in real time.',
        },
      ],
      packagesEyebrow: isAr ? 'الباقات' : 'Pricing',
      packagesTitle: isAr ? 'باقات تكبر مع مشروعك' : 'Packages that scale with you',
      packagesSub: isAr ? 'الأسعار تقريبية حسب سعر الصرف. لا رسوم إعداد، وتقدر تلغي في أي وقت.' : 'Prices are approximate based on current exchange rates. No setup fee, cancel anytime.',
      perMonth: isAr ? '/ شهرياً' : '/ month',
      custom: isAr ? 'حسب الاحتياج' : 'Custom',
      mostPopular: isAr ? 'الأكثر طلباً' : 'Most popular',
      choosePlan: isAr ? 'اختر هذه الباقة' : 'Choose this plan',
      contactUs: isAr ? 'تواصل معنا' : 'Contact us',
      verifPerMo: isAr ? 'عملية تحقق شهرياً' : 'verifications / month',
      testimonialsEyebrow: isAr ? 'ثقة العملاء' : 'Trusted by teams',
      testimonialsTitle: isAr ? 'فرق منتج حقيقية بتعتمد علينا' : 'Real product teams rely on us',
      contactEyebrow: isAr ? 'تواصل معنا' : 'Get in touch',
      contactTitle: isAr ? 'جاهز تبدأ؟ كلّمنا على واتساب أو الإيميل' : 'Ready to start? Reach us on WhatsApp or email',
      contactSub: config.contact.supportHours[lang],
      emailLabel: isAr ? 'راسلنا على الإيميل' : 'Email us directly',
      footerRights: isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved',
      footerTag: isAr ? 'بنية تحتية موثوقة لرموز التحقق' : 'Reliable OTP delivery infrastructure',
    }),
    [isAr, lang, config],
  );

  function formatPrice(usd: number) {
    const fx = config.fx[currency];
    const converted = Math.round(usd * fx.rate);
    return fx.suffix
      ? `${converted.toLocaleString(isAr ? 'ar-EG' : 'en-US')} ${fx.symbol}`
      : `${fx.symbol}${converted.toLocaleString('en-US')}`;
  }

  function waLink(number: string) {
    const msg = isAr ? `أهلاً، عايز أعرف أكتر عن باقات ${config.brandName}` : `Hi, I would like to know more about ${config.brandName} packages`;
    return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  }

  const primaryWa = config.contact.whatsapp[0];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F7FB] text-ink-900 antialiased">
      {/* ---------------- Nav ---------------- */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#F7F7FB]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-sm font-bold text-white">
              <span className="absolute h-2 w-2 rounded-full bg-mint-500 -end-0.5 -top-0.5 animate-signal-pulse" />
              OP
            </div>
            <span className="text-lg font-bold">{config.brandName}</span>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-medium text-ink-700/80 md:flex">
            <a href="#services" className="transition hover:text-ink-900">{t.nav.services}</a>
            <a href="#how" className="transition hover:text-ink-900">{t.nav.how}</a>
            <a href="#packages" className="transition hover:text-ink-900">{t.nav.packages}</a>
            <a href="#testimonials" className="transition hover:text-ink-900">{t.nav.testimonials}</a>
            <a href="#contact" className="transition hover:text-ink-900">{t.nav.contact}</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-brand-600 hover:text-brand-600"
            >
              {isAr ? 'EN' : 'عربي'}
            </button>
            <Link
              href={config.loginUrl}
              className="hidden rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-ink-900 transition hover:border-ink-900 sm:inline-block"
            >
              {t.nav.login}
            </Link>
            <Link
              href={config.signupUrl}
              className="rounded-full bg-ink-900 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700"
            >
              {t.nav.start}
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-[560px] animate-aurora bg-[radial-gradient(60%_60%_at_50%_0%,rgba(79,70,229,0.14),transparent)]" />
        <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-14 md:grid-cols-2 md:items-center md:pb-28 md:pt-20">
          <div className="animate-rise-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-600/20 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600 animate-signal-pulse" />
              {t.heroEyebrow}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.15] tracking-tight text-ink-900 md:text-5xl">
              {t.heroTitle}
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-7 text-ink-700/75">{t.heroSub}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#contact" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700">
                {t.ctaPrimary}
              </a>
              {primaryWa && (
                <a
                  href={waLink(primaryWa.number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-ink-900 transition hover:border-whatsapp hover:text-whatsapp"
                >
                  <Icon name="whatsapp" className="h-4 w-4" />
                  {t.ctaSecondary}
                </a>
              )}
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-700/50">
              <Icon name="lock" className="h-3.5 w-3.5" />
              {t.loginHint}
            </p>

            <dl className="mt-10 grid grid-cols-4 gap-4 border-t border-black/5 pt-8">
              {config.stats.map((s) => (
                <div key={s.id}>
                  <dt className="text-xl font-extrabold text-ink-900 md:text-2xl">{s.value}</dt>
                  <dd className="mt-1 text-[11px] leading-tight text-ink-700/60 md:text-xs">{s.label[lang]}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Signature element: live multi-channel delivery ticker */}
          <div className="relative mx-auto w-full max-w-sm animate-panel-in animate-float-slow">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-900 bg-grid bg-grid p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white/60">{t.tickerTitle}</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-500/10 px-2 py-1 text-[10px] font-bold tracking-wide text-mint-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint-500 animate-signal-pulse" />
                  {t.tickerLive}
                </span>
              </div>

              <div className="relative mt-4 h-[360px] overflow-hidden ticker-mask">
                <div className="animate-ticker space-y-2.5">
                  {[...TICKER_EVENTS, ...TICKER_EVENTS].map((ev, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.04] px-3.5 py-3"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-mint-400">
                        <Icon name={CHANNEL_ICON[ev.channel]} className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-white/90">
                          {ev.flag} {ev.place}
                        </p>
                        <p className="text-[11px] text-white/40">
                          {isAr ? 'تم التسليم خلال' : 'delivered in'} {ev.ms}
                        </p>
                      </div>
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-500/15 text-mint-400">
                        <Icon name="check" className="h-3 w-3" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/5 pt-4">
                {(['sms', 'whatsapp', 'voice', 'email'] as const).map((c) => (
                  <div key={c} className="flex flex-col items-center gap-1.5 text-white/40">
                    <Icon name={CHANNEL_ICON[c]} className="h-4 w-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Services / products ---------------- */}
      <section id="services" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{t.servicesEyebrow}</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{t.servicesTitle}</h2>
          <p className="mt-3 text-[15px] leading-7 text-ink-700/70">{t.servicesSub}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.channels.map((s, i) => (
            <Reveal key={s.id} delay={i * 60}>
              <div className="group h-full rounded-2xl border border-black/5 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-600/20 hover:shadow-xl hover:shadow-brand-600/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon name={s.icon} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-ink-900">{s.title[lang]}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-700/65">{s.desc[lang]}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section id="how" className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{t.howEyebrow}</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{t.howTitle}</h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {t.howSteps.map((step, i) => (
              <Reveal key={step.n} delay={i * 100} className="relative rounded-2xl border border-black/5 bg-[#F7F7FB] p-7">
                <span className="font-mono text-3xl font-bold text-brand-600/20">{step.n}</span>
                <h3 className="mt-3 text-base font-bold text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-700/65">{step.desc}</p>
                {i < 2 && (
                  <span className="absolute end-[-14px] top-1/2 hidden -translate-y-1/2 text-ink-700/20 md:block rtl:rotate-180">
                    <Icon name="chevron" className="h-5 w-5" />
                  </span>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Packages ---------------- */}
      <section id="packages" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <Reveal className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{t.packagesEyebrow}</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{t.packagesTitle}</h2>
              <p className="mt-3 text-[15px] leading-7 text-ink-700/70">{t.packagesSub}</p>
            </Reveal>

            <div className="flex shrink-0 gap-1.5 rounded-full border border-black/10 bg-white p-1">
              {(Object.keys(config.fx) as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    currency === c ? 'bg-ink-900 text-white' : 'text-ink-700/60 hover:text-ink-900'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {config.packages.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl border p-7 ${
                    p.popular
                      ? 'border-brand-600 bg-ink-900 text-white shadow-2xl shadow-brand-600/20 lg:-translate-y-3'
                      : 'border-black/5 bg-white text-ink-900'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-mint-500 px-3.5 py-1 text-[11px] font-bold text-white">
                      {t.mostPopular}
                    </span>
                  )}

                  <h3 className={`text-sm font-bold uppercase tracking-wide ${p.popular ? 'text-white/70' : 'text-ink-700/60'}`}>
                    {p.name[lang]}
                  </h3>

                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold tracking-tight">{p.price !== null ? formatPrice(p.price) : t.custom}</span>
                    {p.price !== null && <span className={`text-sm ${p.popular ? 'text-white/60' : 'text-ink-700/50'}`}>{t.perMonth}</span>}
                  </div>

                  {p.verifications !== null && (
                    <p className={`mt-1 text-xs ${p.popular ? 'text-white/50' : 'text-ink-700/45'}`}>
                      {isAr
                        ? `حتى ${p.verifications.toLocaleString('ar-EG')} ${t.verifPerMo}`
                        : `up to ${p.verifications.toLocaleString('en-US')} ${t.verifPerMo}`}
                    </p>
                  )}

                  <p className={`mt-4 text-sm font-semibold ${p.popular ? 'text-white/80' : 'text-ink-700/70'}`}>{p.channels[lang]}</p>

                  <ul className="mt-5 flex-1 space-y-3">
                    {p.features[lang].map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                            p.popular ? 'bg-mint-500 text-white' : 'bg-mint-500/10 text-mint-600'
                          }`}
                        >
                          <Icon name="check" className="h-2.5 w-2.5" />
                        </span>
                        <span className={p.popular ? 'text-white/85' : 'text-ink-700/75'}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {primaryWa && (
                    <a
                      href={waLink(primaryWa.number)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-7 rounded-xl px-5 py-3 text-center text-sm font-semibold transition ${
                        p.popular ? 'bg-white text-ink-900 hover:bg-white/90' : 'bg-ink-900 text-white hover:bg-brand-700'
                      }`}
                    >
                      {p.price !== null ? t.choosePlan : t.contactUs}
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Testimonials (marquee) ---------------- */}
      <section id="testimonials" className="overflow-hidden bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{t.testimonialsEyebrow}</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{t.testimonialsTitle}</h2>
          </Reveal>
        </div>

        <div className="mt-12 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee flex w-max gap-5 px-5">
            {[...config.testimonials, ...config.testimonials].map((tm, i) => (
              <figure key={`${tm.id}-${i}`} className="flex w-[320px] shrink-0 flex-col rounded-2xl border border-black/5 bg-[#F7F7FB] p-6">
                <blockquote className="flex-1 text-[15px] leading-7 text-ink-700/80">
                  {isAr ? '\u201C' : '\u201C'}{tm.quote[lang]}{isAr ? '\u201D' : '\u201D'}
                </blockquote>
                <figcaption className="mt-5 border-t border-black/5 pt-4">
                  <p className="text-sm font-bold text-ink-900">{tm.name}</p>
                  <p className="text-xs text-ink-700/50">{tm.role[lang]}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Contact ---------------- */}
      <section id="contact" className="bg-ink-900 py-20 text-white md:py-28">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-mint-400">{t.contactEyebrow}</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{t.contactTitle}</h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-7 text-white/60">{t.contactSub}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {config.contact.whatsapp.map((w) => (
              <a
                key={w.id}
                href={waLink(w.number)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-start transition hover:border-whatsapp hover:bg-whatsapp/10"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-whatsapp text-white">
                    <Icon name="whatsapp" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold">
                      {w.flag} {w.label[lang]}
                    </p>
                    <p dir="ltr" className="text-xs text-white/50">
                      +{w.number}
                    </p>
                  </div>
                </div>
                <span className="text-white/30 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180">
                  <Icon name="chevron" className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>

          <a
            href={`mailto:${config.contact.email}`}
            className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-start transition hover:border-brand-500 hover:bg-brand-500/10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white">
                <Icon name="mail" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold">{t.emailLabel}</p>
                <p dir="ltr" className="text-xs text-white/50">
                  {config.contact.email}
                </p>
              </div>
            </div>
            <span className="text-white/30 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180">
              <Icon name="chevron" className="h-4 w-4" />
            </span>
          </a>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-black/5 bg-[#F7F7FB]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-xs text-ink-700/50 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600 text-[10px] font-bold text-white">OP</div>
            <span>{config.brandName} — {t.footerTag}</span>
          </div>
          <p>
            © {new Date().getFullYear()} {config.brandName}. {t.footerRights}.
          </p>
        </div>
      </footer>

      {/* ---------------- Floating WhatsApp buttons ---------------- */}
      <div className="fixed bottom-5 z-50 flex flex-col gap-3 end-5">
        {config.contact.whatsapp.map((w) => (
          <a
            key={w.id}
            href={waLink(w.number)}
            target="_blank"
            rel="noopener noreferrer"
            title={w.label[lang]}
            className="animate-wa-pulse flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:brightness-95"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
            <span className="hidden sm:inline">
              {w.flag} {w.label[lang]}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
