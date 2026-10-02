export const profile = {
  name: "Eshwar Gottupalli",
  initials: "EG",
  role: "AI Developer",
  firstName: "ESHWAR",
  lastName: "GOTTUPALLI",
  tagline: "I build at the intersection of AI/ML, computer vision, and embedded systems — from silicon to the cloud.",
  bio: "Demonstrated expertise in Artificial Intelligence, Computer Vision, and Embedded Systems, with 1+ years of professional experience building innovative systems.",
  city: "HYDERABAD",
  country: "INDIA",
  location: "Hyderabad, India",
  latLabel: "LAT: 17.3850° N",
  longLabel: "LONG: 78.4867° E",
  coordinates: "17.3850°N, 78.4867°E",
  email: "eshwarnagavenkat@gmail.com",
  quote: "Always chasing the perfect line — driven by curiosity, competition, and relentless iteration.",
  social: [
    { label: "GitHub", href: "https://github.com/ne-5437" },
    { label: "LinkedIn", href: "https://linkedin.com/in/eshwargottupalli/" },
    { label: "Behance", href: "https://www.behance.net/eshwarnagave" },
  ],
  focusTags: ["AI / ML", "COMPUTER VISION", "EMBEDDED SYSTEMS", "LLMS & AGENTS"],
};

export const expertise = [
  {
    index: "01",
    title: "Pattern Recognition & Perception",
    description:
      "Understanding how intelligent systems transform raw signals, observations, and data into structured representations, patterns, and actionable understanding.",
    tags: ["Feature Extraction", "Representation Learning", "Classification"],
    image: "/images/expertise/replay1.png",
  },
  {
    index: "02",
    title: "Cognitive Systems & Reasoning",
    description:
      "Exploring how AI systems build context, reason across evolving states, and move beyond single inference toward structured cognitive processes.",
    tags: ["Memory Architecture", "State Management", "Decision Logic"],
    image: "/images/expertise/replay2.png",
  },
  {
    index: "03",
    title: "Theory of Mind & Multi-Agent Intelligence",
    description:
      "Designing agent interactions around perspective, intent, shared context, and coordinated reasoning to enable more adaptive multi-agent systems.",
    tags: ["Perspective Modeling", "Agent Coordination", "Shared State"],
    image: "/images/expertise/replay3.png",
  },
];

/**
 * Grouped by employer, so consecutive roles at the same company read as one
 * continuous tenure rather than two unrelated jobs. Technology tags are drawn
 * only from the stated skills and the role descriptions themselves.
 */
export const experience = [
  {
    lap: "01",
    company: "Greenko Group",
    location: "Hyderabad, Telangana, India",
    tenure: "11 mos",
    roles: [
      {
        role: "AI/ML Engineer",
        type: "Full-time",
        duration: "Apr 2026 — Present",
        length: "5 mos",
        current: true,
        description:
          "Building agentic AI for energy — LLM agents, RAG chatbots, NLQ engines and knowledge graphs — with early work on mirroring physical assets in software.",
        technologies: [
          "Generative AI",
          "LLMs",
          "LLM Agents",
          "RAG",
          "NLQ",
          "Knowledge Graphs",
        ],
      },
      {
        role: "AI/ML Intern",
        type: "Internship",
        duration: "Oct 2025 — Mar 2026",
        length: "6 mos",
        description:
          "Built end-to-end ML/DL forecasting and anomaly-detection systems for wind, hydro and power market operations — replacing manual scheduling — plus computer-vision pipelines and an equity-management tool.",
        technologies: [
          "Machine Learning",
          "Time Series Forecasting",
          "Deep Learning",
          "Anomaly Detection",
          "Computer Vision",
        ],
      },
    ],
  },
  {
    lap: "02",
    company: "National Remote Sensing Centre, ISRO",
    location: "Shadnagar, Telangana, India",
    tenure: "3 mos",
    roles: [
      {
        role: "Digital Design Intern",
        type: "Internship",
        duration: "Aug 2023 — Oct 2023",
        length: "3 mos",
        description:
          "Designed and verified an LDPC encoder–decoder in Verilog (RTL) for forward error correction in satellite communications, simulated in Xilinx Vivado.",
        technologies: ["Verilog", "LDPC Encoder/Decoder", "RTL Design", "Xilinx Vivado"],
      },
    ],
  },
];

export const projects = [
  {
    index: "01",
    category: "MOTORSPORT TELEMETRY ANALYTICS",
    title: "Telemetry-Forged Race Strategy",
    description:
      "FastF1 telemetry streams driving Pandas analytics and Plotly/Dash visualizations for racecraft intelligence.",
    stack: ["FastF1", "Pandas", "Plotly"],
    href: "https://github.com/ne-5437/Telemetry-Forged-Race-Strategy",
    image: "/images/projects/01-telemetry-forged-race-strategy.png",
  },
  {
    index: "02",
    category: "TINYML HEALTH MONITORING",
    title: "TinyML Neonatal Signal Intelligence",
    description:
      "MobileNet distilled to TensorFlow Lite for real-time infant vital-sign and acoustic cry classification.",
    stack: ["TensorFlow Lite", "MobileNet", "ESP8266"],
    href: "https://github.com/ne-5437/TinyML-Neonatal-Signal-Intelligence",
    image: "/images/projects/02-tinyml-neonatal-signal-intelligence.png",
  },
  {
    index: "03",
    category: "EMBEDDED VISION SECURITY",
    title: "Embedded Vision Identity Pipeline",
    description:
      "ESP32-CAM capture feeding OpenCV normalization and facial-embedding analysis for low-latency biometric verification.",
    stack: ["ESP32-CAM", "OpenCV", "Face Recognition"],
    href: "https://github.com/ne-5437/Embedded-Vision-Identity-Pipeline",
    image: "/images/projects/03-embedded-vision-identity-pipeline.png",
  },
  {
    index: "04",
    category: "SATELLITE COMMS HARDWARE",
    title: "FPGA-Based LDPC Error Correction Engine",
    description:
      "Hardware-level LDPC encoding and iterative decoding for parity-driven data recovery and error correction.",
    stack: ["Verilog", "Vivado", "Error Correction"],
    href: "https://github.com/ne-5437/FPGA-Based-LDPC-Error-Correction-Engine",
    image: "/images/projects/04-ldpc-error-correction.png",
  },
  {
    index: "05",
    category: "MICROCONTROLLER FIRMWARE",
    title: "Real-Time Kernel Architecture for STM32",
    description:
      "Preemptive task orchestration using interrupts, context switching, synchronization, and real-time scheduling.",
    stack: ["C", "STM32", "RTOS", "Embedded Systems"],
    href: "https://github.com/ne-5437/Real-Time-Kernel-Architecture-for-STM32",
    image: "/images/projects/05-stm32-rtos-kernel.png",
  },
  {
    index: "06",
    category: "ACOUSTIC DSP ANALYTICS",
    title: "Welch-Based Spectral Analysis of Signals",
    description:
      "Frequency-domain intelligence through windowing, periodogram averaging, and FFT-based spectral estimation.",
    stack: ["MATLAB", "Welch's Method", "FFT"],
    href: "https://github.com/ne-5437/Welch-Based-Spectral-Analysis-of-Signals",
    image: "/images/projects/06-welch-spectral-analysis.png",
  },
];

export const skills = [
  { label: "AI / ML", value: 92 },
  { label: "Design", value: 90 },
  { label: "Problem Solving", value: 88 },
  { label: "Systems", value: 85 },
  { label: "HPC / GPUs", value: 84 },
  { label: "Frontend", value: 82 },
];

export const skillCategories = [
  { label: "Languages", items: ["Python", "C++", "Java", "Verilog", "SQL"] },
  { label: "ML / AI", items: ["PyTorch", "TensorFlow", "Keras", "OpenCV", "LangChain"] },
  { label: "Tools & Infra", items: ["Vivado", "MATLAB", "Figma", "Git", "Docker"] },
];

export const blogPosts = [
  {
    index: "01",
    date: "2025-04",
    title: "Design Lead — Acumen ECE Tech Fest '25",
    excerpt:
      "Owned end-to-end branding — identity, posters, and rollout — for the department's flagship annual tech fest.",
    href: "#",
  },
  {
    index: "02",
    date: "2024-07",
    title: "Head of Arts & Design — Swayam Ed-Cell",
    excerpt:
      "Led the arts & design department, shaping posters and digital campaigns for the ed-cell's initiatives.",
    href: "#",
  },
  {
    index: "03",
    date: "2023-09",
    title: "Runners-Up — Smart India Hackathon 2023",
    excerpt: "Reached the finals and placed as runners-up at SIH 2023.",
    href: "#",
  },
  {
    index: "04",
    date: "2023-08",
    title: "Project Intern — NRSC, ISRO",
    excerpt:
      "Built an LDPC encoder/decoder in Verilog and validated bit-flipping decoding performance on Vivado.",
    href: "#",
  },
];

/**
 * Educational journey milestones. `date` drives horizontal position along the
 * bar via (date - start) / (end - start), so entries need not be pre-sorted.
 */
export const journeyRange = { start: "2021-12-01", end: "2025-05-31" };

export const journeyStartLabel = "DEC 2021";
export const journeyEndLabel = "MAY 2025";

/**
 * Palette is restricted to white and shades of the ribbon green — no other
 * hues. The two education bookends take white so they read as the anchors.
 */
export const journey = [
  { id: "j1", title: "B.E (ECE) - VCE", subtitle: "Course Begins", date: "2021-12-01", color: "#ffffff" },
  { id: "j2", title: "IETE", subtitle: "Student Member", date: "2022-03-01", color: "#39ff8f" },
  { id: "j3", title: "Writers Club", subtitle: "Club Member", date: "2022-08-01", color: "#7dffc0" },
  { id: "j4", title: "Cinematography", subtitle: "Club Member", date: "2022-11-01", color: "#12b5a5" },
  { id: "j5", title: "Newton's Apple Magazine", subtitle: "Graphic Designer", date: "2023-04-01", color: "#0bd977" },
  { id: "j6", title: "Photography", subtitle: "Club Member", date: "2023-08-01", color: "#b6ffd8" },
  { id: "j7", title: "ISRO (NRSC)", subtitle: "Project Intern", date: "2023-08-15", color: "#39ff8f" },
  { id: "j8", title: "SIH 2023", subtitle: "Hackathon Runners-Up", date: "2023-09-10", color: "#7dffc0" },
  { id: "j9", title: "Swayam Ed-Cell", subtitle: "Arts & Design Member", date: "2023-09-25", color: "#12b5a5" },
  { id: "j10", title: "GDSC", subtitle: "Design Coordinator", date: "2023-10-01", color: "#0bd977" },
  { id: "j11", title: "Acumen ECE'24", subtitle: "Design Member", date: "2024-04-05", color: "#b6ffd8" },
  { id: "j12", title: "Valotopia Tournament", subtitle: "Event Coordinator", date: "2024-04-20", color: "#39ff8f" },
  { id: "j13", title: "Swayam Ed-Cell", subtitle: "Head of Arts & Design", date: "2024-07-01", color: "#7dffc0" },
  { id: "j14", title: "IEEE Computer Society", subtitle: "Student Member", date: "2024-09-01", color: "#12b5a5" },
  { id: "j15", title: "Acumen ECE'25", subtitle: "Design Lead", date: "2025-04-12", color: "#0bd977" },
  { id: "j16", title: "Graduated", subtitle: "Class of 2025", date: "2025-05-31", color: "#ffffff" },
];

export const certificates = [
  { title: "Deep Learning", issuer: "Certified" },
  { title: "Embedded Systems", issuer: "Certified" },
  { title: "UI/UX & Design", issuer: "Certified" },
];

/**
 * Graphic design work pulled from real club/event activity — see the
 * matching roles in `journey` (Newton's Apple, GDSC, Swayam, Acumen ECE).
 * A spread across orgs rather than a deep dive into any one of them.
 */
export const showcaseDesigns = [
  // Note: `designStats` below reflects the full body of work across the
  // source folders (~140 pieces); this array is just the curated sample
  // shown/linked from the gallery, not the total.
  {
    index: "01",
    org: "Acumen ECE",
    title: "Valotopia Esports Banner",
    image: "/images/showcase/designs/valotopia-esports-banner.png",
  },
  {
    index: "02",
    org: "Newton's Apple Magazine",
    title: "Magazine Cover — Feb 2024 Edition",
    image: "/images/showcase/designs/newtons-apple-magazine-cover.png",
  },
  {
    index: "03",
    org: "Swayam Ed-Cell",
    title: "Brand Blend Event Banner",
    image: "/images/showcase/designs/swayam-brandblend-banner.png",
  },
  {
    index: "04",
    org: "GDSC",
    title: "Codeprint 1.0 Poster",
    image: "/images/showcase/designs/gdsc-codeprint-poster.png",
  },
  {
    index: "05",
    org: "Acumen ECE",
    title: "Acumen ECE'25 Merch Design",
    image: "/images/showcase/designs/acumen-ece-tshirt-design.png",
  },
  {
    index: "06",
    org: "Acumen ECE",
    title: "Design Lead ID Card",
    image: "/images/showcase/designs/acumen-ece-id-card-mockup.png",
  },
];

/**
 * Full body of design work across the source folders (Acumen ECE '23–'25,
 * GDSC, Newton's Apple Magazine, Swayam Ed-Cell) — counted directly from the
 * files, excluding personal ID cards/headshots and admin/financial docs.
 * `showcaseDesigns` above is only the curated sample, not this total.
 */
export const designStats = {
  total: "140+",
  orgs: 4,
  range: "2023–2025",
};

/**
 * Gaming showcase — intentionally empty until real games/stats are supplied.
 * Renders as placeholder tiles (see Showcase.tsx) rather than invented data.
 */
export const showcaseGames: {
  index: string;
  title: string;
  subtitle: string;
  image?: string;
}[] = [];

/** Real Steam profile identity — shown alongside the stats below. */
export const gamerProfile = {
  tag: "GHosT_5437",
  quote: "Ice in my veins, death in my sights.",
};

/** Real Steam-style stats. Account value is intentionally excluded. */
export const gamingStats = [
  { label: "Games Owned", value: "125", icon: "controller" },
  { label: "Hours Played", value: "4,927", icon: "clock" },
  { label: "Achievements", value: "2,037", icon: "medal" },
  { label: "Avg. Completion Rate", value: "78%", icon: "completion" },
] as const;
