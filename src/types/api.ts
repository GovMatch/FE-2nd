export interface ApiProgramData {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  target: string;
  amountMin: number | null;
  amountMax: number | null;
  supportRate: number | null;
  region: string | null;
  deadline: string;
  daysLeft: number;
  applicationUrl: string;
  attachmentUrl: string | null;
  tags: string[];
  provider: {
    id: string;
    name: string;
    type: string;
    contact: string;
    website: string | null;
  };
  createdAt: string;
  // 프론트엔드에서 계산되는 필드들
  organization?: string;
  amount?: string;
  requirements?: string[];
  matchScore?: number;
  applicants?: number;
  maxApplicants?: number;
  status?: "deadline-soon" | "active" | "upcoming" | "closed";
}

export interface ProgramsResponse {
  programs: ApiProgramData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiProgramDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  target: string;
  amountMin: number | null;
  amountMax: number | null;
  supportRate: number | null;
  region: string | null;
  deadline: string;
  daysLeft: number;
  applicationUrl: string;
  attachmentUrl: string | null;
  tags: string[];
  provider: {
    id: string;
    name: string;
    type: string;
    contact: string;
    website: string | null;
  };
  createdAt: string;
}

export interface ProgramData {
  id: string;
  title: string;
  organization: string;
  category: string;
  amount: string;
  deadline: string;
  daysLeft: number;
  description: string;
  requirements: string[];
  matchScore?: number;
  applicants: number;
  maxApplicants: number;
  status: "deadline-soon" | "active" | "upcoming";
  categoryCode?: string;
}

export interface MatchingRequest {
  companyName: string;
  businessType: string;
  businessPurpose: string;
  employees: string;
  annualRevenue: string;
  establishedYear: string;
  region: string;
  targetPrograms: string[];
  urgency: string;
  voucherInterest: string[];
}

export interface MatchingResponse {
  matchedPrograms: ApiProgramData[];
  matchingScore: number;
  recommendations: string[];
}

export const categoryOptions = [
  { id: "01", label: "금융" },
  { id: "02", label: "기술" },
  { id: "03", label: "인력" },
  { id: "04", label: "수출" },
  { id: "05", label: "내수" },
  { id: "06", label: "창업" },
  { id: "07", label: "경영" },
  { id: "09", label: "기타" }
];