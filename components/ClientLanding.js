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