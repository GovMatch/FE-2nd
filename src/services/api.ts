import {
  ApiProgramData,
  ApiProgramDetail,
  ProgramData,
  ProgramsResponse,
  MatchingRequest,
  MatchingResponse
} from '../types/api';

const getApiBaseUrl = (): string => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL이 설정되지 않았습니다.');
  }
  return apiBaseUrl;
};

export const transformApiData = (apiData: ApiProgramData): ProgramData => {
  // 지원금액 포맷팅
  let amount = "지원금액 미정";
  if (apiData.amountMin && apiData.amountMax) {
    amount = `${apiData.amountMin.toLocaleString()}원 ~ ${apiData.amountMax.toLocaleString()}원`;
  } else if (apiData.amountMax) {
    amount = `최대 ${apiData.amountMax.toLocaleString()}원`;
  } else if (apiData.amountMin) {
    amount = `최소 ${apiData.amountMin.toLocaleString()}원`;
  }

  // 마감일 포맷팅
  const deadline = apiData.deadline ? new Date(apiData.deadline).toLocaleDateString('ko-KR') : "마감일 미정";

  // 상태 결정
  let status: "deadline-soon" | "active" | "upcoming" | "closed" = "active";
  if (apiData.daysLeft <= 0) {
    status = "closed";
  } else if (apiData.daysLeft <= 3) {
    status = "deadline-soon";
  } else if (apiData.daysLeft > 30) {
    status = "upcoming";
  }

  return {
    id: apiData.id,
    title: apiData.title,
    organization: apiData.provider.name,
    category: apiData.categoryLabel,
    amount,
    deadline,
    daysLeft: apiData.daysLeft,
    description: apiData.description,
    requirements: apiData.tags || [],
    matchScore: apiData.matchScore,
    applicants: apiData.applicants || 0,
    maxApplicants: apiData.maxApplicants || 100,
    status,
    categoryCode: apiData.category
  };
};

export const formatAmount = (data: ApiProgramDetail): string => {
  if (data.amountMin && data.amountMax) {
    return `${data.amountMin.toLocaleString()}원 ~ ${data.amountMax.toLocaleString()}원`;
  } else if (data.amountMax) {
    return `최대 ${data.amountMax.toLocaleString()}원`;
  } else if (data.amountMin) {
    return `최소 ${data.amountMin.toLocaleString()}원`;
  }
  return "지원금액 정보 없음";
};

export const formatDeadline = (deadline: string): string => {
  if (deadline) {
    return new Date(deadline).toLocaleDateString('ko-KR');
  }
  return "마감일 정보 없음";
};

export const apiService = {
  async fetchPrograms(
    page = 1,
    limit = 6,
    sortBy = 'deadline',
    sortOrder = 'asc',
    category?: string
  ): Promise<ProgramsResponse> {
    const apiBaseUrl = getApiBaseUrl();

    let url = `${apiBaseUrl}/api/programs?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    if (category) {
      url += `&category=${category}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async fetchUrgentPrograms(): Promise<ApiProgramData[]> {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/api/programs/urgent`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async searchPrograms(searchTerm: string, limit = 50): Promise<ApiProgramData[]> {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(
      `${apiBaseUrl}/api/programs?search=${encodeURIComponent(searchTerm)}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.programs) ? data.programs : data;
  },

  async fetchProgramDetail(programId: string): Promise<ApiProgramDetail> {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/api/programs/${programId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async submitMatchingRequest(formData: MatchingRequest): Promise<MatchingResponse> {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/api/programs/matching`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
};