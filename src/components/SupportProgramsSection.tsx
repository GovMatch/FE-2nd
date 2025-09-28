import { SupportProgramCard } from "./SupportProgramCard";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Grid3X3, List, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService, transformApiData } from "../services/api";
import { ProgramData } from "../types/api";

interface SupportProgramsSectionProps {
  onNavigate?: (page: string, programId?: string) => void;
  isUrgentFilter?: boolean;
  searchTerm?: string;
}

export function SupportProgramsSection({ onNavigate, isUrgentFilter = false, searchTerm = "" }: SupportProgramsSectionProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchPrograms = async (page: number = 1, urgent: boolean = false, search: string = "") => {
    try {
      setLoading(true);
      setError(null);

      if (search) {
        // 검색 API 호출
        const searchResults = await apiService.searchPrograms(search);
        const transformedPrograms = searchResults.map(transformApiData);
        setPrograms(transformedPrograms);
        setCurrentPage(1);
        setTotalPages(1);
        setHasNext(false);
        setHasPrev(false);
        setTotal(transformedPrograms.length);
      } else if (urgent) {
        const urgentResponse = await apiService.fetchUrgentPrograms(page, 6);
        const transformedPrograms = urgentResponse.programs.map(transformApiData);
        setPrograms(transformedPrograms);
        setCurrentPage(urgentResponse.page);
        setTotalPages(urgentResponse.totalPages);
        setHasNext(urgentResponse.hasNext);
        setHasPrev(urgentResponse.hasPrev);
        setTotal(urgentResponse.total);
      } else {
        const response = await apiService.fetchPrograms(page, 6);
        const transformedPrograms = response.programs.map(transformApiData);
        setPrograms(transformedPrograms);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
        setHasNext(response.hasNext);
        setHasPrev(response.hasPrev);
        setTotal(response.total);
      }
    } catch (err) {
      console.error('Failed to fetch programs:', err);
      let errorMessage = '지원사업 데이터 불러오기에 실패했습니다.';

      if (err instanceof Error) {
        if (err.message.includes('HTTP error! status:')) {
          const statusCode = err.message.match(/status: (\d+)/)?.[1];
          errorMessage += ` (오류 코드: ${statusCode})`;
        } else {
          errorMessage += ` (${err.message})`;
        }
      }

      setError(errorMessage);
      setPrograms([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms(1, isUrgentFilter, searchTerm);
  }, [isUrgentFilter, searchTerm]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchPrograms(page, isUrgentFilter, searchTerm);
    }
  };


  return (
    <section className="py-4 sm:py-6 lg:py-8 px-2 sm:px-4 lg:px-8">
      <div className="w-full lg:max-w-7xl lg:mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              {searchTerm ? `"${searchTerm}" 검색 결과` : "매칭 가능한 정부지원사업"}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {loading ? (
                searchTerm ? "검색 중..." : "지원사업을 불러오는 중..."
              ) : error ? (
                <span className="text-red-600">{error}</span>
              ) : (
                <>
                  총 <span className="font-bold text-[#58d674]">{total.toLocaleString()}개</span>의 지원사업이 {searchTerm ? "검색되었습니다" : "매칭되었습니다"}
                </>
              )}
            </p>
          </div>

          {/* View Controls - 모바일에서는 숨김 */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="px-3"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#58d674]" />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-red-500 text-lg font-medium mb-4">
              {error}
            </div>
            <Button
              onClick={() => fetchPrograms(1)}
              className="bg-[#58d674] hover:bg-[#4bc961] text-white"
            >
              다시 시도
            </Button>
          </div>
        )}

        {/* Programs Grid */}
        {!loading && !error && programs.length > 0 && (
          <div className={`grid gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 ${
            viewMode === "grid"
              ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1"
          }`}>
            {programs.map((program) => (
              <SupportProgramCard key={program.id} {...program} onNavigate={onNavigate} />
            ))}
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && programs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-gray-500 text-lg font-medium">
              현재 매칭되는 지원사업이 없습니다.
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              className="px-2 sm:px-3 text-xs sm:text-sm h-8 sm:h-9"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrev}
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">이전</span>
            </Button>

            <div className="flex items-center gap-1 sm:gap-2">
              {(() => {
                const startPage = Math.max(1, currentPage - 2);
                const endPage = Math.min(totalPages, startPage + 4);
                const pages = [];

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
                }

                return pages.map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    className="w-6 h-6 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ));
              })()}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="px-2 sm:px-3 text-xs sm:text-sm h-8 sm:h-9"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
            >
              <span className="hidden sm:inline">다음</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}