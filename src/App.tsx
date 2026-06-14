import { useState } from "react";
import { 
  Shield, 
  Terminal, 
  Send, 
  Lock, 
  Compass, 
  Award, 
  Mail, 
  FileLock2, 
  Github, 
  Linkedin, 
  PhoneCall, 
  MapPin, 
  Database, 
  Workflow, 
  Briefcase 
} from "lucide-react";
import CinematicLayer from "./components/CinematicLayer";
import VideoIntro from "./components/VideoIntro";
import OperationsDeck from "./components/OperationsDeck";
import SecureChatHub from "./components/SecureChatHub";
import { AVATAR_PROFILES, AvatarProfile } from "./types";

export default function App() {
  const [selectedProfile, setSelectedProfile] = useState<AvatarProfile>(AVATAR_PROFILES[0]);

  // Smooth scroll handler to move from top hero intro down to operations lab
  const handleScrollToNextSec = () => {
    const section = document.getElementById("operations-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* 1. Cinematic Background particles Layer */}
      <CinematicLayer />

      {/* Grid overlay texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.08),rgba(0,0,0,0))] pointer-events-none z-10" />

      {/* 2. Top Navigation Header */}
      <header className="absolute top-0 inset-x-0 h-20 flex items-center justify-between px-6 md:px-12 z-30 select-none">
        <div className="flex items-center gap-2">
          <Shield className="text-amber-500 animate-pulse" size={20} />
          <span className="font-mono text-sm tracking-widest uppercase font-black text-white">
            SAMEER <span className="text-amber-500">SEC</span>
          </span>
        </div>

        {/* Contact Links */}
        <div className="hidden md:flex items-center gap-6 font-mono text-[10px] tracking-wider text-zinc-400">
          <a href="mailto:sameershaik59763@gmail.com" className="hover:text-amber-500 transition-all flex items-center gap-1.5 cursor-pointer">
            <Mail size={12} /> sameershaik59763@gmail.com
          </a>
          <a href="tel:9059726935" className="hover:text-amber-500 transition-all flex items-center gap-1.5 cursor-pointer">
            <PhoneCall size={12} /> 9059726935
          </a>
          <span className="flex items-center gap-1 text-zinc-500">
            <MapPin size={12} /> Trichy, TN
          </span>
        </div>
      </header>

      {/* 3. Hero Video Section */}
      <VideoIntro 
        onScrollNext={handleScrollToNextSec} 
        selectedProfile={selectedProfile}
        setSelectedProfile={setSelectedProfile}
      />

      {/* 4. Mini Global Cyber Briefing Panel (Bento Divider) */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 z-20 select-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Academic standing */}
          <div className="p-5 bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-zinc-800/50 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Compass className="text-amber-500" size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">ACADEMIC STANDING</h4>
              <p className="font-sans text-sm font-semibold text-zinc-100">B.Tech Specialization in Cybersecurity</p>
              <p className="font-sans text-xs text-zinc-400">Dhanalakshmi Srinivasan University, Grad 2027. CGPA: 7.2</p>
            </div>
          </div>

          {/* Card 2: Professional Internships */}
          <div className="p-5 bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-zinc-800/50 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Briefcase className="text-amber-500" size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">PRACTICAL INTERNSHIPS</h4>
              <p className="font-sans text-sm font-semibold text-zinc-100">Thiranex | Codtech Cybersecurity</p>
              <p className="font-sans text-xs text-zinc-400">Ethical Hacking & security operations interns, Jan - Apr 2026</p>
            </div>
          </div>

          {/* Card 3: Modern Security Ops */}
          <div className="p-5 bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-zinc-800/50 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <FileLock2 className="text-amber-500" size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">TACTICAL TOOLSETS</h4>
              <p className="font-sans text-sm font-semibold text-zinc-100">VAPT, Linux Terminal & Cryptography</p>
              <p className="font-sans text-xs text-zinc-400">Experienced in custom security development using Python, Kali, Nmap</p>
            </div>
          </div>

        </div>
      </div>

      {/* 5. TACTICAL PROJECTS & OPERATIONAL EXECUTABLES */}
      <OperationsDeck />

      {/* 6. AI SEC-TWIN INTELLIGENCE CHAT HUB */}
      <SecureChatHub />

      {/* 7. Footer controls */}
      <footer className="w-full bg-zinc-950 border-t border-zinc-900 py-12 px-6 md:px-12 z-20 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Shield className="text-amber-500" size={18} />
              <span className="font-mono text-sm tracking-widest font-black text-white">SAMEER_SEC_SYSTEMS</span>
            </div>
            <p className="text-xs text-zinc-500 max-w-sm">
              Securing systems, auditing vulnerability surfaces, and designing highly defensive cryptographic web components. Tricy / Tamil Nadu.
            </p>
          </div>

          {/* Social Links & Resume Contact */}
          <div className="flex flex-col items-center md:items-end gap-3 font-mono text-xs">
            <div className="flex items-center gap-4">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:text-amber-500 transition-all cursor-pointer"
                title="LinkedIn Profile"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:text-amber-500 transition-all cursor-pointer"
                title="GitHub Profile"
              >
                <Github size={16} />
              </a>
            </div>
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider">
              © 2026 SHAIK SAMEER. ALL RIGHTS SECURED. ISO-27001 METHODOLOGY ENFORCED.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
