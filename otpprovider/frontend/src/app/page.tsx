import HomeClient from '@/components/home-client';
import { getSiteConfig } from '@/lib/site-config';

// كل 5 دقايق يجرب ياخد أحدث نسخة من إعدادات الأدمن (باقات / واتساب / إيميل)
export const revalidate = 300;

export default async function Home() {
  const config = await getSiteConfig();
  return <HomeClient config={config} />;
}
