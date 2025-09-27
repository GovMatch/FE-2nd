import { imgIcRoundCall, imgEntypoShare } from "../imports/svg-x25l8";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { User, Settings, LogOut, Shield } from "lucide-react";
import type { PageType } from "./Router";
import { useAuth } from "./AuthContext";

interface HeaderProps {
  onNavigate: (page: PageType) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const { user, logout } = useAuth();
  
  const handleShare = (type: string) => {
    const url = window.location.href;
    const title = "정부지원사업 매칭 서비스";
    const text = "AI 기반 정부지원사업 매칭으로 최적의 지원사업을 찾아보세요!";

    switch (type) {
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          alert('URL이 클립보드에 복사되었습니다!');
        });
        break;
      case 'kakaotalk':
        if (window.Kakao) {
          window.Kakao.Share.sendDefault({
            objectType: 'web',
            url: url,
            title: title,
            description: text
          });
        } else {
          alert('카카오톡 SDK가 로드되지 않았습니다.');
        }
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <header className="relative z-20 px-2 sm:px-4 lg:px-8 py-3 sm:py-4">
      <div className="w-full lg:max-w-7xl lg:mx-auto">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="relative cursor-pointer" onClick={() => onNavigate('main')}>
            <div className="absolute bg-white/80 backdrop-blur-md left-0 rounded-[25px] sm:rounded-[35px] w-36 sm:w-48 h-16 sm:h-20 top-0 shadow-2xl border border-white/30 transition-all duration-200 hover:shadow-3xl hover:scale-105" />
            <div className="relative px-4 sm:px-8 py-2 sm:py-4 text-base sm:text-lg font-bold text-gray-800 z-10">
              <p className="leading-tight mb-0 text-gray-800">정부지원사업</p>
              <p className="leading-tight">
                <span className="text-gray-800">매칭</span>
                <span className="bg-gradient-to-r from-[#58d674] to-[#45c762] bg-clip-text text-transparent">.</span>
              </p>
            </div>
          </div>

          {/* Navigation Links - 모바일에서 숨김 */}
          <div className="hidden md:flex items-center space-x-8">
            <NavItem label="지원사업" active onClick={() => onNavigate('main')} />
            <NavItem label="매칭하기" onClick={() => onNavigate('matching')} />
            <NavItem label="이용가이드" onClick={() => onNavigate('guide')} />
          </div>

          {/* Action Icons */}
          <div className="flex items-center">
            {/* User Menu */}
            <div className="relative">
              <div className="absolute bg-gradient-to-br from-[#58d674]/20 to-[#45c762]/10 backdrop-blur-md rounded-[20px] sm:rounded-[25px] w-16 sm:w-24 h-16 sm:h-24 top-0 left-0 shadow-xl border border-white/30" />
              <div className="relative w-16 sm:w-24 h-16 sm:h-24 flex items-center justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1.5 sm:p-2 hover:bg-[#58d674]/20 rounded-[15px] transition-all duration-200 hover:scale-110">
                      <User className="size-4 sm:size-5 text-[#58d674]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white/90 backdrop-blur-md border-0 shadow-2xl rounded-[20px]">
                    {user ? (
                      <>
                        <div className="px-3 py-2 text-sm font-medium text-gray-900 border-b border-gray-200/50 rounded-t-[20px] bg-[#58d674]/5">
                          {user.name}
                        </div>
                        <DropdownMenuItem onClick={() => onNavigate('mypage')} className="rounded-[12px] hover:bg-[#58d674]/10">
                          <User className="mr-2 h-4 w-4" />
                          마이페이지
                        </DropdownMenuItem>
                        {user.role === 'admin' && (
                          <DropdownMenuItem onClick={() => onNavigate('admin')} className="rounded-[12px] hover:bg-[#58d674]/10">
                            <Shield className="mr-2 h-4 w-4" />
                            관리자 페이지
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-gray-200/50" />
                        <DropdownMenuItem onClick={logout} className="rounded-[12px] hover:bg-red-50 text-red-600">
                          <LogOut className="mr-2 h-4 w-4" />
                          로그아웃
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem onClick={() => onNavigate('login')} className="rounded-[12px] hover:bg-[#58d674]/10">
                          <Settings className="mr-2 h-4 w-4" />
                          로그인
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onNavigate('signup')} className="rounded-[12px] hover:bg-[#58d674]/10">
                          <User className="mr-2 h-4 w-4" />
                          회원가입
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

function NavItem({ label, active = false, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <div className="relative">
      <div className="absolute bg-white/80 backdrop-blur-md rounded-[20px] w-28 h-16 top-0 left-1/2 transform -translate-x-1/2 shadow-lg border border-white/30" />
      <div className="relative px-5 py-3 text-center">
        <Button 
          variant="ghost" 
          onClick={onClick}
          className={`text-sm font-medium p-2 h-auto rounded-[15px] transition-all duration-200 ${
            active 
              ? 'text-[#58d674] bg-[#58d674]/10 shadow-lg transform scale-105' 
              : 'text-gray-600 hover:text-[#58d674] hover:bg-[#58d674]/5 hover:scale-105'
          }`}
        >
          {label}
        </Button>
      </div>
    </div>
  );
}