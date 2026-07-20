export interface AnalysisItem {
  id: string;
  image: string; // Base64 data URL
  result: string; // Markdown output from AI
  timestamp: string; // ISO String or local date string
  mimeType: string;
  fileSize: string; // e.g., "1.2 MB"
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface UseCaseItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  exampleImage: string;
}
