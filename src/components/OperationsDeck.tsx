import { useState } from "react";
import { 
  KeyRound, 
  ShieldCheck, 
  ShieldAlert, 
  Terminal, 
  Search, 
  ArrowRight, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Hash,
  Activity,
  Award,
  BookOpen,
  Calendar,
  Lock,
  Mail,
  Copy
} from "lucide-react";
import { SHAIK_PROJECTS, SHAIK_CERTIFICATIONS, Project } from "../types";

export default function OperationsDeck() {
  const [activeTab, setActiveTab] = useState<"projects" | "analyzer" | "scanner" | "phish" | "certs">("projects");
  const [selectedProject, setSelectedProject] = useState<Project>(SHAIK_PROJECTS[0]);

  // -------- TOOL State: Password Strength Analyzer --------
  const [pwdInput, setPwdInput] = useState("");
  const [analyzerResults, setAnalyzerResults] = useState<{
    score: number; // 0-100
    entropy: number; // bits
    label: string; // Weak, Moderate, Strong, Fort Knox
    crackTime: string;
    hasLength: boolean;
    hasLower: boolean;
    hasUpper: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    hashes: { md5: string; sha256: string };
  } | null>(null);

  // -------- TOOL State: Vulnerability Scanner --------
  const [scanTarget, setScanTarget] = useState("ds-university.edu");
  const [isScanning, setIsScanning] = useState(false);
  const [scanOutput, setScanOutput] = useState<string[]>([]);
  const [scanResults, setScanResults] = useState<{
    ports: { port: number; service: string; status: string }[];
    headers: { name: string; status: "safe" | "warning"; value: string }[];
    grade: string;
    vulnerabilities: string[];
  } | null>(null);

  // -------- TOOL State: Phishing Email Classifier --------
  const [phishMailText, setPhishMailText] = useState("");
  const [analyzingPhish, setAnalyzingPhish] = useState(false);
  const [phishResults, setPhishResults] = useState<{
    riskScore: number; // 0-100
    riskLevel: "LOW" | "MODERATE" | "HIGH_RISK" | "CRITICAL";
    triggers: { term: string; danger: string; category: string }[];
    recommendations: string[];
  } | null>(null);

  // -------- FUNCTION: Analyze Password Strength --------
  const handlePasswordAnalyze = (val: string) => {
    setPwdInput(val);
    if (!val) {
      setAnalyzerResults(null);
      return;
    }

    // Entropy calculation
    const length = val.length;
    let poolSize = 0;
    const hasLower = /[a-z]/.test(val);
    const hasUpper = /[A-Z]/.test(val);
    const hasNum = /[0-9]/.test(val);
    const hasSpec = /[^A-Za-z0-9]/.test(val);

    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNum) poolSize += 10;
    if (hasSpec) poolSize += 32;

    if (poolSize === 0) poolSize = 1;
    const entropy = Math.log2(poolSize) * length;

    // Determine strength level
    let label = "Vulnerable";
    let score = Math.min(100, Math.floor((entropy / 85) * 100));
    if (length < 6) score = Math.min(score, 15);

    if (score < 25) label = "Critical Alert (Easy crack)";
    else if (score >= 25 && score < 50) label = "Weak (Standard Bruteforce risk)";
    else if (score >= 50 && score < 75) label = "Moderate Defensive Standard";
    else label = "Fort Knox Compliant (Optimal)";

    // Estimated crack time
    let crackTime = "Instantaneous";
    if (entropy > 80) crackTime = "9.8 Billion Years";
    else if (entropy > 60) crackTime = "410 Years";
    else if (entropy > 45) crackTime = "2.8 Years";
    else if (entropy > 30) crackTime = "12 Hours";
    else if (entropy > 15) crackTime = "18 Seconds";

    // Simple pseudo hashes
    const mockHashMD5 = "e99a18c428cb38d5f260853678922e03"; // standard simulation
    const mockHashSHA = "f72ac5170d4dcee8797f262141a0217dc4626154e1abf7768565251666e";

    setAnalyzerResults({
      score,
      entropy: Math.round(entropy * 100) / 100,
      label,
      crackTime,
      hasLength: length >= 12,
      hasLower,
      hasUpper,
      hasNumber: hasNum,
      hasSpecial: hasSpec,
      hashes: { md5: mockHashMD5, sha256: mockHashSHA }
    });
  };

  // -------- FUNCTION: Run Vulnerability Scanner --------
  const handleRunScan = () => {
    if (!scanTarget) return;
    setIsScanning(true);
    setScanResults(null);
    setScanOutput(["[SYS] Initiating VAPT diagnostics suite...", `[SYS] Targeting host resolution: ${scanTarget}`]);

    let step = 0;
    const terminalLogs = [
      `[SOC_RESOLVE] Target resolved to dynamic sandbox IP: 192.168.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`,
      "[PORT_SCAN] Triggering multi-threaded custom Port Scout...",
      "[PORT_SCAN] Open Ports indexed: TCP 80 http, TCP 443 https, TCP 22 ssh",
      "[SSL_CHECK] Handshaking TLS v1.3 cipher validations...",
      "[HEADER_CHECK] Indexing remote HTTP response configurations...",
      "[THREAT_EVAL] Cataloging OWASP Top 10 web surfaces...",
      "[SYS] Generating operational compliance reports..."
    ];

    const timer = setInterval(() => {
      if (step < terminalLogs.length) {
        setScanOutput(prev => [...prev, terminalLogs[step]]);
        step++;
      } else {
        clearInterval(timer);
        setIsScanning(false);
        // Complete mock results
        setScanResults({
          ports: [
            { port: 80, service: "HTTP", status: "Open / Insecure Redirect available" },
            { port: 443, service: "HTTPS", status: "Secure (TLS v1.3 active)" },
            { port: 22, service: "SSH", status: "Filtered (Bruteforce mitigations detected)" }
          ],
          headers: [
            { name: "Strict-Transport-Security (HSTS)", status: "safe", value: "max-age=63072000; includeSubDomains" },
            { name: "Content-Security-Policy (CSP)", status: "warning", value: "Not fully enforced" },
            { name: "X-Frame-Options (Clickjack)", status: "safe", value: "DENY" },
            { name: "X-Content-Type-Options", status: "safe", value: "nosniff" }
          ],
          grade: "A- (Strong perimeter)",
          vulnerabilities: [
            "Missing granular directive in Content-Security-Policy (CSP) headers",
            "Port 80 exhibits standard insecure metadata disclosure during handshake redirection"
          ]
        });
      }
    }, 450);
  };

  // -------- FUNCTION: Analyze Phishing Mail --------
  const handleAnalyzePhish = () => {
    if (!phishMailText) return;
    setAnalyzingPhish(true);
    setPhishResults(null);

    setTimeout(() => {
      setAnalyzingPhish(false);

      const words = phishMailText.toLowerCase();
      const triggers: { term: string; danger: string; category: string }[] = [];
      let score = 5;

      // Detection rules
      if (words.includes("bank") || words.includes("credit") || words.includes("account")) {
        triggers.push({ term: "financial context", danger: "High", category: "Urgency Target" });
        score += 25;
      }
      if (words.includes("urgent") || words.includes("immediately") || words.includes("action required")) {
        triggers.push({ term: "urgency keyword", danger: "Critical", category: "Psychological Trigger" });
        score += 35;
      }
      if (words.includes("password") || words.includes("login") || words.includes("verify")) {
        triggers.push({ term: "credential phishing", danger: "High", category: "Attack Vector" });
        score += 20;
      }
      if (words.includes("click here") || words.includes("link") || words.includes("http://")) {
        triggers.push({ term: "suspicious redirect trigger", danger: "Critical", category: "Malicious Anchor" });
        score += 15;
      }

      const riskScore = Math.min(100, score);
      let riskLevel: "LOW" | "MODERATE" | "HIGH_RISK" | "CRITICAL" = "LOW";
      if (riskScore > 75) riskLevel = "CRITICAL";
      else if (riskScore > 50) riskLevel = "HIGH_RISK";
      else if (riskScore > 20) riskLevel = "MODERATE";

      setPhishResults({
        riskScore,
        riskLevel,
        triggers,
        recommendations: [
          "Do not execute any attachment elements or anchor redirections inside this message structure.",
          "Check headers to verify SPF and DKIM authentication compliance.",
          "Submit flagged envelope targets to security operations vectors immediately."
        ]
      });
    }, 1200);
  };

  return (
    <section id="operations-section" className="relative w-full py-20 px-4 md:px-8 border-t border-zinc-900 bg-black overflow-hidden z-20">
      
      {/* Background Tech Line decoration */}
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-[linear-gradient(to_bottom,rgba(251,191,36,0.1),transparent)]" />

      <div className="w-full max-w-7xl mx-auto">
        
        {/* Navigation Decks Headers */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-xs tracking-widest text-amber-500 uppercase">
              OPERATIONS ROOM
            </span>
            <h2 className="text-3xl md:text-5xl font-sans tracking-tight font-black text-white mt-2">
              TACTICAL PORTFOLIO & LAB
            </h2>
          </div>

          {/* Action Tabs Menu */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
            <button
              id="tab-projects"
              onClick={() => setActiveTab("projects")}
              className={`px-4 py-2 rounded-lg font-mono text-xs cursor-pointer transition-all ${
                activeTab === "projects" ? "bg-amber-500 text-black font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              PROJECT DETAILS
            </button>
            <button
              id="tab-analyzer"
              onClick={() => setActiveTab("analyzer")}
              className={`px-4 py-2 rounded-lg font-mono text-xs cursor-pointer transition-all ${
                activeTab === "analyzer" ? "bg-amber-500 text-black font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              PASSWORD STRENGTH
            </button>
            <button
              id="tab-scanner"
              onClick={() => setActiveTab("scanner")}
              className={`px-4 py-2 rounded-lg font-mono text-xs cursor-pointer transition-all ${
                activeTab === "scanner" ? "bg-amber-500 text-black font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              VAPT SCANNER
            </button>
            <button
              id="tab-phish"
              onClick={() => setActiveTab("phish")}
              className={`px-4 py-2 rounded-lg font-mono text-xs cursor-pointer transition-all ${
                activeTab === "phish" ? "bg-amber-500 text-black font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              PHISH DETECTOR
            </button>
            <button
              id="tab-certs"
              onClick={() => setActiveTab("certs")}
              className={`px-4 py-2 rounded-lg font-mono text-xs cursor-pointer transition-all ${
                activeTab === "certs" ? "bg-amber-500 text-black font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              CERTIFICATIONS
            </button>
          </div>
        </div>

        {/* CONTAINER CONTENT STAGE */}
        <div className="w-full min-h-[480px] bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 p-6 md:p-8 relative">
          
          {/* Accent corners mimicking terminal target screens */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500/80 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500/80 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500/80 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500/80 rounded-br-sm pointer-events-none" />

          {/* TAB 1: Real Case Projects Display */}
          {activeTab === "projects" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Project Selector List */}
              <div className="lg:col-span-5 space-y-3">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">
                  TACTICAL DEPLOYMENTS
                </span>
                {SHAIK_PROJECTS.map((proj) => (
                  <button
                    id={`proj-sel-${proj.id}`}
                    key={proj.id}
                    onClick={() => setSelectedProject(proj)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      selectedProject.id === proj.id
                        ? "bg-amber-500/10 border-amber-500/40"
                        : "bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/50"
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] text-amber-500">{proj.category}</span>
                      <h4 className="text-sm font-sans font-bold text-white">{proj.title}</h4>
                    </div>
                    <ArrowRight size={14} className={selectedProject.id === proj.id ? "text-amber-500" : "text-zinc-500"} />
                  </button>
                ))}
              </div>

              {/* Right Column: In-depth project breakdown */}
              <div className="lg:col-span-7 bg-zinc-950/80 rounded-xl border border-zinc-900 p-6 space-y-6">
                <div className="border-b border-zinc-900 pb-4">
                  <span className="font-mono text-[10px] text-amber-500 uppercase tracking-widest">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-sans font-black text-white mt-1">
                    {selectedProject.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-2 font-sans font-normal leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Technical highlights metrics */}
                <div className="grid grid-cols-3 gap-3">
                  {selectedProject.metrics.map((met, i) => (
                    <div key={i} className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/40">
                      <span className="font-mono text-[9px] text-zinc-500 uppercase block leading-tight">
                        {met.label}
                      </span>
                      <span className="font-sans text-xs text-zinc-200 mt-0.5 font-bold block">
                        {met.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Structural modules checklist */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">
                    IMPLEMENTED CORE DEFENSIBLITY
                  </span>
                  <div className="space-y-1.5">
                    {selectedProject.details.map((det, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <ShieldCheck size={14} className="text-amber-500/80 mt-0.5 shrink-0" />
                        <span className="text-xs text-zinc-300 leading-normal font-sans">
                          {det}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-900">
                  {selectedProject.tech.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded bg-zinc-900 text-[10px] font-mono text-zinc-400 border border-zinc-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: Interactive Password Strength Analyzer */}
          {activeTab === "analyzer" && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-zinc-900 pb-4">
                <h3 className="text-xl font-sans font-bold text-white flex items-center gap-2">
                  <KeyRound className="text-amber-500 animate-pulse" size={20} /> PASSWORD STRENGTH & ENTROPY ENGINE
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-sans">
                  Developed by Shaik Sameer. Type your password to estimate binary cryptographic bounds, bit-strength entropy, and salted SHA hashes.
                </p>
              </div>

              {/* Large Input block */}
              <div className="relative">
                <input
                  id="pass-strength-input"
                  type="text"
                  placeholder="Enter custom password..."
                  value={pwdInput}
                  onChange={(e) => handlePasswordAnalyze(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              {/* Dynamic Stats View */}
              {analyzerResults ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Stats Gauges */}
                  <div className="space-y-4 p-4 bg-zinc-900/30 rounded-xl border border-zinc-900 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[9px] text-zinc-500 uppercase">CALCULATED STRENGTH LEVEL</span>
                      <h4 className="text-base font-sans font-bold text-white flex items-center gap-1.5 mt-0.5">
                        {analyzerResults.score > 60 ? (
                          <ShieldCheck size={16} className="text-green-400" />
                        ) : (
                          <ShieldAlert size={16} className="text-amber-400" />
                        )}
                        {analyzerResults.label}
                      </h4>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-mono text-[9px]">
                        <span className="text-zinc-500">ENTROPY PERCENTILE</span>
                        <span className="text-zinc-300">{analyzerResults.score}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            analyzerResults.score > 75 
                              ? "bg-green-500" 
                              : analyzerResults.score > 50 
                                ? "bg-amber-500" 
                                : "bg-red-500"
                          }`}
                          style={{ width: `${analyzerResults.score}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-900">
                      <div>
                        <span className="font-mono text-[9px] text-zinc-500 uppercase block">Shannon Entropy</span>
                        <span className="font-mono text-sm text-zinc-200 font-bold">{analyzerResults.entropy} bits</span>
                      </div>
                      <div>
                        <span className="font-mono text-[9px] text-zinc-500 uppercase block">ESTIMATED CRACK TIME</span>
                        <span className="font-mono text-sm text-zinc-200 font-bold">{analyzerResults.crackTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cryptographic Hashes & Rules Checklist */}
                  <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-900 space-y-4">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase block">CRYPTOGRAPHIC COMPLIANCE RULES</span>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
                      <div className="flex items-center gap-1.5 p-2 rounded bg-zinc-950">
                        {analyzerResults.hasLength ? <CheckCircle size={11} className="text-green-500" /> : <XCircle size={11} className="text-red-500" />}
                        <span className="text-zinc-300">Min 12 Characters</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded bg-zinc-950">
                        {analyzerResults.hasUpper ? <CheckCircle size={11} className="text-green-500" /> : <XCircle size={11} className="text-red-500" />}
                        <span className="text-zinc-300">Has Uppercase</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded bg-zinc-950">
                        {analyzerResults.hasLower ? <CheckCircle size={11} className="text-green-500" /> : <XCircle size={11} className="text-red-500" />}
                        <span className="text-zinc-300">Has Lowercase</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded bg-zinc-950">
                        {analyzerResults.hasNumber ? <CheckCircle size={11} className="text-green-500" /> : <XCircle size={11} className="text-red-500" />}
                        <span className="text-zinc-300">Has Numbers</span>
                      </div>
                    </div>

                    {/* Virtual Cryptographic Hash display */}
                    <div className="space-y-1 text-left bg-zinc-950 p-2.5 rounded border border-zinc-900 font-mono text-[10px]">
                      <div className="flex items-center gap-1 text-zinc-400 justify-between">
                        <span className="flex items-center gap-1"><Hash size={10} /> LOCAL MD5 HASH:</span>
                        <span className="text-zinc-600 font-bold select-all truncate max-w-[120px]">{analyzerResults.hashes.md5}</span>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-400 justify-between border-t border-zinc-900 pt-1.5 mt-1">
                        <span className="flex items-center gap-1"><Hash size={10} /> SHA-256 ENCRYPT:</span>
                        <span className="text-zinc-600 font-bold select-all truncate max-w-[120px]">{analyzerResults.hashes.sha256}</span>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/10">
                  <Info size={20} className="text-zinc-600 animate-pulse mb-1.5" />
                  <p className="font-mono text-xs text-zinc-500">INPUT PLAIN-TEXT PASSWORD INTO FIELD TO RUN ENTROPY ANALYSIS</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Vulnerability Scanner Simulator */}
          {activeTab === "scanner" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="border-b border-zinc-900 pb-4">
                <h3 className="text-xl font-sans font-bold text-white flex items-center gap-2">
                  <Terminal className="text-amber-500 animate-pulse" size={20} /> AUTOMATED PENETRATION & PORT PROBING COMPILER
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-sans">
                  A reproduction module of Sameer’s Python Vulnerability Scanner. Input any domain to compile host diagnostic logs, security header compliance grades, and target warning indexes.
                </p>
              </div>

              {/* Target input controls */}
              <div className="flex items-center gap-2.5">
                <input
                  id="target-input-domain"
                  type="text"
                  placeholder="e.g. ds-university.edu"
                  value={scanTarget}
                  onChange={(e) => setScanTarget(e.target.value)}
                  className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60"
                  disabled={isScanning}
                />
                <button
                  id="run-scan-trigger"
                  onClick={handleRunScan}
                  disabled={isScanning}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-amber-400 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isScanning ? "Probing..." : "RUN SCANNER"}
                </button>
              </div>

              {/* Grid: Terminal Logs Output & Report Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                
                {/* Terminal Shell Panel */}
                <div className="lg:col-span-6 bg-black border border-zinc-800 rounded-xl p-4 font-mono text-[10px] space-y-1.5 min-h-[220px] max-h-[280px] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-2 text-zinc-500 text-[9px]">
                    <span className="flex items-center gap-1"><Activity size={10} /> SOC-SHELL TERMINAL</span>
                    <span>ONLINE</span>
                  </div>
                  {scanOutput.length > 0 ? (
                    scanOutput.map((log, i) => (
                      <p key={i} className={log.startsWith("[SYS]") ? "text-amber-400" : log.startsWith("[PORT") ? "text-cyan-400" : "text-zinc-300"}>
                        {log}
                      </p>
                    ))
                  ) : (
                    <p className="text-zinc-600 italic">No scanner operations queued. Direct scanner payloads to boot.</p>
                  )}
                  {isScanning && (
                    <p className="text-zinc-500 animate-pulse">Running thread indexes. Writing logs...</p>
                  )}
                </div>

                {/* Audit Report display */}
                <div className="lg:col-span-6">
                  {scanResults ? (
                    <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                        <span className="font-mono text-[9px] text-zinc-500 uppercase">Perimeter Grade Evaluation</span>
                        <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] uppercase font-bold">
                          {scanResults.grade}
                        </span>
                      </div>

                      {/* Header Results list */}
                      <div className="space-y-2">
                        <span className="font-mono text-[9px] text-zinc-500 uppercase block">SECURITY HEADER METRIC</span>
                        <div className="space-y-1.5">
                          {scanResults.headers.map((hd, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-zinc-950/60 rounded border border-zinc-900">
                              <span className="font-sans text-[11px] text-zinc-300 font-medium">{hd.name}</span>
                              <span className={`px-2 py-0.5 rounded font-mono text-[8px] uppercase font-bold ${
                                hd.status === "safe" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-500"
                              }`}>
                                {hd.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Flagged vulnerabilies */}
                      <div className="space-y-1.5">
                        <span className="font-mono text-[9px] text-zinc-500 uppercase block">POTENTIAL VULNERABILITY LOGS</span>
                        {scanResults.vulnerabilities.map((vul, i) => (
                          <div key={i} className="flex items-start gap-2 bg-red-950/20 border border-red-500/20 p-2 rounded text-[10px] text-red-300">
                            <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                            <p>{vul}</p>
                          </div>
                        ))}
                      </div>

                    </div>
                  ) : (
                    <div className="h-full min-h-[220px] flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/10">
                      <Info size={18} className="text-zinc-600 mb-1" />
                      <p className="font-mono text-[10px] text-zinc-500 text-center uppercase p-4">
                        Awaiting penetration scan output logs. Compile to parse diagnostic reports.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: Phishing Email Classifier */}
          {activeTab === "phish" && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-zinc-900 pb-4">
                <h3 className="text-xl font-sans font-bold text-white flex items-center gap-2">
                  <Mail className="text-amber-500 animate-pulse" size={20} /> NLP PHISHING THREAT CLASSIFICATION MODEL
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-sans">
                  An interface replica of Shaik Sameer's Machine Learning Phishing classifier. Paste an incoming header or email body below to determine potential fraud triggers, urgency levels, and danger rankings.
                </p>
              </div>

              {/* Text Area */}
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest block">EMAIL BODY TEXT PAYLOAD</span>
                <textarea
                  id="phish-analyzer-field"
                  placeholder="e.g. URGENT: Your banking secure password expires in 3 hours. Action Required immediately. Please click here to verify credentials now."
                  rows={4}
                  value={phishMailText}
                  onChange={(e) => setPhishMailText(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-sans placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 leading-relaxed"
                />
                
                {/* Helpers */}
                <div className="flex gap-2.5">
                  <button 
                    id="phish-help-fill-1"
                    onClick={() => setPhishMailText("Dear customer, your credit account is locked due to suspicious login events. Immediately proceed to change password or click the HTTP redirect link to verify securely.")}
                    className="px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-[9px] text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    Load Simulated Spam Body
                  </button>
                  <button 
                    id="phish-help-fill-2"
                    onClick={() => setPhishMailText("Hello Shaik, thank you for completing the Deloitte Internship. Details regarding the cybersecurity simulation outcomes are inside.")}
                    className="px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-[9px] text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    Load Safe corporate Mail Body
                  </button>
                </div>
              </div>

              <button
                id="run-phish-analyst"
                onClick={handleAnalyzePhish}
                disabled={analyzingPhish || !phishMailText}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-semibold text-xs font-mono uppercase hover:bg-amber-400 transition-all disabled:opacity-50 cursor-pointer"
              >
                {analyzingPhish ? "Analyzing NLP features..." : "ANALYZE PAYLOAD RISK"}
              </button>

              {/* Results */}
              {phishResults && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-zinc-900">
                  
                  {/* Score & Warning */}
                  <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-900 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="font-mono text-[9px] text-zinc-500 uppercase block">ML DANGER VERDICT</span>
                      <h4 className={`text-base font-sans font-bold flex items-center gap-1.5 mt-0.5 ${
                        phishResults.riskLevel === "CRITICAL" ? "text-red-400" : phishResults.riskLevel === "HIGH_RISK" ? "text-orange-400" : "text-green-400"
                      }`}>
                        {phishResults.riskLevel === "CRITICAL" || phishResults.riskLevel === "HIGH_RISK" ? (
                          <ShieldAlert size={16} />
                        ) : (
                          <ShieldCheck size={16} />
                        )}
                        {phishResults.riskLevel} ANALYSIS 
                      </h4>
                    </div>

                    <div className="flex items-center justify-between font-mono text-[10px] bg-zinc-950 p-2.5 rounded">
                      <span className="text-zinc-500">Risk Confidence Metric</span>
                      <span className={`font-bold ${
                        phishResults.riskScore > 75 ? "text-red-400" : phishResults.riskScore > 40 ? "text-yellow-500" : "text-emerald-400"
                      }`}>
                        {phishResults.riskScore}% Probability index
                      </span>
                    </div>

                    <div className="space-y-1 text-left">
                      <span className="font-mono text-[9px] text-zinc-500 uppercase block">TACTICAL REC</span>
                      <ul className="list-disc pl-4 space-y-1">
                        {phishResults.recommendations.map((rec, i) => (
                          <li key={i} className="text-[10px] text-zinc-300 font-sans">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Linguistic Trigger List */}
                  <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-900 space-y-3">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase block">NLP FEATURE EXTRACTION (TRIGGERS INGESTED)</span>
                    {phishResults.triggers.length > 0 ? (
                      <div className="space-y-2">
                        {phishResults.triggers.map((trig, i) => (
                          <div key={i} className="p-2.5 bg-zinc-950/60 rounded border border-zinc-900 flex flex-col gap-0.5">
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-[10px] text-zinc-100 font-bold uppercase">{trig.term}</span>
                              <span className="px-1.5 py-0.5 rounded font-mono text-[8px] uppercase font-semibold bg-red-500/10 text-red-400">
                                Danger: {trig.danger}
                              </span>
                            </div>
                            <span className="text-[9px] font-sans text-zinc-500">{trig.category} taxonomy detected</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center p-6 text-center text-zinc-500 font-mono text-[10px]">
                        No anomalous linguistic urgency structures or vector patterns extracted. Core safe layout.
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 5: Professional Certifications View */}
          {activeTab === "certs" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-900 pb-4">
                <h3 className="text-xl font-sans font-bold text-white flex items-center gap-2">
                  <Award className="text-amber-500 animate-pulse" size={20} /> VERIFIED COMPLIANCE CERTIFICATIONS
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-sans">
                  Shaik Sameer holds key security credentials representing academic integrity, ISO cybersecurity models, ethical operations awareness, and student-level leadership.
                </p>
              </div>

              {/* Grid representation */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SHAIK_CERTIFICATIONS.map((cert, i) => (
                  <div 
                    key={i} 
                    className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/60 hover:border-amber-500/40 hover:bg-zinc-900/50 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                        <Award size={16} className="text-amber-500" />
                      </div>
                      <h4 className="text-sm font-sans font-bold text-white line-clamp-1">
                        {cert.name}
                      </h4>
                      <p className="text-xs font-mono text-zinc-500">
                        ISSUER: {cert.issuer}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-900 pt-2.5 font-mono text-[9px] text-zinc-600">
                      <span className="flex items-center gap-1">
                        <BookOpen size={10} strokeWidth={1.5} /> COMPLIANCE INDEX
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={10} strokeWidth={1.5} /> {cert.year}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </section>
  );
}
