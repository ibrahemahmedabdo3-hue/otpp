/**
 * =====================================================================
 *  إعدادات الموقع — كل حاجة بتتحكم فيها لوحة الأدمن لاحقًا موجودة هنا
 *  Site config — everything the admin panel should eventually control
 * =====================================================================
 *
 *  دلوقتي القيم دي "افتراضية" (defaults) مكتوبة في الكود.
 *  الدالة getSiteConfig() بتحاول تجيب نفس الشكل من الـ API بتاع الأدمن
 *  (NEXT_PUBLIC_API_URL + "/public/site-config") ولو السيرفر مش راجع
 *  حاجة أو فيه خطأ، بيستخدم القيم الافتراضية تلقائيًا — يعني الموقع
 *  ميتعطلش أبدًا حتى لو الـ API لسه مش جاهز.
 *
 *  لما تجهز endpoint في لوحة الأدمن، خليه يرجّع JSON بنفس الشكل بتاع
 *  SiteConfig تحت، والموقع هياخد منه تلقائي من غير أي تعديل تاني هنا.
 * =====================================================================
 */

export type Lang = 'ar' | 'en';
export type Currency = 'USD' | 'AED' | 'SAR' | 'EGP';

export interface WhatsappChannel {
  id: string;
  number: string; // بدون + أو مسافات، مثال: 971564201773
  label: { ar: string; en: string };
  flag: string;
}

export interface ContactInfo {
  email: string;
  supportHours: { ar: string; en: string };
  whatsapp: WhatsappChannel[];
}

export interface PackageFeatureList {
  ar: string[];
  en: string[];
}

export interface Package {
  id: string;
  name: { ar: string; en: string };
  price: number | null; // null = "حسب الاحتياج / Custom"
  verifications: number | null;
  popular?: boolean;
  channels: { ar: string; en: string };
  features: PackageFeatureList;
}

export interface ProductChannel {
  id: string;
  icon: 'sms' | 'whatsapp' | 'phone' | 'mail' | 'lookup' | 'shield';
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
}

export interface Stat {
  id: string;
  value: string;
  label: { ar: string; en: string };
}

export interface Testimonial {
  id: string;
  quote: { ar: string; en: string };
  name: string;
  role: { ar: string; en: string };
}

export interface SiteConfig {
  brandName: string;
  contact: ContactInfo;
  packages: Package[];
  channels: ProductChannel[];
  stats: Stat[];
  testimonials: Testimonial[];
  fx: Record<Currency, { rate: number; symbol: string; suffix?: boolean }>;
  loginUrl: string;
  signupUrl: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults — تتعدل من هنا لحد ما لوحة الأدمن تشتغل                   */
/* ------------------------------------------------------------------ */

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: 'OTPProvider',

  contact: {
    email: 'hello@otpprovider.com',
    supportHours: { ar: 'دعم فني 24/7', en: '24/7 live support' },
    whatsapp: [
      { id: 'uae', number: '971564201773', label: { ar: 'الإمارات', en: 'UAE' }, flag: '🇦🇪' },
      { id: 'id', number: '6281517676784', label: { ar: 'إندونيسيا', en: 'Indonesia' }, flag: '🇮🇩' },
    ],
  },

  loginUrl: '/login',
  signupUrl: '/signup',

  fx: {
    USD: { rate: 1, symbol: '$' },
    AED: { rate: 3.67, symbol: 'د.إ', suffix: true },
    SAR: { rate: 3.75, symbol: 'ر.س', suffix: true },
    EGP: { rate: 48, symbol: 'ج.م', suffix: true },
  },

  packages: [
    {
      id: 'starter',
      name: { ar: 'الأساسية', en: 'Starter' },
      price: 29,
      verifications: 2000,
      channels: { ar: 'SMS فقط', en: 'SMS only' },
      features: {
        ar: ['حتى 2,000 عملية تحقق شهرياً', 'قناة SMS', 'دعم عبر البريد الإلكتروني', 'وثائق API + SDKs جاهزة', 'أوقات تسليم أقل من 3 ثوانٍ'],
        en: ['Up to 2,000 verifications / mo', 'SMS channel', 'Email support', 'REST API + ready SDKs', 'Sub-3s delivery'],
      },
    },
    {
      id: 'business',
      name: { ar: 'الاحترافية', en: 'Business' },
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
      name: { ar: 'المؤسسات', en: 'Enterprise' },
      price: null,
      verifications: null,
      channels: { ar: 'كل القنوات + تكامل خاص', en: 'All channels + custom routes' },
      features: {
        ar: ['عمليات تحقق غير محدودة', 'مدير حساب مخصص', 'اتفاقية مستوى خدمة SLA %99.99', 'تكامل مخصص وربط مباشر بالموردين', 'إمكانية الاستضافة الخاصة (VPC/On-prem)'],
        en: ['Unlimited verifications', 'Dedicated account manager', '99.99% uptime SLA', 'Custom routing & carrier integration', 'Private VPC / on-prem option'],
      },
    },
  ],

  channels: [
    {
      id: 'sms',
      icon: 'sms',
      title: { ar: 'رموز تحقق SMS', en: 'SMS OTP' },
      desc: {
        ar: 'إرسال رموز تحقق فورية عبر أكثر من 800 شبكة اتصالات حول العالم بمعدل تسليم يتجاوز 99%.',
        en: 'Instant verification codes across 800+ mobile networks worldwide with 99%+ delivery rates.',
      },
    },
    {
      id: 'whatsapp',
      icon: 'whatsapp',
      title: { ar: 'رموز تحقق واتساب', en: 'WhatsApp OTP' },
      desc: {
        ar: 'تكلفة أقل ومعدل فتح أعلى — أرسل الرمز داخل محادثة واتساب رسمية موثقة من ميتا.',
        en: 'Lower cost, higher open-rates — deliver codes inside a Meta-verified WhatsApp Business chat.',
      },
    },
    {
      id: 'voice',
      icon: 'phone',
      title: { ar: 'رموز تحقق صوتية', en: 'Voice OTP' },
      desc: {
        ar: 'مكالمة آلية تنطق الرمز بصوت واضح، مثالية عند تعطل الشبكة أو لضعاف البصر.',
        en: 'Automated voice calls that read the code aloud — ideal for network fallback or accessibility.',
      },
    },
    {
      id: 'email',
      icon: 'mail',
      title: { ar: 'رموز تحقق بريد إلكتروني', en: 'Email OTP' },
      desc: {
        ar: 'قوالب بريد إلكتروني جاهزة وقابلة للتخصيص لإرسال رموز التحقق بهوية بصرية متطابقة مع علامتك.',
        en: 'Branded, customizable email templates for delivering verification codes.',
      },
    },
    {
      id: 'lookup',
      icon: 'lookup',
      title: { ar: 'فحص وتنقية الأرقام', en: 'Number Lookup' },
      desc: {
        ar: 'تحقق من صلاحية الرقم ونوع الشبكة قبل الإرسال — قلل التكلفة الضائعة على أرقام غير نشطة.',
        en: 'Validate carrier & line type before you send — cut spend wasted on dead numbers.',
      },
    },
    {
      id: 'fraud',
      icon: 'shield',
      title: { ar: 'الحماية من الاحتيال والبوتات', en: 'Fraud & Bot Protection' },
      desc: {
        ar: 'تقييم مخاطر لحظي، حدود إرسال ذكية، وحظر تلقائي للأنماط المشبوهة قبل أن تُكلّفك أموالاً.',
        en: 'Real-time risk scoring, smart rate limits, and automatic blocking of abusive traffic patterns.',
      },
    },
  ],

  stats: [
    { id: 'uptime', value: '99.99%', label: { ar: 'نسبة التشغيل', en: 'Uptime SLA' } },
    { id: 'speed', value: '<2s', label: { ar: 'متوسط وقت التسليم', en: 'Avg. delivery time' } },
    { id: 'countries', value: '180+', label: { ar: 'دولة مغطاة', en: 'Countries covered' } },
    { id: 'support', value: '24/7', label: { ar: 'دعم فني', en: 'Live support' } },
  ],

  testimonials: [
    {
      id: 't1',
      quote: {
        ar: 'قللنا رسائل الرفض بنسبة 40% بعد استخدام فحص الأرقام قبل الإرسال، والفرق في سرعة الوصول كان واضح من أول أسبوع.',
        en: 'We cut failed sends by 40% after switching on number lookup, and the delivery-speed difference was obvious from week one.',
      },
      name: 'Layla H.',
      role: { ar: 'مديرة المنتج، تطبيق دفع رقمي', en: 'Head of Product, digital payments app' },
    },
    {
      id: 't2',
      quote: {
        ar: 'دعم فني بيرد فعلاً في دقائق مش أيام. لما عملنا مشكلة في التكامل وقت الإطلاق اتحلت بسرعة غير متوقعة.',
        en: 'Support that actually replies in minutes, not days. When we hit an integration snag at launch, it was resolved faster than we expected.',
      },
      name: 'Rangga P.',
      role: { ar: 'مؤسس شريك، منصة تجارة إلكترونية', en: 'Co-founder, e-commerce marketplace' },
    },
    {
      id: 't3',
      quote: {
        ar: 'قناة واتساب لوحدها وفرت علينا حوالي ثلث تكلفة التحقق الشهرية مقارنة بالـ SMS التقليدي.',
        en: 'The WhatsApp channel alone shaved roughly a third off our monthly verification bill compared to plain SMS.',
      },
      name: 'Omar S.',
      role: { ar: 'رئيس الهندسة، تطبيق حجوزات نقل', en: 'Head of Engineering, ride-hailing app' },
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Fetch-with-fallback — جاهزة لما تربطها بالأدمن                     */
/* ------------------------------------------------------------------ */

function deepMerge<T>(base: T, patch: any): T {
  if (!patch || typeof patch !== 'object') return base;
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) };
  for (const key of Object.keys(patch)) {
    if (patch[key] && typeof patch[key] === 'object' && !Array.isArray(patch[key]) && out[key]) {
      out[key] = deepMerge(out[key], patch[key]);
    } else {
      out[key] = patch[key];
    }
  }
  return out;
}

/**
 * بيرجع إعدادات الموقع. لو NEXT_PUBLIC_API_URL متظبطة وفيه endpoint
 * شغال على /public/site-config هيستخدم بياناته (ويكمّل أي حقل ناقص
 * من القيم الافتراضية). لو مفيش، أو حصل خطأ، هيرجع القيم الافتراضية
 * على طول من غير ما يوقف تحميل الصفحة.
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return DEFAULT_SITE_CONFIG;

  try {
    const res = await fetch(`${apiUrl}/public/site-config`, {
      next: { revalidate: 300 }, // كاش 5 دقايق عشان تعديلات الأدمن تظهر بسرعة معقولة
    });
    if (!res.ok) return DEFAULT_SITE_CONFIG;
    const remote = await res.json();
    return deepMerge(DEFAULT_SITE_CONFIG, remote);
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}
