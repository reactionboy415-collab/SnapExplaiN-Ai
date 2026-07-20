import { FAQItem, UseCaseItem } from "./types";

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How does SnapExplaiN AI work?",
    answer: "Our system combines edge-optimized image ingestion with a secure, rate-limited backend proxy to deliver high-performance visual reasoning. It analyzes textures, colors, shapes, typography, and layout of any image to generate rich, context-aware breakdowns instantly."
  },
  {
    question: "Do I need to select a category before uploading?",
    answer: "No. SnapExplaiN AI is built for frictionless utility. Our multimodal AI model handles everything automatically, whether it is a handwritten recipe, an electronic circuit, a complex bill, or a dashboard warning light."
  },
  {
    question: "Is my personal data secure?",
    answer: "Absolutely. Images are validated and proxy-routed server-side. We do not store your images or personal data on our servers. Your local analysis history remains entirely sandboxed within your browser's private localStorage."
  },
  {
    question: "What are the upload limitations?",
    answer: "To ensure fast response times and avoid bandwidth congestion, the secure upload validator permits JPEG, PNG, WEBP, and GIF formats up to 10MB in file size."
  },
  {
    question: "Does it support mobile camera capture?",
    answer: "Yes, SnapExplaiN AI is fully responsive. On any mobile browser, clicking the upload area launches your phone's native camera or image gallery, letting you snap and explain on the go."
  },
  {
    question: "What is the cost of SnapExplaiN AI?",
    answer: "SnapExplaiN AI is currently in active development for hackathon showcase and beta testing. It is 100% free with intelligent rate limits (5 requests per minute, 30 per day) to prevent system abuse."
  }
];

export const USE_CASES: UseCaseItem[] = [
  {
    id: "docs",
    title: "Official Documents & Bills",
    description: "Translate complex legal clauses, extract details from government letters, or breakdown line-item charges from bills and invoices.",
    iconName: "FileText",
    exampleImage: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "medical",
    title: "Prescriptions & Labels",
    description: "Decipher medication bottles, look up dietary alerts on food packaging, or extract dosage instructions from medical forms.",
    iconName: "Pill",
    exampleImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "tech",
    title: "Electronics & Warning Lights",
    description: "Decode obscure car dashboard warning lights, recognize active electronic hardware ports, or parse system error screenshots.",
    iconName: "Cpu",
    exampleImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "edu",
    title: "Homework & Charts",
    description: "Analyze complex math diagrams, scientific graphs, chemical equations, or get structured historical summaries from public monuments.",
    iconName: "GraduationCap",
    exampleImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "nature",
    title: "Flora, Fauna & Objects",
    description: "Identify garden plants, specify household repair tools, or find details about retro collectibles in second-hand markets.",
    iconName: "Leaf",
    exampleImage: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format&fit=crop&q=80"
  }
];
