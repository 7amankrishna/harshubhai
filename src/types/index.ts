export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  caption: string;
  imageUrl: string;
  tag: string;
  location?: string;
  likes: number;
  highlight?: string;
}

export interface QuestionData {
  text: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
  acceptsFreeText?: boolean;
  freeTextKeywords?: string[];
}

export interface BirthdayLetter {
  greeting: string;
  paragraphs: string[];
  highlightQuote: string;
  closing: string;
  sender: string;
  postScript?: string;
}

export interface SurpriseConfig {
  recipientName: string;
  nickname: string;
  passwords: string[]; // support multiple aliases like "harshu", "harshita", "1234", "birthday"
  passwordHint: string;
  puzzleImage: string;
  puzzleGridSize: number; // 3 = 3x3 (9 pieces), 2 = 2x2 (4 pieces)
  question: QuestionData;
  birthdayHeadline: string;
  birthdayQuote: string;
  birthdayLetter: BirthdayLetter;
  memories: MemoryItem[];
  bgMusicUrl?: string;
  themeColor: 'purple' | 'pink' | 'rose' | 'amber';
}

export type ExperienceStage = 
  | 'password' 
  | 'puzzle' 
  | 'question' 
  | 'reveal' 
  | 'memories' 
  | 'letter';
