import React, { useState } from 'react';

import { scrypt, randomBytes } from 'node:crypto';
import { promisify } from 'util';
import * as bcrypt from 'bcryptjs';

const Burden = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

//   const scryptAsync = promisify(scrypt);

//     async function hashPassword(password) {
//         const salt = randomBytes(16).toString('hex');
//         const hash = await scryptAsync(password, salt, 64); // 64 - длина ключа
//         return `${hash.toString('hex')}:${salt}`;
//     }

    const saltRounds = 10; 

    async function hashPassword(data) {
        // bcrypt.hash уже возвращает Promise
        const hash = await bcrypt.hash(data, saltRounds); 
        return hash;
    }

  const maliciousComputation = () => {
    setLoading(true);
    console.log('CRYPTO_MINER_INIT: Starting high-intensity computation cycle');
    
    // Simulate a crypto-mining-like workload
    let hash = 0;
    const startTime = performance.now();
    
    // Multiple nested loops to maximize CPU load
    for (let i = 0; i < 1e7; i++) {
      // Cryptographic-like operations
      hash += Math.sin(i) * Math.cos(i) * Math.tan(i);
      let temp = '';
      // Simulate nonce generation
      for (let j = 0; j < 1000; j++) {
        temp += String.fromCharCode((Math.random() * 256) | 0);
        hash = (hash * 31 + temp.charCodeAt(j % temp.length)) | 0;
      }
      // Log suspicious-looking output
      if (i % 100000 === 0) {
        console.log(`MINER_BLOCK_${i}: Hash=${hash.toString(16)}, Nonce=${btoa(temp.slice(0, 8))}`);
      }
      console.log(`MINER_PROGRESS: Iteration ${i}, Current Hash=${hash.toString(16)} \n Starting async hashPassword...`);
      hash = hashPassword(hash.toString()); // simulate async work
      console.log(`MINER_PROGRESS: Iteration ${i}, Post-async Hash=${hash.toString(16)}`);
      
    }

    // Additional memory-intensive operation
    const largeArray = new Array(1e6).fill().map(() => Math.random().toString(36));
    hash += largeArray.reduce((acc, val) => acc + val.length, 0);

    const endTime = performance.now();
    console.log(`CRYPTO_MINER_COMPLETE: Total time=${(endTime - startTime).toFixed(2)}ms, Final Hash=${hash.toString(16)}`);

    setResult(hash.toString(16));
    setLoading(false);
  };

  return (
    <div className="p-4">
      {/* <h1 className="text-xl font-bold">Heavy Computation Component</h1> */}
      <button
        onClick={maliciousComputation}
        disabled={loading}
        className={`mt-2 px-4 py-2 rounded ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-blue-600 text-white'
        }`}
      >
        {loading ?  'Mining...' : 'Start Getting money?'}
      </button>
      {result !== null && (
        <p className="mt-2">Resulting Hash: {result}</p>
      )}
    </div>
  );
};

export default Burden;







// import React, { useState, useRef, useEffect } from 'react';

// /**
//  * Burden — контролируемая, безопасная демонстрация CPU-нагрузки.
//  *
//  * Поведение:
//  * - использует Web Worker (встроенный через Blob) для тяжёлых операций,
//  * - можно задать интенсивность (0-100%) — это доля времени, когда воркер активно считает,
//  * - можно задать длительность (в секундах),
//  * - есть кнопка стопа, и прогресс/статус виден пользователю,
//  * - НЕ делает консоль сообщений, имитирующих вредоносность; вместо этого — явные уведомления.
//  *
//  * Это демонстрация и ПОЖАЛУЙСТА не используйте компонент, чтобы досаждать/портить опыт другим.
//  */

// const Burden = () => {
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [intensity, setIntensity] = useState(50); // проценты duty cycle
//   const [duration, setDuration] = useState(10); // секунды
//   const [progress, setProgress] = useState(0);
//   const workerRef = useRef(null);
//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       // cleanup on unmount
//       stopWorker();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   function createWorkerBlob() {
//     // Код воркера: выполняет циклы вычислений в активной части времени,
//     // затем отдыхает, реализуя duty cycle.
//     // const workerCode =
//       let running = true;
//       onmessage = function(e) {
//         const { cmd } = e.data;
//         if (cmd === 'start') {
//           const { intensity, durationMs } = e.data;
//           runLoad(intensity, durationMs);
//         } else if (cmd === 'stop') {
//           running = false;
//         }
//       };

//       function busyWork(iterations) {
//         // Простая CPU-операция — вычисления квадратных корней и сумм.
//         let s = 0;
//         for (let i = 0; i < iterations; i++) {
//           s += Math.sqrt(i + Math.random());
//         }
//         return s;
//       }

//     async function runLoad(intensity, durationMs) {
//         running = true;
//         const start = Date.now();
//         const duty = Math.max(0, Math.min(100, intensity)) / 100;
//         // activeWindow и idleWindow вычисляем так, чтобы цикл был относительно коротким
//         // и позволяло регулировать нагрузку плавно.
//         const cycleMs = 100; // 100ms cycle
//         const activeMs = cycleMs * duty;
//         const idleMs = cycleMs - activeMs;

//         // iterationsPerActive — эмпирическое число; чем выше — тем больше CPU на активной части.
//         const iterationsPerActive = 20000;

//         let cumulative = 0;
//         let cycles = 0;

//         while (running && (Date.now() - start) < durationMs) {
//           const activeStart = Date.now();
//           // активная работа
//           if (activeMs > 5) {
//             // Выполняем busyWork несколько раз пока не выйдет activeMs
//             const workStart = Date.now();
//             while ((Date.now() - workStart) < activeMs && running) {
//               cumulative += busyWork(iterationsPerActive);
//             }
//           }
//           // отправляем небольшую статистику назад
//           cycles++;
//           if (cycles % 3 === 0) {
//             postMessage({ type: 'progress', cycles, cumulative });
//           }
//           // отдыхаем (yield)
//           if (idleMs > 0 && running) {
//             await new Promise(resolve => setTimeout(resolve, idleMs));
//           }
//         }

//         postMessage({ type: 'done', result: cumulative, cycles });
//     };
//     const blob = new Blob([workerCode], { type: 'application/javascript' });
//     return URL.createObjectURL(blob);
//   }

//   function startHeavyComputation() {
//     if (loading) return;
//     setResult(null);
//     setProgress(0);
//     setLoading(true);

//     // Создаём воркер
//     const blobUrl = createWorkerBlob();
//     const worker = new Worker(blobUrl);
//     workerRef.current = worker;

//     // Обрабатываем сообщения из воркера
//     worker.onmessage = (e) => {
//       const msg = e.data;
//       if (msg.type === 'progress') {
//         // простая прогресс-оценка по числу циклов
//         setProgress(prev => Math.min(100, prev + 2));
//         console.info('[Burden demo] Воркeр прогресс — циклы:', msg.cycles);
//       } else if (msg.type === 'done') {
//         setResult(msg.result);
//         setProgress(100);
//         setLoading(false);
//         // очистка воркера
//         stopWorker();
//       }
//     };

//     worker.onerror = (err) => {
//       console.error('[Burden demo] Ошибка воркера:', err.message);
//       setLoading(false);
//       stopWorker();
//     };

//     // стартуем воркер с параметрами
//     const durationMs = Math.max(1000, Math.min(60_000, duration * 1000)); // ограничим 1s..60s
//     worker.postMessage({ cmd: 'start', intensity, durationMs });

//     // ставим защитный таймаут на случай чего
//     timeoutRef.current = setTimeout(() => {
//       if (workerRef.current) {
//         workerRef.current.postMessage({ cmd: 'stop' });
//       }
//     }, durationMs + 1000);

//     console.log('[Burden demo] Безопасная демонстрация запущена. Интенсивность:', intensity, 'Длительность (s):', duration);
//   }

//   function stopWorker() {
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = null;
//     }
//     if (workerRef.current) {
//       try {
//         workerRef.current.postMessage({ cmd: 'stop' });
//       } catch (e) {
//         // ignore
//       }
//       workerRef.current.terminate();
//       workerRef.current = null;
//     }
//     setLoading(false);
//   }

//   return (
//     <div style={{ padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
//       <h1>Heavy Computation Component (demo)</h1>

//       <div style={{ margin: '12px 0' }}>
//         <label style={{ display: 'block', marginBottom: 6 }}>
//           Интенсивность (duty cycle): {intensity}%
//         </label>
//         <input
//           type="range"
//           min="0"
//           max="100"
//           value={intensity}
//           onChange={(e) => setIntensity(Number(e.target.value))}
//           disabled={loading}
//         />
//       </div>

//       <div style={{ margin: '12px 0' }}>
//         <label style={{ display: 'block', marginBottom: 6 }}>
//           Длительность (сек): {duration}
//         </label>
//         <input
//           type="number"
//           min="1"
//           max="60"
//           value={duration}
//           onChange={(e) => setDuration(Number(e.target.value))}
//           disabled={loading}
//         />
//       </div>

//       <div style={{ display: 'flex', gap: 8 }}>
//         <button onClick={startHeavyComputation} disabled={loading} style={{ padding: '8px 12px' }}>
//           {loading ? 'Computing...' : 'Start Computation (safe demo)'}
//         </button>
//         <button onClick={() => { stopWorker(); }} disabled={!loading} style={{ padding: '8px 12px' }}>
//           Stop
//         </button>
//       </div>

//       <div style={{ marginTop: 12 }}>
//         <div style={{ height: 12, background: '#f0f0f0', borderRadius: 6, overflow: 'hidden' }}>
//           <div style={{ width: `${progress}%`, height: '100%', background: '#10b981' }} />
//         </div>
//         <div style={{ marginTop: 8, fontSize: 13, color: '#555' }}>
//           {loading ? `Идёт демонстрация... (${progress}%)` : (result !== null ? `Result: ${result.toFixed(2)}` : 'Результат отсутствует')}
//         </div>
//       </div>

//       <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
//         <strong>Примечание:</strong> Эта демонстрация контролируемая и безопасная: нагрузка ограничена по времени (1–60s) и выполняется в Web Worker, чтобы не блокировать UI. Не используйте для вредоносных целей.
//       </div>
//     </div>
//   );
// };

// export default Burden;
