'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Lang = 'ar' | 'en';
type Currency = 'USD' | 'AED' | 'SAR' | 'EGP';

const WHATSAPP = {
  uae: { number: '971564201773', label: { ar: 'الإمارات', en: 'UAE' }, flag: '🇦🇪' },
  id: { number: '6281517676784', label: { ar: 'إندونيسيا', en: 'Indonesia' }, flag: '🇮🇩' },
};

const FX: Record<Currency, { rate: number; symbol: string; suffix?: boolean }> = {
  USD: { rate: 1, symbol: '$' },
  AED: { rate: 3.67, symbol: 'د.إ', suffix: true },
  SAR: { rate: 3.75, symbol: 'ر.س', suffix: true },
  EGP: { rate: 48, symbol: 'ج.م', suffix: true },
};

const PACKAGES = [
  {
    id: 'starter',
    price: 29,
    verifications: 2000,
    popular: false,
    channels: { ar: 'SMS فقط', en: 'SMS only' },
    features: {
      ar: ['حتى 2,000 عملية تحقق شهرياً', 'قناة SMS', 'دعم عبر البريد الإلكتروني', 'وثائق API + SDKs جاهزة', 'أوقات تسليم أقل من 3 ثوانٍ'],
      en: ['Up to 2,000 verifications / mo', 'SMS channel', 'Email support', 'REST API + ready SDKs', 'Sub-3s delivery'],
    },
  },
  {
    id: 'business',
    price: 99,
    verifications: 10000,
    popular: true,
    channels: { ar: 'SMS + واتساب + مكالمة صوتية', en: 'SMS + WhatsApp + Voice' },
    features: {
      ar: ['حتى 10,000 عملية تحقق شهرياً', 'SMS + واتساب + مكالمة صوتية', 'دعم فني ذو أولوية 24/7', 'اسم مرسل مخصص (Sender ID)', 'Webhooks وتقارير تحليلية', 'حماية من البوتات والاحتيال'],
      en: ['Up to 10,000 verifications / mo', 'SMS + WhatsApp + Voice OTP', 'Priority 24/7 support', 'Custom Sender ID', 'Webhooks & analytics dashboard', 'Bot & fraud protection'],
    },
  },
  {
    id: 'enterprise',
    price: null,
    verifications: null,
    popular: false,
    channels: { ar: 'كل القنوات + تكامل خاص', en: 'All channels + custom routes' },
    features: {
      ar: ['عمليات تحقق غير محدودة', 'مدير حساب مخصص', 'اتفاقية مستوى خدمة SLA %99.99', 'تكامل مخصص وربط مباشر بالموردين', 'إمكانية الاستضافة الخاصة (VPC/On-prem)'],
      en: ['Unlimited verifications', 'Dedicated account manager', '99.99% uptime SLA', 'Custom routing & carrier integration', 'Private VPC / on-prem option'],
    },
  },
] as const;

const SERVICES = [
  {
    icon: 'sms',
    title: { ar: 'رموز تحقق SMS', en: 'SMS OTP' },
    desc: {
      ar: 'إرسال رموز تحقق فورية عبر أكثر من 800 شبكة اتصالات حول العالم بمعدل تسليم يتجاوز 99%.',
      en: 'Instant verification codes across 800+ mobile networks worldwide with 99%+ delivery rates.',
    },
  },
  {
    icon: 'whatsapp',
    title: { ar: 'رموز تحقق واتساب', en: 'WhatsApp OTP' },
    desc: {
      ar: 'تكلفة أقل ومعدل فتح أعلى — أرسل الرمز داخل محادثة واتساب رسمية موثقة من ميتا.',
      en: 'Lower cost, higher open-rates — deliver codes inside a Meta-verified WhatsApp Business chat.',
    },
  },
  {
    icon: 'phone',
    title: { ar: 'رموز تحقق صوتية', en: 'Voice OTP' },
    desc: {
      ar: 'مكالمة آلية تنطق الرمز بصوت واضح، مثالية عند تعطل الشبكة أو لضعاف البصر.',
      en: 'Automated voice calls that read the code aloud — ideal for network fallback or accessibility.',
    },
  },
  {
    icon: 'mail',
    title: { ar: 'رموز تحقق بريد إلكتروني', en: 'Email OTP' },
    desc: {
      ar: 'قوالب بريد إلكتروني جاهزة وقابلة للتخصيص لإرسال رموز التحقق بهوية بصرية متطابقة مع علامتك.',
      en: 'Branded, customizable email templates for delivering verification codes.',
    },
  },
  {
    icon: 'lookup',
    title: { ar: 'فحص وتنقية الأرقام', en: 'Number Lookup' },
    desc: {
      ar: 'تحقق من صلاحية الرقم ونوع الشبكة قبل الإرسال — قلل التكلفة الضائعة على أرقام غير نشطة.',
      en: 'Validate carrier & line type before you send — cut spend wasted on dead numbers.',
    },
  },
  {
    icon: 'shield',
    title: { ar: 'الحماية من الاحتيال والبوتات', en: 'Fraud & Bot Protection' },
    desc: {
      ar: 'تقييم مخاطر لحظي، حدود إرسال ذكية، وحظر تلقائي للأنماط المشبوهة قبل أن تُكلّفك أموالاً.',
      en: 'Real-time risk scoring, smart rate limits, and automatic blocking of abusive traffic patterns.',
    },
  },
];

const STATS = [
  { value: '99.99%', label: { ar: 'نسبة التشغيل', en: 'Uptime SLA' } },
  { value: '<2s', label: { ar: 'متوسط وقت التسليم', en: 'Avg. delivery time' } },
  { value: '180+', label: { ar: 'دولة مغطاة', en: 'Countries covered' } },
  { value: '24/7', label: { ar: 'دعم فني', en: 'Live support' } },
];

const TESTIMONIALS = [
  {
    quote: {
      ar: 'قللنا رسائل الرفض بنسبة 40% بعد استخدام فحص الأرقام قبل الإرسال، والفرق في سرعة الوصول كان واضح من أول أسبوع.',
      en: 'We cut failed sends by 40% after switching on number lookup, and the delivery-speed difference was obvious from week one.',
    },
    name: 'Layla H.',
    role: { ar: 'مديرة المنتج، تطبيق دفع رقمي', en: 'Head of Product, digital payments app' },
  },
  {
    quote: {
      ar: 'دعم فني بيرد فعلاً في دقائق مش أيام. لما عملنا مشكلة في التكامل وقت الإطلاق اتحلت بسرعة غير متوقعة.',
      en: 'Support that actually replies in minutes, not days. When we hit an integration snag at launch, it was resolved faster than we expected.',
    },
    name: 'Rangga P.',
    role: { ar: 'مؤسس شريك، منصة تجارة إلكترونية', en: 'Co-founder, e-commerce marketplace' },
  },
  {
    quote: {
      ar: 'قناة واتساب لوحدها وفرت علينا حوالي ثلث تكلفة التحقق الشهرية مقارنة بالـ SMS التقليدي.',
      en: "The WhatsApp channel alone shaved roughly a third off our monthly verification bill compared to plain SMS.",
    },
    name: 'Omar S.',
    role: { ar: 'رئيس الهندسة، تطبيق حجوزات نقل', en: 'Head of Engineering, ride-hailing app' },
  },
];

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG, no external deps)                               */
/* ------------------------------------------------------------------ */

function Icon({ name, className = 'h-6 w-6' }: { name: string; className?: string }) {
  const common = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
  };
  switch (name) {
    case 'sms':
      return (
        <svg {...common}>
          <path d="M4 5h16v11H8l-4 4V5Z" />
          <path d="M8 9h8M8 12h5" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...common}>
          <path d="M4 20l1.3-3.9A8 8 0 1 1 8.9 19L4 20Z" />
          <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...common}>
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...common}>
          <path d="M4 6h16v12H4z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case 'lookup':
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="6" />
          <path d="m20 20-4.3-4.3" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3 5 6v6c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3Z" />
          <path d="m9.5 12 1.8 1.8L14.8 10" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="m5 13 4 4L19 7" />
        </svg>
      );
    case 'chevron':
      return (
        <svg {...common}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [lang, setLang] = useState<Lang>('ar');
  const [currency, setCurrency] = useState<Currency>('USD');
  const isAr = lang === 'ar';

  const t = useMemo(
    () => ({
      nav: {
        services: isAr ? 'الخدمات' : 'Services',
        packages: isAr ? 'الباقات' : 'Pricing',
        testimonials: isAr ? 'آراء العملاء' : 'Customers',
        contact: isAr ? 'تواصل معنا' : 'Contact',
        login: isAr ? 'دخول العملاء' : 'Client login',
      },
      heroEyebrow: isAr ? 'بنية تحتية للتحقّق بخطوة واحدة' : 'One-time verification infrastructure',
      heroTitle: isAr ? 'رمز التحقق يوصل، والعميل بيتأكد… في أقل من ثانيتين' : 'The code lands, the customer confirms — in under two seconds',
      heroSub: isAr
        ? 'OTPProvider يرسل رموز تحقق فورية عبر SMS وواتساب والمكالمة الصوتية والبريد الإلكتروني، بمعدل تسليم أعلى من 99% في أكثر من 180 دولة.'
        : 'OTPProvider delivers instant SMS, WhatsApp, Voice and Email one-time codes with 99%+ delivery across 180+ countries.',
      ctaPrimary: isAr ? 'اطلب عرض سعر' : 'Get a quote',
      ctaSecondary: isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp',
      servicesEyebrow: isAr ? 'الخدمات' : 'Services',
      servicesTitle: isAr ? 'كل قناة تحقق، من مزوّد واحد' : 'Every verification channel, one provider',
      servicesSub: isAr
        ? 'وصل رمز التحقق مهما كانت حالة العميل: شبكة ضعيفة، رقم غير نشط، أو تفضيل قناة معينة.'
        : 'Reach the customer whatever their situation: weak signal, dead number, or a preferred channel.',
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
      contactTitle: isAr ? 'جاهز تبدأ؟ كلّمنا على واتساب' : 'Ready to start? Message us on WhatsApp',
      contactSub: isAr
        ? 'فريقنا في الإمارات وإندونيسيا جاهز يرد على استفساراتك ويرشحلك الباقة المناسبة لمشروعك.'
        : 'Our teams in the UAE and Indonesia are ready to answer your questions and recommend the right plan.',
      footerRights: isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved',
      footerTag: isAr ? 'بنية تحتية موثوقة لرموز التحقق' : 'Reliable OTP delivery infrastructure',
    }),
    [isAr],
  );

  function formatPrice(usd: number) {
    const fx = FX[currency];
    const converted = Math.round(usd * fx.rate);
    return fx.suffix
      ? `${converted.toLocaleString(isAr ? 'ar-EG' : 'en-US')} ${fx.symbol}`
      : `${fx.symbol}${converted.toLocaleString('en-US')}`;
  }

  function waLink(number: string) {
    const msg = isAr ? 'أهلاً، عايز أعرف أكتر عن باقات OTPProvider' : 'Hi, I would like to know more about OTPProvider packages';
    return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F7FB] text-ink-900 antialiased">
      {/* ---------------- Nav ---------------- */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#F7F7FB]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">OP</div>
            <span className="text-lg font-bold">OTPProvider</span>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-medium text-ink-700/80 md:flex">
            <a href="#services" className="transition hover:text-ink-900">{t.nav.services}</a>
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
              href="/login"
              className="hidden rounded-full bg-ink-900 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700 sm:inline-block"
            >
              {t.nav.login}
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(79,70,229,0.12),transparent)]" />
        <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-14 md:grid-cols-2 md:items-center md:pb-28 md:pt-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-600/20 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
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
              <a
                href={waLink(WHATSAPP.uae.number)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-ink-900 transition hover:border-whatsapp hover:text-whatsapp"
              >
                <Icon name="whatsapp" className="h-4 w-4" />
                {t.ctaSecondary}
              </a>
            </div>

            <dl className="mt-12 grid grid-cols-4 gap-4 border-t border-black/5 pt-8">
              {STATS.map((s) => (
                <div key={s.value}>
                  <dt className="text-xl font-extrabold text-ink-900 md:text-2xl">{s.value}</dt>
                  <dd className="mt-1 text-[11px] leading-tight text-ink-700/60 md:text-xs">{s.label[lang]}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Signature: phone mockup receiving + verifying an OTP */}
          <div className="relative mx-auto w-full max-w-sm animate-float-slow">
            <div className="relative rounded-[2.2rem] border border-black/10 bg-ink-900 p-3 shadow-2xl">
              <div className="rounded-[1.7rem] bg-white px-4 pb-6 pt-8">
                <div className="mx-auto mb-6 h-1.5 w-16 rounded-full bg-black/10" />

                <div className="animate-bubble-in rounded-2xl bg-gray-100 p-4" style={{ animationDelay: '0.2s' }}>
                  <p className="text-[11px] font-semibold text-ink-700/50">OTPProvider</p>
                  <p className="mt-1 text-sm text-ink-900">
                    {isAr ? 'رمز التحقق الخاص بك هو' : 'Your verification code is'}{' '}
                    <span className="font-mono font-bold tracking-widest">
                      {['4', '8', '2', '9', '1', '3'].map((d, i) => (
                        <span key={i} className="animate-otp-pop inline-block" style={{ animationDelay: `${0.5 + i * 0.08}s` }}>
                          {d}
                        </span>
                      ))}
                    </span>
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-mint-500/20 bg-mint-500/5 p-4 animate-bubble-in" style={{ animationDelay: '1.15s' }}>
                  <span className="animate-ring-pulse flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint-500 text-white">
                    <span className="animate-check-in inline-flex" style={{ animationDelay: '1.3s' }}>
                      <Icon name="check" className="h-5 w-5" />
                    </span>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{isAr ? 'تم التحقق بنجاح' : 'Verified successfully'}</p>
                    <p className="text-[11px] text-ink-700/50">{isAr ? 'خلال 1.8 ثانية' : 'in 1.8 seconds'}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  {['sms', 'whatsapp', 'phone'].map((ic) => (
                    <div key={ic} className="flex flex-col items-center gap-1.5 rounded-xl bg-gray-50 py-3 text-ink-700/50">
                      <Icon name={ic} className="h-4 w-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Services ---------------- */}
      <section id="services" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{t.servicesEyebrow}</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{t.servicesTitle}</h2>
          <p className="mt-3 text-[15px] leading-7 text-ink-700/70">{t.servicesSub}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.icon}
              className="group rounded-2xl border border-black/5 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-600/20 hover:shadow-xl hover:shadow-brand-600/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon name={s.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-ink-900">{s.title[lang]}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-700/65">{s.desc[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Packages ---------------- */}
      <section id="packages" className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{t.packagesEyebrow}</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{t.packagesTitle}</h2>
              <p className="mt-3 text-[15px] leading-7 text-ink-700/70">{t.packagesSub}</p>
            </div>

            <div className="flex shrink-0 gap-1.5 rounded-full border border-black/10 bg-gray-50 p-1">
              {(Object.keys(FX) as Currency[]).map((c) => (
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
            {PACKAGES.map((p) => (
              <div
                key={p.id}
                className={`relative flex flex-col rounded-3xl border p-7 ${
                  p.popular
                    ? 'border-brand-600 bg-ink-900 text-white shadow-2xl shadow-brand-600/20 lg:-translate-y-3'
                    : 'border-black/5 bg-gray-50/60 text-ink-900'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-mint-500 px-3.5 py-1 text-[11px] font-bold text-white">
                    {t.mostPopular}
                  </span>
                )}

                <h3 className={`text-sm font-bold uppercase tracking-wide ${p.popular ? 'text-white/70' : 'text-ink-700/60'}`}>
                  {isAr
                    ? { starter: 'الأساسية', business: 'الاحترافية', enterprise: 'المؤسسات' }[p.id]
                    : { starter: 'Starter', business: 'Business', enterprise: 'Enterprise' }[p.id]}
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

                <a
                  href={waLink(WHATSAPP.uae.number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-7 rounded-xl px-5 py-3 text-center text-sm font-semibold transition ${
                    p.popular ? 'bg-white text-ink-900 hover:bg-white/90' : 'bg-ink-900 text-white hover:bg-brand-700'
                  }`}
                >
                  {p.price !== null ? t.choosePlan : t.contactUs}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section id="testimonials" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{t.testimonialsEyebrow}</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{t.testimonialsTitle}</h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((tm) => (
            <figure key={tm.name} className="flex flex-col rounded-2xl border border-black/5 bg-white p-6">
              <blockquote className="flex-1 text-[15px] leading-7 text-ink-700/80">“{tm.quote[lang]}”</blockquote>
              <figcaption className="mt-5 border-t border-black/5 pt-4">
                <p className="text-sm font-bold text-ink-900">{tm.name}</p>
                <p className="text-xs text-ink-700/50">{tm.role[lang]}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------------- Contact ---------------- */}
      <section id="contact" className="bg-ink-900 py-20 text-white md:py-28">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-mint-400">{t.contactEyebrow}</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{t.contactTitle}</h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-7 text-white/60">{t.contactSub}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {Object.values(WHATSAPP).map((w) => (
              <a
                key={w.number}
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
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-black/5 bg-[#F7F7FB]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-xs text-ink-700/50 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600 text-[10px] font-bold text-white">OP</div>
            <span>OTPProvider — {t.footerTag}</span>
          </div>
          <p>
            © {new Date().getFullYear()} OTPProvider. {t.footerRights}.
          </p>
        </div>
      </footer>

      {/* ---------------- Floating WhatsApp buttons ---------------- */}
      <div className="fixed bottom-5 z-50 flex flex-col gap-3 end-5">
        {Object.values(WHATSAPP).map((w) => (
          <a
            key={w.number}
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
