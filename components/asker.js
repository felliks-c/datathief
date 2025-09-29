'use client'
import {useState} from 'react'

export default function ShowMyDevice() {
  const [info, setInfo] = useState(null)
  const [geo, setGeo] = useState(null)
  const [mediaError, setMediaError] = useState(null)

  function gather() {
    const nav = navigator || {}
    const s = window.screen || {}
    setInfo({
      userAgent: nav.userAgent,
      platform: nav.platform,
      languages: nav.languages,
      online: nav.onLine,
      cookieEnabled: nav.cookieEnabled,
      screenWidth: s.width,
      screenHeight: s.height,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    })
  }

  function askGeo() {
    if (!navigator.geolocation) return setGeo({error: 'not supported'})
    navigator.geolocation.getCurrentPosition(
      pos => setGeo({lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy}),
      err => setGeo({error: err.message}),
      {enableHighAccuracy: true, timeout: 10000}
    )
  }

  async function askCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
      // показать превью в элементе video — но НЕ сохранять
      const videoEl = document.querySelector('#preview')
      if (videoEl) videoEl.srcObject = stream
      // не отправляем и не сохраняем stream; оставляем в памяти браузера
    } catch (e) {
      setMediaError(e.message)
    }
  }

  return (
    <div>
      <button onClick={gather}>Показать данные устройства</button>
      <button onClick={askGeo}>Показать мою геолокацию (запрос)</button>
      <button onClick={askCamera}>Дать доступ к камере (запрос)</button>

      {info && <pre>{JSON.stringify(info, null, 2)}</pre>}
      {geo && <pre>{JSON.stringify(geo, null, 2)}</pre>}
      {mediaError && <div>Ошибка камеры: {mediaError}</div>}
      <video id="preview" autoPlay playsInline style={{width:300,display:'block'}}/>
    </div>
  )
}
