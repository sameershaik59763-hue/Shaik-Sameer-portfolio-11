import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Shield, 
  Activity, 
  Cpu, 
  Layers, 
  Terminal, 
  ChevronDown,
  RotateCcw,
  Speech,
  Glasses
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AVATAR_PROFILES, AvatarProfile } from "../types";

interface VideoIntroProps {
  onScrollNext: () => void;
  selectedProfile: AvatarProfile;
  setSelectedProfile: (p: AvatarProfile) => void;
}

export default function VideoIntro({ onScrollNext, selectedProfile, setSelectedProfile }: VideoIntroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [soundHint, setSoundHint] = useState(true);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [voiceVolume, setVoiceVolume] = useState<number[]>(Array(24).fill(0));
  
  // Custom Timeline Simulation State for Avatar's narrative sequence
  // "removes glasses -> slightly smiles -> wears glasses back"
  const [avatarAction, setAvatarAction] = useState<"standard" | "removes_glasses" | "smiling" | "wears_glasses">("standard");
  const [actionSubtitle, setActionSubtitle] = useState("AI Identity Secured. Sitting calmly...");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Auto-hide the sound tutorial hint after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setSoundHint(false);
    }, 6200);
    return () => clearTimeout(timer);
  }, []);

  // Sync state loop for real/simulated lipsync & timeline
  useEffect(() => {
    if (isPlaying) {
      const start = Date.now();
      speechIntervalRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - start) / 1000;
        setPlaybackTime(elapsed);

        // Control Avatar Timeline Sequence as requested
        // Sequence: sits calmly on start -> talk -> 4s removes glasses -> 8s smiles -> 13s wears back
        if (elapsed < 4) {
          setAvatarAction("standard");
          setActionSubtitle("Talking... (Phase A: Standard telemetry sync)");
        } else if (elapsed >= 4 && elapsed < 8) {
          setAvatarAction("removes_glasses");
          setActionSubtitle("Talking... (Phase B: Removes glasses, eye telemetry calibration active)");
        } else if (elapsed >= 8 && elapsed < 13) {
          setAvatarAction("smiling");
          setActionSubtitle("Talking... (Phase C: Micro-smile enabled, core synthesis natural feedback)");
        } else if (elapsed >= 13 && elapsed < 18) {
          setAvatarAction("wears_glasses");
          setActionSubtitle("Talking... (Phase D: Safe-mount wearing glasses back)");
        } else {
          // Wrap or complete
          setAvatarAction("standard");
          setActionSubtitle("Completed cycle. Telemetry normalized.");
        }

        // Generate synthetic voice frequency waves
        const bands = Array.from({ length: 24 }, () => {
          // If silent or voice dips, generate randomized visual peaks
          return Math.random() * (isMuted ? 5 : 45) + (Math.sin(elapsed * 8) * 15 + 15);
        });
        setVoiceVolume(bands);
      }, 90);
    } else {
      if (speechIntervalRef.current) {
        clearInterval(speechIntervalRef.current);
      }
      setVoiceVolume(Array(24).fill(2));
      setAvatarAction("standard");
      setActionSubtitle("System idle. Ready to initialize stream.");
    }

    return () => {
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    };
  }, [isPlaying, isMuted]);

  // Handle actual server-side Audio Playback if requested
  const handleTogglePlay = async () => {
    // Lazy initialize Audio Web Synth to ensure audible voice works inside sandboxed previews
    if (!isPlaying) {
      try {
        // We will call our server to synthesize speech or run beautiful local audio synthesis
        const response = await fetch("/api/avatar-speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: selectedProfile.script,
            voicePreset: selectedProfile.voicePreset
          })
        });

        const data = await response.json();

        if (data.audio && !isMuted) {
          // Play generated professional base64 audio
          const audioUrl = `data:audio/mp3;base64,${data.audio}`;
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play().catch(e => console.log("Audio block:", e));
          } else {
            const audio = new Audio(audioUrl);
            audioRef.current = audio;
            audio.play().catch(e => console.log("Audio play blocked:", e));
          }
        } else {
          // Local synthesizer fallback (highly interactive futuristic beeps & hums)
          playLocalSynthesizer();
        }
      } catch (err) {
        console.warn("TTS Error, using high-tech synth audio fallback:", err);
        playLocalSynthesizer();
      }
      setIsPlaying(true);
    } else {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopLocalSynthesizer();
      setIsPlaying(false);
    }
  };

  const playLocalSynthesizer = () => {
    try {
      if (isMuted) return;
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(145, ctx.currentTime); // Low cinematic hum

      // FM Synth effect mimicking digital talk-head network voice
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(6, ctx.currentTime);
      lfoGain.gain.setValueAtTime(60, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      lfo.start();
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (e) {
      console.log("Synthesizer audio blocked:", e);
    }
  };

  const stopLocalSynthesizer = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    } catch (e) {
      // ignore
    }
  };

  // Profile Swapper
  const toggleProfile = (profileId: string) => {
    const next = AVATAR_PROFILES.find(p => p.id === profileId);
    if (next) {
      setSelectedProfile(next);
      // Reset play state to ensure beautiful coherence
      setIsPlaying(false);
      stopLocalSynthesizer();
    }
  };

  // Render correct image
  // Fallback to Picsum seed if the local image is not fully parsed yet
  const getAvatarImage = () => {
    if (selectedProfile.id === "sameer") {
      return `/src/assets/images/${selectedProfile.imagePath}`;
    } else {
      return `/src/assets/images/${selectedProfile.imagePath}`;
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden z-20">
      
      {/* Cinematic Top Toolbar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest text-zinc-400">
            SEC-NET HOST: <span className="text-zinc-100">DSU.CYBER.PORTFOLIO</span>
          </span>
        </div>

        {/* Profile Mode Toggle */}
        <div className="p-0.5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center gap-1">
          <button 
            id="swapper-sameer"
            onClick={() => toggleProfile("sameer")}
            className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
              selectedProfile.id === "sameer" 
                ? "bg-amber-600/90 text-black font-semibold" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            SHAIK SAMEER (SOC)
          </button>
          <button 
            id="swapper-pravarika"
            onClick={() => toggleProfile("pravarika")}
            className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
              selectedProfile.id === "pravarika" 
                ? "bg-cyan-600/95 text-black font-semibold" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            PRAVARIKA (AI MODEL)
          </button>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 mt-12 mb-8">
        
        {/* Left Side: Animated Cinematic Landing Typography */}
        <div className="w-full lg:w-1/2 flex flex-col text-left z-20">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase border ${
              selectedProfile.accentColor === "amber" 
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400" 
                : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
            }`}>
              {selectedProfile.tagline}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            {/* Massive Bold First and Last Name Stacked */}
            <h1 className="text-6xl md:text-8xl font-sans tracking-tighter leading-none font-black text-white uppercase select-none relative z-10">
              {selectedProfile.name.split(" ")[0]}
              <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${
                selectedProfile.accentColor === "amber"
                  ? "from-amber-400 via-orange-500 to-amber-600"
                  : "from-cyan-400 via-teal-500 to-cyan-600"
              }`}>
                {selectedProfile.name.split(" ")[1] || ""}
              </span>
            </h1>

            {/* Glowing blur under heading */}
            <div className="absolute -left-12 top-6 w-72 h-72 bg-amber-500/5 hover:bg-amber-500/10 rounded-full blur-3xl rounded-3xl pointer-events-none" />
          </motion.div>

          {/* Role & Title */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 border-l border-zinc-800 pl-6 space-y-2 max-w-lg"
          >
            <h3 className="text-xl font-medium tracking-tight text-zinc-100">
              {selectedProfile.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-sans">
              Specialized in security operations, code vulnerability assessment, threat modelling, and secure Web architecture. Powered by deep AI learning models.
            </p>
          </motion.div>

          {/* Live Telemetry / Play Information Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-8 p-4 bg-zinc-950/40 backdrop-blur-md rounded-xl border border-zinc-800/40 flex flex-col gap-2 max-w-lg"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-zinc-500 uppercase flex items-center gap-1">
                <Activity size={10} className="text-zinc-400 animate-pulse" /> Live Telemetry Waveform
              </span>
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">
                TIMECODE: 00:{(Math.floor(playbackTime)).toString().padStart(2, "0")}
              </span>
            </div>
            
            {/* Visual Equalizer Bars */}
            <div className="h-10 flex items-end gap-0.5 pt-2 border-b border-zinc-900 pb-2">
              {voiceVolume.map((vol, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-sm transition-all duration-75 ${
                    isPlaying 
                      ? selectedProfile.accentColor === "amber" ? "bg-amber-500" : "bg-cyan-500"
                      : "bg-zinc-800"
                  }`}
                  style={{ height: `${Math.max(2, vol)}%` }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-[9px] text-zinc-500">NARRATIVE TRACKER:</span>
              <span className={`font-mono text-[9px] ${
                isPlaying ? "text-amber-400" : "text-zinc-400"
              }`}>
                {actionSubtitle}
              </span>
            </div>
          </motion.div>

        </div>

        {/* Right Side: Floating Interactive Talking Head AI Hologram */}
        <div className="w-full lg:w-1/2 flex justify-center items-center z-20">
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-80 h-96 md:w-96 md:h-[450px]"
          >
            
            {/* Background Ambient Blur Glow Layer */}
            <div className="absolute inset-0 -m-6 bg-gradient-to-tr from-amber-500/10 via-transparent to-teal-500/10 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

            {/* Apple-level Glass Frame around portrait */}
            <div className="w-full h-full rounded-2xl border border-zinc-700/50 bg-zinc-950/20 backdrop-blur-md overflow-hidden flex flex-col relative shadow-2xl">
              
              {/* Header glass panel with close/minimize dots */}
              <div className="h-10 bg-zinc-950/80 border-b border-zinc-800/60 px-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[10px]">
                  <Cpu size={12} className="text-zinc-500 animate-spin-slow" />
                  <span>AI.SYNTH_AVATAR_v4.2</span>
                </div>
              </div>

              {/* Main Image Stage */}
              <div className="relative flex-1 overflow-hidden group">
                
                {/* Visual Avatar Portrait with precise breathing and head tilt effects */}
                <motion.div
                  className="w-full h-full relative"
                  animate={isPlaying ? {
                    scale: [1, 1.012, 1],
                    rotate: [0, 0.5, -0.3, 0],
                    y: [0, -2, 1, 0]
                  } : {
                    scale: [1, 1.005, 1],
                    y: [0, -1, 0]
                  }}
                  transition={{
                    duration: 4.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <img
                    src={getAvatarImage()}
                    alt={selectedProfile.name}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover transition-all duration-[800ms] ${
                      avatarAction === "smiling" ? "saturate-120 brightness-110" : ""
                    }`}
                  />

                  {/* Glass removal / glimmers simulated visual cue */}
                  <AnimatePresence>
                    {avatarAction === "removes_glasses" && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-amber-500/15 backdrop-blur-[1px] flex flex-col justify-center items-center p-4 text-center z-10"
                      >
                        <div className="bg-black/80 border border-amber-500/40 p-3 rounded-lg flex flex-col items-center">
                          <Glasses className="text-amber-400 animate-bounce mb-1" size={24} />
                          <span className="font-mono text-[9px] text-amber-300">NARRATIVE ACTION STATE</span>
                          <span className="font-sans text-[11px] text-white font-medium">Removing transparent glasses</span>
                        </div>
                      </motion.div>
                    )}

                    {avatarAction === "smiling" && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-16 left-4 right-4 bg-zinc-950/90 border border-cyan-500/40 p-2.5 rounded-lg text-center z-10"
                      >
                        <span className="font-mono text-[9px] text-cyan-300 uppercase block mb-0.5">Micro-Expression Analysis</span>
                        <p className="text-[11px] font-sans text-white">Slightly smiling naturally during speech cadence</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Real-time Cinematic Digital Telemetry Grid Graphic Overlaid */}
                  <div className="absolute inset-0 bg-radial-gradient from-transparent via-zinc-950/10 to-zinc-950/60 z-10 pointer-events-none" />
                  
                  {/* Neon Grid overlay for a high-tech hacker theme */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,165,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,165,0,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                  {/* Active Speech visualizer circle overlay */}
                  {isPlaying && (
                    <div className="absolute bottom-4 right-4 flex items-center justify-center h-10 w-10 rounded-full bg-zinc-900 border border-amber-500/30">
                      <Speech size={16} className="text-amber-500 animate-pulse" />
                    </div>
                  )}
                </motion.div>

                {/* Animated subtitling card */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-10 flex flex-col gap-1">
                  <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">SUBTITLE READOUT</p>
                  <p className="text-xs text-zinc-200 line-clamp-3 leading-relaxed font-sans min-h-[40px]">
                    {isPlaying ? selectedProfile.script : "Click PLAY SYSTEM inside control deck to stream audio introduction."}
                  </p>
                </div>
              </div>

              {/* Glassmorphic Cyber Controls Deck */}
              <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  {/* Play & Pause button */}
                  <button
                    id="play-speech-btn"
                    onClick={handleTogglePlay}
                    className={`flex-1 mr-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isPlaying 
                        ? "bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20" 
                        : "bg-white text-black hover:bg-zinc-200"
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause size={14} className="fill-current" /> PAUSE STREAM
                      </>
                    ) : (
                      <>
                        <Play size={14} className="fill-current" /> PLAY SPEECH
                      </>
                    )}
                  </button>

                  {/* Mute toggle button */}
                  <button
                    id="mute-speech-btn"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700/60 text-zinc-400 hover:text-white transition-all cursor-pointer"
                    title={isMuted ? "Unmute Speech" : "Mute Speech"}
                  >
                    {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                </div>

                <div className="flex items-center justify-between font-mono text-[9px] text-zinc-500 border-t border-zinc-900 pt-2.5">
                  <span className="flex items-center gap-1">
                    <Layers size={11} /> SHADER: ADDITIVE CRT
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield size={11} className="text-amber-500/80" /> CRYPTO_KEY: OK
                  </span>
                </div>
              </div>

            </div>

            {/* Glowing animated Badge "Tap for Sound" overlay */}
            <AnimatePresence>
              {soundHint && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -top-12 inset-x-0 mx-auto w-max py-2 px-3 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-center shadow-xl flex items-center gap-1.5 backdrop-blur-md"
                >
                  <Sparkles size={11} className="text-amber-400 animate-pulse" />
                  <span className="font-mono text-[9px] text-zinc-200 uppercase tracking-wider">
                    TAP SPEECH FOR ENHANCED VOICE SYNC
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>

        </div>

      </div>

      {/* Down Scroll Indicator with Pulse */}
      <div 
        onClick={onScrollNext}
        className="absolute bottom-6 mx-auto flex flex-col items-center justify-center cursor-pointer transition-all hover:translate-y-1 z-30 group"
      >
        <span className="font-mono text-[9px] tracking-widest text-zinc-500 group-hover:text-zinc-300 uppercase mb-1">
          INITIATE DECKS
        </span>
        <div className="w-[1.5px] h-8 bg-zinc-800 rounded-full relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 w-full h-1/2 bg-amber-500 rounded-full animate-bounce" />
        </div>
        <ChevronDown size={14} className="text-zinc-500 mt-1" />
      </div>

    </div>
  );
}
