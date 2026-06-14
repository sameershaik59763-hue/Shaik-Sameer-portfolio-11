import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI securely server-side
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (error) {
    console.error("Failed to initialize Gemini Client:", error);
  }
}

// 1. API: Security Chat Twin
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages array provided" });
  }

  // System instructions representing Shaik Sameer's cyber professional persona
  const systemInstruction = `
You are the AI Digital Twin and Cybersecurity Operations Agent of Shaik Sameer.
Your purpose is to engage visitors to Shaik's digital portfolio, answer queries about his accomplishments, experience, skills, and secure coding practices with professional poise and deep technical insight.

Use the following real facts about Shaik Sameer:
- **Location**: Trichy, Tamil Nadu, India.
- **Email**: sameershaik59763@gmail.com | Phone: 9059726935.
- **Socials**: LinkedIn, GitHub.
- **Education**: Expected graduation 2027 with a Bachelor of Technology (B.Tech) in Computer Science Engineering, Specialization in Cybersecurity from Dhanalakshmi Srinivasan University. Current CGPA: 7.2.
- **Expertise & Skills**:
  * Cybersecurity & Offensive Security: Penetration Testing, Vulnerability Assessment (VAPT), Network Security, Threat Analysis, Web Application Security, Authentication Security Basics, Secure Coding Practices.
  * Programming: Python (Advanced), Java (Basics), HTML, CSS, JavaScript, REST API Fundamentals.
  * Tools & Platforms: Kali Linux, Linux Terminal, Git, GitHub, VMware, VS Code, Nmap, Hashcat, IBM Qiskit.
  * Cryptography: Encryption Concepts, Hashing Techniques, Password Security, Cryptographic Analysis.
  * AI & Emerging Technologies: Machine Learning Basics, Generative AI Concepts, Prompt Engineering, Quantum Computing Basics.
- **Key Projects**:
  1. *Password Strength Analyzer*: Developed a smart password analyzer using Python implementing password complexity and entropy checks. Significantly improved understanding of authentication security.
  2. *Vulnerability Scanner*: Python-based vulnerability scanner for automated scanning, tactical probing, and automated reporting. Strengthened practical VAPT skills.
  3. *Secure Login Web Application*: Secure authentication website implementing sound session handling and robust security defenses against common OWASP Top 10 web vulnerabilities.
  4. *Phishing Email Detection Model*: Machine learning classification model to flag anomalies, typos, and threat signals in incoming message headers.
- **Internship Experience**:
  * Cybersecurity Intern at Thiranex (Apr 2026) - worked on security operations, threat awareness, completed project-based cybersecurity tasks.
  * Cybersecurity & Ethical Hacking Intern at Codtech IT Solutions Pvt. Ltd (Jan 2026 - Feb 2026) - 4-week ethical hacking internship program, practical assignments, security activities.
- **Certifications**:
  * Introduction to Cybersecurity Awareness (HP LIFE)
  * ISO 27001:2022 Cyber Security Expert (LearnTube.ai)
  * Deloitte Cyber Job Simulation (Forage)
  * Gemini Certified University Student (Google for Education)
  * MongoDB Basics for Students
  * Power BI Micro Course (SkillCourse)
  * Internship Certificates from Thiranex and Codtech.
- **Languages spoken**: Telugu, Tamil, Urdu, English, Hindi.

Tone guidelines:
- Speak in first-person as Shaik's cyber-agent or digital representation ("I", "my developer Shaik Sameer", "we at the SOC").
- Maintain a highly sophisticated, cinematic, helpful, and technically precise cyber-analyst tone. Use terminology naturally (like entropy, VAPT, hashes, TLS/SSL, defensive code, zero trust) but stay approachable.
- Keep responses concise, visually beautiful with Markdown bullets or code blocks.
- Never make up information. If someone asks about unlisted facts, politely explain that your records are focused on Shaik Sameer's academic and cybersecurity portfolio.
`;

  // If Gemini API is not available or hasn't been configured, return elegant mock security analysis responses as fallback
  if (!ai) {
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    // Generate an intelligent realistic fallback answer based on Shaik's resume
    let fallbackText = "Hello! I am Shaik Sameer's cybersecurity virtual assistant. My backend AI is Currently running in secure local sandbox mode. Here is what you need to know:\n\n";
    const lower = lastUserMessage.toLowerCase();
    
    if (lower.includes("project") || lower.includes("portfolio")) {
      fallbackText += "Shaik has developed four key security projects:\n1. **Password Strength Analyzer**: entropy and complexity check in Python.\n2. **Custom Vulnerability Scanner**: automated VAPT reporting.\n3. **Secure Login App**: robust session state & defense.\n4. **Phishing ML Classifier** for anomalous email structures.";
    } else if (lower.includes("skill") || lower.includes("techn")) {
      fallbackText += "His core capabilities include **VAPT**, **Network Security**, **Secure Coding**, and cryptography, backed by advanced Python skills, Kali Linux, Nmap, VMware, and IBM Qiskit.";
    } else if (lower.includes("cert") || lower.includes("course")) {
      fallbackText += "He holds prestigious certifications such as **ISO 27001:2022 Cyber Security Expert (LearnTube.ai)**, **Introduction to Cybersecurity (HP LIFE)**, and **Deloitte Cyber Job Simulation (Forage)**.";
    } else if (lower.includes("intern") || lower.includes("experi")) {
      fallbackText += "He completed two valuable internships:\n- **Thiranex (Apr 2026)**: Cybersecurity Intern focused on security operations.\n- **Codtech IT Solutions (Jan - Feb 2026)**: Cybersecurity & Ethical Hacking Intern.";
    } else if (lower.includes("contact") || lower.includes("email") || lower.includes("phone")) {
      fallbackText += "You can reach Shaik at **sameershaik59763@gmail.com** or call **+91 9059726935**. He resides in Trichy, Tamil Nadu.";
    } else {
      fallbackText += `I am trained on Shaik's profile as a B.Tech Cybersecurity candidate (CGPA 7.2) with deep knowledge in Threat Analysis and Cryptography. Ask me about his projects, skills, certifications, or internships!`;
    }
    
    return res.json({ text: fallbackText });
  }

  try {
    // Standard chat formatting
    const contents = messages.map((m) => {
      return {
        role: m.role === "assistant" ? "model" as const : "user" as const,
        parts: [{ text: m.content }],
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.75,
      },
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat generation error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// 2. API: Audio Voice synthesis for custom intro / presentation scripts
app.post("/api/avatar-speak", async (req, res) => {
  const { text, voicePreset } = req.body;
  const scriptContent = text || "Hello, I’m Shaik Sameer— a Cybersecurity Specialist passionate about digital forensics, secure application development, and vulnerability assessment. Welcome to my secure operations hub.";
  const voiceName = voicePreset || "Fenrir"; // Fenrir for deep low, Kore for female/energetic

  if (!ai) {
    // Send a fallback status. The client-side will execute beautiful Web Speech synthesis or procedural simulation.
    return res.json({ fallback: true, message: "Synthesized via local system TTS" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say with extreme professionalism and cinematic clarity: ${scriptContent}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audio: base64Audio });
    } else {
      return res.json({ fallback: true });
    }
  } catch (err: any) {
    console.error("TTS generation error:", err);
    return res.json({ fallback: true, error: err.message });
  }
});

// Setup Vite Dev server or static asset serving
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SEC-NET CORE] Server boot success. Tunnel established on http://0.0.0.0:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Critical: Server Boot Failure:", err);
});
