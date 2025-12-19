export enum Company {
  WEBBED = 'Webbed',
  SENESENSE = 'Senesense Solutions',
  TECHKNOTS = 'Techknots'
}

export interface SubmissionPayload {
  company: Company;
  teamName: string;
  file: File;
  aiTags?: string[];
  aiSummary?: string;
  timestamp: string;
}

export interface AIAnalysisResult {
  tags: string[];
  summary: string;
  safetyScore: number;
}