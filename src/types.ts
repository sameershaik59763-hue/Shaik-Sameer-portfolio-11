export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  metrics: { label: string; value: string }[];
  details: string[];
  tech: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface AvatarProfile {
  id: string;
  name: string;
  tagline: string;
  title: string;
  role: string;
  imagePath: string;
  script: string;
  voicePreset: "Fenrir" | "Kore" | "Zephyr" | "Puck";
  accentColor: string; // Tailwind color name like 'amber' or 'cyan'
}

export const AVATAR_PROFILES: AvatarProfile[] = [
  {
    id: "sameer",
    name: "SHAIK SAMEER",
    tagline: "CYBERSECURITY & OFFENSIVE SECURITY SPECIALIST",
    title: "B.Tech CSE - Cybersecurity Specialization",
    role: "Threat Hunter & Security Researcher",
    imagePath: "shaik_sameer_avatar_1781475637021.jpg", // We will link this in our components relative to /src/assets/images/
    script: "Hello, I’m Shaik Sameer— a Cybersecurity Specialist passionate about digital forensics, secure application development, penetration testing, and vulnerability assessment. Welcome to my cyber operations portfolio.",
    voicePreset: "Fenrir", // Male deep pitch
    accentColor: "amber",
  },
  {
    id: "pravarika",
    name: "PRAVARIKA",
    tagline: "SOFTWARE DEVELOPER & ARCHITECT",
    title: "Full-Stack Software Engineer",
    role: "UX Architect & Scalable Web Developer",
    imagePath: "pravarika_avatar_1781475653577.jpg",
    script: "Hello, I’m pravarika— a Software Developer passionate about building modern web experiences, scalable applications, and impactful digital products. Welcome to my portfolio.",
    voicePreset: "Kore", // Female energetic pitch
    accentColor: "cyan",
  }
];

export const SHAIK_PROJECTS: Project[] = [
  {
    id: "password",
    title: "Password Strength & Entropy Analyzer",
    category: "CRYPTOGRAPHIC SECURITY",
    description: "Multi-layered cryptographic analysis tool that determines real password strength, hashes, character distributions, and estimates crack times with local entropy calculations.",
    icon: "KeyRound",
    metrics: [
      { label: "Entropy Calculation", value: "Shannon Formula" },
      { label: "Encryption Analysis", value: "SHA-256 & MD5 support" },
      { label: "Vulnerability Rule", value: "8-point complexity" }
    ],
    tech: ["Python", "Cryptography", "Complexity Checkers", "Mathematical Entropy"],
    details: [
      "Custom implementation of password entropy algorithms based on Shannon Entropy theory.",
      "Calculates safe bit-range evaluations for passwords to prevent brute force compromises.",
      "Generates visual maps of characters representing dictionary distribution risks.",
      "Provides cryptographic recommendations for mitigation strategies, helping developers code secure authentication APIs."
    ]
  },
  {
    id: "scanner",
    title: "Tactical Vulnerability Scanner",
    category: "OFFENSIVE SECURITY",
    description: "Python-based automatic defense scanner designed to probe web targets, analyze critical ports, evaluate SSL vulnerabilities, and construct formatted executive summaries.",
    icon: "ShieldAlert",
    metrics: [
      { label: "Port Discovery", value: "Multi-threaded async" },
      { label: "Header Evaluation", value: "OWASP Compliance" },
      { label: "VAPT Automation", value: "Instanced reports" }
    ],
    tech: ["Python", "Nmap engine APIs", "Scapy", "REST API Probing"],
    details: [
      "Automates core host discovery and port validation to index exposed system surfaces safely.",
      "Scans HTTP headers for essential defensive policies (HSTS, CSP, X-Frame-Options).",
      "Detects outdated SSL/TLS handshakes or cipher suites that can be intercepted via modern MITM scripts.",
      "Exports neat, prioritized tactical files mapping risks to CVS base scores."
    ]
  },
  {
    id: "login",
    title: "Secure Authentication Web Application",
    category: "SECURE DEVELOPMENT",
    description: "Highly defensive full-stack login model designed using rigid token architectures, CSRF prevention modules, and adaptive salt hashing to demonstrate zero-trust access control.",
    icon: "Lock",
    metrics: [
      { label: "Hash Encryption", value: "Adaptive Salted bcrypt" },
      { label: "Session Handling", value: "Immutable JWT Tokens" },
      { label: "SQLi Mitigation", value: "Parameterized Bounds" }
    ],
    tech: ["HTML5 / CSS3", "JavaScript", "Secured Sessions", "OAuth Flow Basics"],
    details: [
      "Designed and implemented high-defense authentication structures that withstand brute-forcing, SQL Injection, and Session Hijacking.",
      "Applies defensive session termination, cookie storage with Secure and SameSite policies.",
      "Protects server endpoints on REST networks via token validation, enforcing restricted least-privilege schemas."
    ]
  },
  {
    id: "phishing",
    title: "Phishing Email ML Detection Model",
    category: "AI & INTELLIGENCE",
    description: "Threat analytics classifier designed to parse email content, compute risk metrics from metadata headers, and expose phishing threats using machine learning classifiers.",
    icon: "MailSearch",
    metrics: [
      { label: "Algorithm Group", value: "ML Classification" },
      { label: "Feature Extraction", value: "NLP Urgency Metrics" },
      { label: "Threat Coverage", value: "Header anomaly checks" }
    ],
    tech: ["Python", "Machine Learning", "NLP Feature Engineering", "Classification Systems"],
    details: [
      "Built feature extraction pipelines analyzing linguistic structures representing artificial urgency or fear triggers.",
      "Indexes email headers to compare SPF, DKIM records, and highlight mismatched envelope domains.",
      "Demonstrates the intersection of artificial intelligence and proactive malware prevention."
    ]
  }
];

export const SHAIK_CERTIFICATIONS: Certification[] = [
  { name: "ISO 27001:2022 Cyber Security Expert", issuer: "LearnTube.ai", year: "2026" },
  { name: "Gemini Certified University Student", issuer: "Google for Education", year: "2026" },
  { name: "Deloitte Cyber Job Simulation", issuer: "Forage", year: "2026" },
  { name: "Introduction to Cybersecurity Awareness", issuer: "HP LIFE", year: "2025" },
  { name: "MongoDB Basics for Students", issuer: "MongoDB Inc.", year: "2025" },
  { name: "Power BI Micro Course", issuer: "SkillCourse", year: "2025" }
];
