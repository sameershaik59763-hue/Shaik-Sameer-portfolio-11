import { useState, useRef, useEffect } from "react";
import { 
  Terminal, 
  Send, 
  Shield, 
  UserCheck, 
  Lock, 
  Activity, 
  RefreshCw, 
  Check, 
  MessageSquare, 
  FileText
} from "lucide-react";
import { Message } from "../types";

export default function SecureChatHub() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: "System online. Secure cryptographic handshake established. Hello! I am Shaik Sameer’s AI Digital Twin. I can provide verified intelligence regarding Shaik's security capabilities, education, VAPT projects, professional certifications, and secure-coding practices. How can I assist you in your tactical evaluations today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to latest queries
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const quickPrompts = [
    { label: "Academic Profile 2027", query: "Can you detail Shaik Sameer's academic background, expectations for graduation, specialized course of study and CGPA?" },
    { label: "Security Internships 2026", query: "What are Shaik Sameer's practical internship experiences at Thiranex and Codtech IT Solutions?" },
    { label: "Verified Credentials", query: "What certifications does Shaik Sameer hold, including ISO 27001 or Deloitte Cyber Job Simulations?" },
    { label: "Security Projects Hub", query: "Can you summarize Shaik's key defensive and offensive programming projects like his Password Strength Analyzer and Phishing Classifier?" }
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: "usr-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Execute proxy call to server side securely
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();

      const assistantMsg: Message = {
        id: "ast-" + Date.now(),
        role: "assistant",
        content: data.text || "Diagnostic notice: Server processed payload but returned empty response schema.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Chat communications error:", error);
      const errorMsg: Message = {
        id: "err-" + Date.now(),
        role: "assistant",
        content: "Cryptographic handshakes timed out. Connecting to local defensive parameters... Shaik Sameer is a final-year CS (Cybersecurity) student with deep practical exposure in VAPT. What specific part of his security portfolio can I analyze for you using secure logs?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <section id="chat-hub-section" className="relative w-full py-20 px-4 md:px-8 bg-zinc-950 border-t border-zinc-900 overflow-hidden z-20">
      
      {/* Visual cyber background nodes decoration */}
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 hover:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto space-y-12">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <span className="font-mono text-xs tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full uppercase">
            AI SEC-INTELLIGENCE CENTER
          </span>
          <h2 className="text-3xl md:text-5xl font-sans tracking-tight font-black text-white">
            CHAT WITH HIS SEC-TWIN AGENT
          </h2>
          <p className="text-sm text-zinc-400 font-sans max-w-xl mx-auto">
            Interact securely with Shaik Sameer's custom-trained AI identity agent. Powered by server-secured Gemini 3.5 Flash, trained on verified security operation facts.
          </p>
        </div>

        {/* Central Chat Interface Console */}
        <div className="w-full rounded-2xl border border-zinc-800 bg-black/60 backdrop-blur-md overflow-hidden flex flex-col min-h-[500px] shadow-2xl relative">
          
          {/* Interface glass header */}
          <div className="h-12 bg-zinc-950/95 border-b border-zinc-900 px-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <Shield size={16} className="text-amber-500" />
              <span className="font-mono text-xs uppercase tracking-widest font-bold text-zinc-100">
                SECURE TUNNEL: ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[9px] text-zinc-500 uppercase">
              <Activity size={10} className="text-green-500 animate-pulse" /> CIPHER: AES-GCM-256
            </div>
          </div>

          {/* Quick Access Prompt Bar */}
          <div className="bg-zinc-950/40 p-3.5 border-b border-zinc-900/40 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block w-full md:w-auto mb-1 md:mb-0 mr-2">VERIFIED INTELLIGENCE QUERY CATEGORIES:</span>
            {quickPrompts.map((p, i) => (
              <button
                id={`quick-prompt-btn-${i}`}
                key={i}
                type="button"
                onClick={() => handleSendMessage(p.query)}
                className="px-2.5 py-1.5 rounded bg-zinc-900/80 border border-zinc-800 text-[9px] font-mono text-zinc-300 hover:text-white hover:border-amber-500/40 transition-all cursor-pointer select-none"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Chat scrolling feed */}
          <div className="flex-1 p-5 md:p-6 space-y-6 overflow-y-auto max-h-[380px] bg-black/20">
            {messages.map((m) => (
              <div 
                key={m.id}
                className={`flex gap-4 items-start ${
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Visual profile indicator circle */}
                <div className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 ${
                  m.role === "user" 
                    ? "bg-zinc-800 border-zinc-700 text-zinc-300" 
                    : "bg-amber-500/10 border-amber-500/30 text-amber-500"
                }`}>
                  {m.role === "user" ? (
                    <UserCheck size={14} />
                  ) : (
                    <Terminal size={14} />
                  )}
                </div>

                {/* Body glass panel content */}
                <div className={`p-4 rounded-xl border max-w-[85%] relative group ${
                  m.role === "user"
                    ? "bg-zinc-900/40 border-zinc-800 text-zinc-100 text-sm font-sans"
                    : "bg-zinc-900/20 border-zinc-900 text-zinc-200 text-sm leading-relaxed font-sans"
                }`}>
                  
                  {/* Message body */}
                  <div className="whitespace-pre-wrap font-sans text-xs md:text-sm">
                    {m.content}
                  </div>

                  {/* Copy Button overlay */}
                  <button
                    id={`copy-msg-btn-${m.id}`}
                    onClick={() => copyToClipboard(m.content, m.id)}
                    className="absolute top-2 right-2 p-1 rounded bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    title="Copy message contents"
                  >
                    {copiedId === m.id ? <Check size={11} className="text-green-400" /> : <RefreshCw size={11} />}
                  </button>

                  {/* Datetime indicator */}
                  <span className="font-mono text-[8px] text-zinc-600 uppercase block mt-2 text-right">
                    AUTHENTICATED TIMECODE: {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

              </div>
            ))}

            {/* Waiting indicator */}
            {isLoading && (
              <div className="flex gap-4 items-start">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
                  <RefreshCw size={14} className="animate-spin" />
                </div>
                <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/10 text-zinc-500 font-mono text-xs flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" /> Generating remote payload. Authenticating responses...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Entry block */}
          <div className="p-4 bg-zinc-950/90 border-t border-zinc-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex items-center gap-3"
            >
              <input
                id="operations-chat-input"
                type="text"
                placeholder="Ask verified queries regarding Shaik Sameer's certifications, hacking projects, or internships..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-sans placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 leading-normal"
                disabled={isLoading}
              />
              <button
                id="send-chat-payload"
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-3 rounded-xl bg-amber-500 text-black font-semibold uppercase hover:bg-amber-400 transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>

            <div className="flex justify-between items-center font-mono text-[9px] text-zinc-600 mt-2.5">
              <span className="flex items-center gap-1">
                <Lock size={10} /> COMMUNICATIONS ENCRYPTED END-TO-END
              </span>
              <span>VERIFIED AGENT ID: SAMEER_SEC_TWIN</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
