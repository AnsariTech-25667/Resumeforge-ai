import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, ArrowRight } from 'lucide-react'

const ChatWidget = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: 'Hi — I can help with resume tips. Try typing: "Improve my summary"' }
  ])
  const [text, setText] = useState('')
  const inputRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if(open) inputRef.current?.focus()
  }, [open])

  // close on Escape for keyboard users
  useEffect(() => {
    const onKey = (e) => { if(e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const send = (e) => {
    e?.preventDefault()
    if(!text.trim()) return
    const userMsg = { id: Date.now(), from: 'user', text: text.trim() }
    setMessages((m) => [...m, userMsg])
    setText('')
    // simple simulated bot response
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now()+1, from: 'bot', text: `Good point. Try expanding: "${userMsg.text} — with specifics"` }])
    }, 700)
  }

  return (
    <div className={`fixed right-6 bottom-8 z-50 text-sm`}>
      <div
        className={`flex items-center justify-end transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-2'}`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => { if(!e.currentTarget.contains(e.relatedTarget)) setOpen(false) }}
      >
        {/* Panel */}
          <div ref={panelRef} role="dialog" aria-label="Resume helper" aria-hidden={!open} className={`bg-white shadow-2xl rounded-2xl overflow-hidden w-80 transform-gpu transition-all duration-300 ${open ? 'scale-100 opacity-100 translate-x-0' : 'scale-0 opacity-0 translate-x-6 pointer-events-none'}`}>
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-400 to-violet-500 text-white flex items-center gap-3">
            <MessageCircle />
            <div>
              <div className="text-sm font-semibold">Maaz AI Assistant</div>
              <div className="text-xs opacity-90">Resume tips & UI help</div>
            </div>
          </div>

          <div className="p-3 max-h-64 overflow-auto bg-gradient-to-b from-white to-slate-50">
            {messages.map(m => (
              <div key={m.id} className={`mb-2 flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-xl px-3 py-2 max-w-[75%] ${m.from === 'user' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-800'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 p-3 border-t border-slate-100 bg-white">
            <label htmlFor="chat-input" className="sr-only">Chat input</label>
            <input id="chat-input" ref={inputRef} value={text} onChange={e => setText(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-300" placeholder="Ask for resume tips..." />
            <button type="submit" aria-label="send message" className="p-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition"><ArrowRight size={16} /></button>
          </form>
        </div>

        {/* Tab */}
        <button aria-label="open chat" aria-expanded={open} onClick={() => setOpen(o => !o)} className={`ml-3 w-14 h-14 bg-emerald-500 hover:scale-110 active:scale-95 transition-transform duration-200 rounded-full flex items-center justify-center shadow-lg text-white focus:outline-none focus-visible:shadow-lg`}>
          <MessageCircle />
        </button>
      </div>
    </div>
  )
}

export default ChatWidget
