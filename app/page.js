// app/secure-landing/page.jsx
// Next.js App Router page template — серверный компонент с клиентскими подкомпонентами.
// Поместите файл в `src/app/secure-landing/page.jsx` или `src/app/page.jsx` по желанию.

import React from 'react'
import ClientLanding from '../components/ClientLanding'

export const metadata = {
  title: 'SafeHarbor — Конфиденциальный просмотр и защита данных',
  description: 'SafeHarbor — показ данных устройства и управления разрешениями без хранения. Конфиденциальность и прозрачность по умолчанию.',
  openGraph: {
    title: 'SafeHarbor — Конфиденциальный просмотр',
    description: 'Мы показываем только то, что вы захотите увидеть — ничего не сохраняем без вашего согласия.',
    url: 'https://yourdomain.example/secure-landing',
    siteName: 'SafeHarbor',
    images: [
      {
        url: 'https://yourdomain.example/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SafeHarbor — приватность и контроль'
      }
    ],
    locale: 'ru_RU',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SafeHarbor — Конфиденциальный просмотр',
    description: 'Показываем только то, что вы разрешили. Ничего не сохраняем по умолчанию.'
  }
}

// Серверный Page: лёгкий, статичный, быстро отдаётся CDN-ом.
export default function Page(){
  return (
    <main>
      {/* На сервере рендерим статичную обёртку (быстрый и SEO-дружелюбный HTML) */}
      <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 antialiased">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"><path d="M12 1L3 5v6c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V5l-9-4z" fill="currentColor"/></svg>
              </div>
              <div>
                <div className="font-semibold text-lg">SafeHarbor</div>
                <div className="text-xs text-gray-500">Конфиденциальность. Прозрачность. Контроль.</div>
              </div>
            </div>

            <nav className="hidden md:flex gap-6 items-center text-sm">
              <a href="#features" className="hover:underline">Преимущества</a>
              <a href="#trust" className="hover:underline">Доверие</a>
              <a href="#privacy" className="hover:underline">Приватность</a>
              <a className="ml-3 inline-block rounded-md bg-indigo-600 px-4 py-2 text-white text-sm">Войти</a>
            </nav>
          </header>

          {/* Клиентская часть (включая запросы геолокации/камеры) вынесена в отдельный клиентский компонент */}
          <div className="mt-8">
            <ClientLanding />
          </div>

        </div>
      </section>
    </main>
  )
}


// -------------------------------------------------
// ClientLanding (client component) — интерактивная часть
// Поместите рядом файл `ClientLanding.jsx` в той же папке.
// Ниже предоставлен self-contained код, который можно сохранить как
// `src/app/secure-landing/ClientLanding.jsx`.
// -------------------------------------------------

/*
'use client'

import React, {useState, useEffect, useRef} from 'react'
import { motion } from 'framer-motion'
import { Lock, UserCheck, Globe, ShieldCheck } from 'lucide-react'

export default function ClientLanding(){
  const [info, setInfo] = useState(null)
  const [geo, setGeo] = useState(null)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(()=>{
    // collect non-sensitive device info (keeps privacy-first approach)
    const nav = typeof navigator !== 'undefined' ? navigator : {}
    const s = typeof window !== 'undefined' ? window.screen : {}
    setInfo({
      userAgent: nav.userAgent || 'не доступно',
      platform: nav.platform || 'не доступно',
      languages: nav.languages || [],
      online: typeof navigator !== 'undefined' ? navigator.onLine : true,
      cookieEnabled: nav.cookieEnabled || false,
      screenWidth: s.width || 0,
      screenHeight: s.height || 0,
      innerWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
      innerHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    })

    return ()=>{
      // cleanup media stream if opened
      if (streamRef.current){
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  },[])

  function askGeo(){
    if (!('geolocation' in navigator)){
      setGeo({error: 'Геолокация не поддерживается'})
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => setGeo({lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy}),
      err => setGeo({error: err.message}),
      {enableHighAccuracy:true, timeout:10000}
    )
  }

  async function askCamera(){
    try{
      const s = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
      streamRef.current = s
      if (videoRef.current) videoRef.current.srcObject = s
    }catch(e){
      console.error(e)
      alert('Ошибка доступа к камере: ' + e.message)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <motion.div initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} transition={{duration:0.4}}>
        <h1 className="text-3xl sm:text-4xl font-extrabold">Защитим ваши данные. Сохраним контроль за вами.</h1>
        <p className="mt-3 text-gray-600 max-w-lg">Мы показываем только то, что вы захотите увидеть — данные не сохраняются без вашего явного согласия.</p>

        <div className="mt-6 flex gap-3 items-center">
          <button className="rounded-md bg-indigo-600 text-white px-4 py-2">Попробовать безопасный просмотр</button>
          <button onClick={()=>setShowPrivacy(true)} className="text-sm text-gray-600 hover:underline">Узнать о приватности</button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <TrustBadge icon={<Lock />} title="Шифрование" subtitle="TLS 1.3 и современные практики" />
          <TrustBadge icon={<UserCheck />} title="Контроль" subtitle="Вы решаете, что показывать" />
          <TrustBadge icon={<Globe />} title="Прозрачность" subtitle="Политики доступны и понятны" />
        </div>
      </motion.div>

      <motion.div initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{duration:0.45}}>
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Ваши данные — видны только вам</div>
              <div className="text-lg font-medium">Просмотр устройства</div>
            </div>
            <div className="text-sm text-green-600 font-medium flex items-center gap-2">● Безопасно</div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div>
              <div className="text-xs text-gray-400">Браузер</div>
              <div>{info?.userAgent}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Разрешение</div>
              <div>{info?.screenWidth}×{info?.screenHeight}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">IP</div>
              <div>— скрыто (не отправляется)</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Геолокация</div>
              <div>{geo ? (geo.error ? geo.error : `${geo.lat.toFixed(4)}, ${geo.lon.toFixed(4)}`) : '— не запрошена'}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button onClick={askGeo} className="rounded-md bg-gray-100 px-3 py-2 text-sm">Запросить геолокацию</button>
            <button onClick={askCamera} className="rounded-md bg-gray-100 px-3 py-2 text-sm">Дать доступ к камере</button>
            <a className="text-sm text-gray-500 hover:underline">Как мы это используем?</a>
          </div>

          <video ref={videoRef} autoPlay playsInline className="mt-4 w-full rounded-md bg-black/5 h-48 object-cover" />
        </div>
      </motion.div>

      {showPrivacy && (
        <PrivacyModal onClose={()=>setShowPrivacy(false)} />
      )}
    </div>
  )
}

function TrustBadge({icon, title, subtitle}){
  return (
    <div className="flex items-start gap-3 bg-white border border-gray-50 rounded-lg p-3 shadow-sm">
      <div className="w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center">{icon}</div>
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </div>
  )
}

function PrivacyModal({onClose}){
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">Политика конфиденциальности — кратко</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>Мы собираем минимально необходимую информацию (данные устройства, геолокация и медиа-потоки) только с вашего явного разрешения. По умолчанию данные не отправляются на сервер и не сохраняются. Вы можете отозвать разрешения в любой момент.</p>
          <ul className="mt-3 list-disc pl-5 text-xs text-gray-500">
            <li>Никаких сторонних трекеров на этой странице.</li>
            <li>HTTPS/TLS — обязательно.</li>
            <li>Если временная обработка на сервере требуется — это будет видно и указано.</li>
          </ul>
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-md bg-gray-100 px-3 py-2">Закрыть</button>
        </div>
      </div>
    </div>
  )
}
*/

// -------------------------------------------------
// Интеграция и рекомендации:
// 1) Поместите `page.jsx` и `ClientLanding.jsx` рядом: `src/app/secure-landing/`.
// 2) Убедитесь, что Tailwind настроен и подключён к проекту.
// 3) Установите зависимости: `framer-motion` и `lucide-react` (по желанию).
//    npm i framer-motion lucide-react
// 4) Для лучшей производительности: статическая генерация (SSG) — используйте cache-control и CDN.
// 5) SEO: проверьте корректность `metadata` и OpenGraph изображения.
// 6) Проверьте CSP (Content-Security-Policy) и отключите сторонние скрипты на этой странице, чтобы минимизировать утечки.

// Если хочешь — могу автоматически вставить ClientLanding как отдельный файл в canvas или адаптировать код под TypeScript.














































// import React from 'react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
// import { ShieldCheck, Lock, UserCheck, Globe } from 'lucide-react'
// import { motion } from 'framer-motion'

// // SecureLanding.jsx
// // Однофайловый React компонент-лендинг для безопасного сайта.
// // TailwindCSS используется для стилизации.
// // По умолчанию — экспорт компонента как default.

// export default function SecureLanding() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 antialiased">
//       <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg">
//             <ShieldCheck className="text-white w-5 h-5" />
//           </div>
//           <div>
//             <div className="font-semibold text-lg">SafeHarbor</div>
//             <div className="text-xs text-gray-500">Конфиденциальность. Прозрачность. Контроль.</div>
//           </div>
//         </div>

//         <nav className="hidden md:flex gap-6 items-center text-sm">
//           <a className="hover:underline" href="#features">Преимущества</a>
//           <a className="hover:underline" href="#trust">Доверие</a>
//           <a className="hover:underline" href="#privacy">Приватность</a>
//           <Button className="ml-3">Войти</Button>
//         </nav>

//         <div className="md:hidden">
//           <button aria-label="menu" className="p-2 rounded-md bg-gray-100">☰</button>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto px-6">
//         <section className="grid md:grid-cols-2 gap-8 items-center py-12">
//           <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{duration:0.6}}>
//             <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
//               Защитим ваши данные. Сохраним контроль за вами.
//             </h1>
//             <p className="mt-4 text-gray-600 max-w-xl">
//               Мы показываем только то, что вы захотите увидеть — данные не сохраняются без вашего согласия.
//               Прозрачная политика, строгие технические меры и постоянный аудит — вот почему пользователи нам доверяют.
//             </p>

//             <div className="mt-6 flex gap-3 items-center">
//               <Button>Попробовать безопасный просмотр</Button>
//               <a className="text-sm text-gray-600 hover:underline" href="#privacy">Узнать о приватности</a>
//             </div>

//             <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
//               <TrustBadge icon={<Lock className="w-4 h-4" />} title="Шифрование" subtitle="TLS 1.3 и современные практики" />
//               <TrustBadge icon={<UserCheck className="w-4 h-4" />} title="Контроль" subtitle="Вы решаете, что показывать" />
//               <TrustBadge icon={<Globe className="w-4 h-4" />} title="Прозрачность" subtitle="Политики видны и просты" />
//             </div>
//           </motion.div>

//           <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.6, delay:0.1}}>
//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-xs text-gray-500">Ваши данные — видны только вам</div>
//                   <div className="text-lg font-medium">Просмотр устройства</div>
//                 </div>
//                 <div className="text-sm text-green-600 font-medium flex items-center gap-2">
//                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
//                     <circle cx="12" cy="12" r="10" fill="#DCFCE7" />
//                     <path d="M7 13l3 3 7-7" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                   </svg>
//                   Безопасно
//                 </div>
//               </div>

//               <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
//                 <div>
//                   <div className="text-xs text-gray-400">Браузер</div>
//                   <div>Chrome (пример)</div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-gray-400">Разрешение</div>
//                   <div>1920×1080</div>
//                 </div>

//                 <div>
//                   <div className="text-xs text-gray-400">IP</div>
//                   <div>— скрыто</div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-gray-400">Геолокация</div>
//                   <div>— не запрошена</div>
//                 </div>
//               </div>

//               <div className="mt-4 flex items-center gap-3">
//                 <Button>Запросить геолокацию</Button>
//                 <a className="text-sm text-gray-500 hover:underline">Как мы это используем?</a>
//               </div>
//             </div>
//           </motion.div>
//         </section>

//         <section id="features" className="py-8">
//           <h2 className="text-2xl font-semibold">Что делает нас безопасными</h2>
//           <div className="mt-4 grid sm:grid-cols-2 gap-6">
//             <FeatureCard title="Zero Storage by default" text="Мы не храним личные данные без явного согласия. Всё, что показывается — временно и только в вашей сессии." />
//             <FeatureCard title="Технические гарантии" text="HTTPS, сильное шифрование, CORS/Content-Security-Policy, регулярные аудиты и pentest." />
//             <FeatureCard title="Прозрачность" text="Полная политика конфиденциальности, журнал изменений и открытый процесс обработки данных." />
//             <FeatureCard title="User-first UX" text="Простые интерфейсы управления разрешениями и понятные объяснения перед каждым запросом." />
//           </div>
//         </section>

//         <section id="trust" className="py-8">
//           <h2 className="text-2xl font-semibold">Компании и проверки</h2>
//           <p className="mt-2 text-gray-600 max-w-2xl">Наши решения проходят независимый аудит и соответствуют современным стандартам безопасности данных.</p>

//           <div className="mt-6 grid sm:grid-cols-3 gap-4">
//             <TrustCard title="Независимый аудит" desc="Пентест и аудит кодовой базы ежегодно" />
//             <TrustCard title="Соответствие" desc="GDPR-ready практики и прозрачные соглашения" />
//             <TrustCard title="Открытые отчёты" desc="Публикуем резюме проверок и устранения рисков" />
//           </div>
//         </section>

//         <section id="privacy" className="py-12">
//           <h2 className="text-2xl font-semibold">Приватность — не маркетинг, а обязательство</h2>
//           <p className="mt-3 text-gray-600 max-w-3xl">Мы придерживаемся принципов минимизации данных, подробно объясняем каждую обработку и даём инструменты для полного контроля: отмена разрешений, экспорт (когда нужно) и мгновенное удаление.</p>

//           <div className="mt-6 grid md:grid-cols-2 gap-6">
//             <Card>
//               <CardContent>
//                 <h3 className="font-medium">Политика конфиденциальности</h3>
//                 <p className="mt-2 text-sm text-gray-600">Доступна полностью. Кратко: данные обрабатываются только по вашему согласию и не сохраняются без вашего согласия.</p>
//                 <a className="mt-3 inline-block text-sm text-indigo-600 hover:underline">Открыть политику</a>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent>
//                 <h3 className="font-medium">Технические детали</h3>
//                 <p className="mt-2 text-sm text-gray-600">TLS 1.3, HSTS, CSP, периодические внешние аудиты и прозрачные CVE-исправления.</p>
//                 <a className="mt-3 inline-block text-sm text-indigo-600 hover:underline">Подробнее</a>
//               </CardContent>
//             </Card>
//           </div>
//         </section>

//         <section className="py-12">
//           <h2 className="text-2xl font-semibold">Отзывы пользователей</h2>
//           <div className="mt-6 grid sm:grid-cols-2 gap-4">
//             <Testimonial name="Алина, продукт-менеджер" text="Мне нравится, что сервис ясен и предсказуем: перед каждым запросом появляется объяснение и я уверена, что мои данные никуда не уйдут." />
//             <Testimonial name="Игорь, разработчик" text="Отсутствие сторонних трекеров и простой UX для прав доступа — редкость. Рекомендую." />
//           </div>
//         </section>

//       </main>

//       <footer className="mt-12 border-t border-gray-100 py-6">
//         <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
//           <div className="text-sm text-gray-600">© {new Date().getFullYear()} SafeHarbor — Все права защищены.</div>
//           <div className="flex gap-4 items-center">
//             <a className="text-sm hover:underline">Политика конфиденциальности</a>
//             <a className="text-sm hover:underline">Условия</a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

// function TrustBadge({icon, title, subtitle}){
//   return (
//     <div className="flex items-start gap-3 bg-white border border-gray-50 rounded-lg p-3 shadow-sm">
//       <div className="w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center">{icon}</div>
//       <div>
//         <div className="font-medium text-sm">{title}</div>
//         <div className="text-xs text-gray-500">{subtitle}</div>
//       </div>
//     </div>
//   )
// }

// function FeatureCard({title, text}){
//   return (
//     <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
//       <div className="font-semibold">{title}</div>
//       <div className="mt-2 text-sm text-gray-600">{text}</div>
//     </div>
//   )
// }

// function TrustCard({title, desc}){
//   return (
//     <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
//       <div className="font-medium">{title}</div>
//       <div className="mt-2 text-sm text-gray-600">{desc}</div>
//     </div>
//   )
// }

// function Testimonial({name, text}){
//   return (
//     <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
//       <div className="text-sm text-gray-700">“{text}”</div>
//       <div className="mt-3 text-xs text-gray-500">— {name}</div>
//     </div>
//   )
// }
