# Ahmed Adel — Web

موقع + نظام شغل لـ Media Buyer: عرض الخدمات، فورم Brief متعدد الخطوات، متجر منتجات، ولوحة أدمن.
عربي/إنجليزي (RTL/LTR) وعلى هوية **Ahmed Adel Brand Guide v1.0**.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind 4 · Supabase (Postgres) · Vercel

## الصفحات

| المسار | الوظيفة |
|---|---|
| `/` `/services` | الموقع التعريفي |
| `/start` | فورم الـ Brief (5 خطوات) — بيتسجل Lead في الداتابيز |
| `/store` `/store/[slug]` | المتجر + الطلب |
| `/order/[code]` `/track` | صفحة الطلب للعميل + تعليمات الدفع + لينك التسليم بعد الدفع |
| `/admin` | Leads بالحالات (new / contacted / call booked / won / lost) + Notes |
| `/admin/orders` | تغيير حالة الطلب (pending / paid / delivered / cancelled) |
| `/admin/products` | إضافة/تعديل/إخفاء المنتجات والأسعار ولينك التسليم |

## تشغيل محلي

```bash
npm install
npm run dev
```

من غير أي إعداد، الداتا بتتخزن في `.data/db.json` (محلي فقط) والأدمن بباسورد `admin`.
**ده للتطوير بس** — في Production لازم Supabase وباسورد حقيقي (التطبيق بيرفض يشتغل من غيرهم).

## الرفع على GitHub و Vercel

1. **Supabase:** اعمل مشروع جديد ← SQL Editor ← الصق محتوى [`supabase/schema.sql`](supabase/schema.sql) ← Run.
2. **GitHub:** ارفع المشروع (الـ `.env` و `.data` متجاهَلين في `.gitignore`).
3. **Vercel:** Import من GitHub ← Environment Variables (القيم في [`.env.example`](.env.example)):
   - `ADMIN_PASSWORD` — باسورد طويل
   - `SESSION_SECRET` — نص عشوائي 32+ حرف
   - `SUPABASE_URL` و `SUPABASE_SERVICE_ROLE_KEY` (من Project Settings ← API)
   - `NEXT_PUBLIC_SITE_URL` و `NEXT_PUBLIC_WHATSAPP_NUMBER` (بالكود الدولي من غير +)
   - `PAY_INSTAPAY` / `PAY_VODAFONE_CASH` — بتظهر للعميل في صفحة الطلب
   - اختياري: `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` لإشعار فوري بكل Lead/طلب جديد
4. Deploy، وادخل `/admin`.

> `SUPABASE_SERVICE_ROLE_KEY` سر: يستخدمه السيرفر فقط، ومتحطوش أبدًا في متغير بيبدأ بـ `NEXT_PUBLIC_`.
> الجداول عليها RLS من غير Policies، فالـ anon key مش بيقدر يقرا أو يكتب حاجة.

## تعديلات شائعة

- **النصوص والخدمات:** `src/lib/content.ts`
- **اختيارات الفورم:** `src/lib/form-options.ts` (والـ validation في `src/app/actions.ts`)
- **الألوان والخطوط:** `src/app/globals.css` (حسب الـ Guide: أحمر للـ CTA فقط)
- **اللوجو:** `src/components/Logo.tsx` و `src/app/icon.svg` — استبدلهم بملف الـ SVG الرسمي
- **الأسعار:** من `/admin/products` (المنتجات الـ 3 الأولى أمثلة، عدّلهم أو احذفهم)

## أمان

- الأدمن: باسورد + JWT في Cookie `httpOnly`، ومتحقَّق منه في كل صفحة وكل Server Action.
- السعر بيتقرا من الداتابيز وقت الطلب، مش من المتصفح.
- Honeypot ضد الـ bots. لو جاك Spam كتير، ضيف Rate limiting (مثلًا Upstash) أو Cloudflare Turnstile.
