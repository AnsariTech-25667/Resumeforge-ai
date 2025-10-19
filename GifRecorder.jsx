import React, { useState, useRef } from 'react'

// Client-side recorder that loads gif.js and html2canvas from CDN and captures frames
const GifRecorder = () => {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [gifUrl, setGifUrl] = useState(null)
  const iframeRef = useRef(null)

  const loadScript = (src) => new Promise((resolve, reject) => {
    if(document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = (e) => reject(e)
    document.head.appendChild(s)
  })

  const start = async () => {
    setRunning(true)
    setProgress(0)
    setGifUrl(null)

    // load dependencies from CDN
    await loadScript('https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js')
    await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js')

    const GIF = window.GIF
    if(!GIF || !window.html2canvas){
      alert('Required libraries failed to load')
      setRunning(false)
      return
    }

    // create hidden iframe showing the SVG animation (served relative)
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.left = '-9999px'
    iframe.style.width = '900px'
    iframe.style.height = '600px'
    iframe.src = '/docs/screenshots/demo-animation.svg'
    document.body.appendChild(iframe)
    iframeRef.current = iframe

    await new Promise((r) => { iframe.onload = () => setTimeout(r, 300) })

    const gif = new GIF({ workers: 2, quality: 10, workerScript: 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js' })
    const frames = 40
    const delay = 50

    for(let i=0;i<frames;i++){
      // capture via html2canvas from the iframe's document element
      const canvas = await window.html2canvas(iframe.contentDocument.documentElement, { backgroundColor: null, width: 900, height: 600 })
      gif.addFrame(canvas, { delay })
      setProgress(Math.round(((i+1)/frames)*100))
      // small pause to allow animation to progress
      await new Promise(r => setTimeout(r, delay))
    }

    gif.on('finished', function(blob) {
      const url = URL.createObjectURL(blob)
      setGifUrl(url)
      setRunning(false)
      setProgress(100)
      // clean up iframe
      try{ iframe.remove() }catch(err){ console.warn('Failed to remove iframe', err) }
    })

    gif.render()
  }

  return (
    <div className="fixed left-6 bottom-8 z-50">
      <div className="bg-white rounded-xl shadow-lg p-3 w-48 text-sm">
        <div className="font-semibold mb-2">GIF Recorder</div>
        {gifUrl ? (
          <div className="space-y-2">
            <a className="block text-emerald-600 underline" href={gifUrl} download="demo.gif">Download GIF</a>
            <button className="px-3 py-1 rounded bg-slate-100" onClick={() => { setGifUrl(null); setProgress(0) }}>Record again</button>
          </div>
        ) : (
          <div>
            <div className="mb-2">Progress: {progress}%</div>
            <button disabled={running} className={`px-3 py-1 rounded ${running ? 'bg-gray-300' : 'bg-emerald-500 text-white'}`} onClick={start}>{running ? 'Recording...' : 'Record GIF'}</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GifRecorder
