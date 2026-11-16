forEach(b => {
                    b.classList.remove('active', 'border-2', 'border-brand-600', 'bg-brand-50', 'font-bold', 'text-brand-700');
                    b.classList.add('border', 'border-slate-200', 'bg-white', 'font-semibold', 'text-slate-600');
                });
                btn.classList.remove('border', 'border-slate-200', 'bg-white', 'font-semibold', 'text-slate-600');
                btn.classList.add('active', 'border-2', 'border-brand-600', 'bg-brand-50', 'font-bold', 'text-brand-700');
                state.companion = btn.dataset.val;
            });
        });<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>AI 여행 일정 플래너</title>
    <!-- Tailwind CSS 로드 -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts: Pretendard / Noto Sans KR / Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Lucide Icons (깔끔한 UI 아이콘) -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Noto Sans KR"', 'Inter', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            50: '#eff6ff',
                            100: '#dbeafe',
                            500: '#3b82f6',
                            600: '#2563eb',
                            700: '#1d4ed8',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        /* 모바일 터치 하이라이트 제거 및 부드러운 스크롤 */
        * {
            -webkit-tap-highlight-color: transparent;
        }
        body {
            background-color: #f8fafc;
            color: #0f172a;
        }
        /* 커스텀 스크롤바 숨김 (모바일 가로 스크롤용) */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        /* 카드 등장 애니메이션 */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(16px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.4s ease-out forwards;
        }
    </style>
</head>
<body class="antialiased min-h-screen flex flex-col items-center">

    <!-- 모바일 앱 컨테이너 (최대 너비 제한으로 데스크탑에서도 앱처럼 보임) -->
    <div class="w-full max-w-md bg-white min-h-screen shadow-sm sm:shadow-xl sm:my-4 sm:rounded-3xl sm:min-h-[850px] flex flex-col overflow-hidden relative">
        
        <!-- 상단 헤더 -->
        <header class="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
                    <i data-lucide="compass" class="w-5 h-5"></i>
                </div>
                <div>
                    <h1 class="text-lg font-bold tracking-tight text-slate-900 leading-tight">트립메이커 AI</h1>
                    <p class="text-[11px] text-slate-500 font-medium">나만의 맞춤형 여행 코스</p>
                </div>
            </div>
            <!-- API 상태 뱃지 -->
            <span id="api-status-badge" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                데모 모드
            </span>
        </header>

        <!-- 메인 컨텐츠 영역 -->
        <main class="flex-1 px-5 py-6 space-y-7 overflow-y-auto pb-24">
            
            <!-- 입력 폼 섹션 -->
            <section id="planner-form-section" class="space-y-5">
                <!-- 1. 여행지 입력 -->
                <div class="space-y-2">
                    <label for="destination" class="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                        <i data-lucide="map-pin" class="w-4 h-4 text-brand-600"></i>
                        어디로 떠나시나요?
                    </label>
                    <div class="relative">
                        <input type="text" id="destination" placeholder="예: 제주도, 도쿄, 강릉, 파리" 
                            class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all">
                        <button type="button" id="clear-dest-btn" class="hidden absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                            <i data-lucide="x-circle" class="w-4 h-4"></i>
                        </button>
                    </div>
                    <!-- 인기 여행지 빠른 선택 칩 -->
                    <div class="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
                        <button type="button" class="quick-dest-btn shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-xs font-medium text-slate-600 transition-colors" data-val="제주도">🌴 제주도</button>
                        <button type="button" class="quick-dest-btn shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-xs font-medium text-slate-600 transition-colors" data-val="강릉">🌊 강릉</button>
                        <button type="button" class="quick-dest-btn shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-xs font-medium text-slate-600 transition-colors" data-val="도쿄">🗼 도쿄</button>
                        <button type="button" class="quick-dest-btn shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-xs font-medium text-slate-600 transition-colors" data-val="오사카">🍜 오사카</button>
                        <button type="button" class="quick-dest-btn shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-xs font-medium text-slate-600 transition-colors" data-val="경주">🏛️ 경주</button>
                    </div>
                </div>

                <!-- 2. 여행 기간 선택 -->
                <div class="space-y-2">
                    <label class="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                        <i data-lucide="calendar" class="w-4 h-4 text-brand-600"></i>
                        얼마나 머무르시나요?
                    </label>
                    <div class="grid grid-cols-4 gap-2" id="duration-group">
                        <button type="button" data-days="1" class="duration-btn py-3 px-2 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">당일치기</button>
                        <button type="button" data-days="2" class="duration-btn py-3 px-2 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">1박 2일</button>
                        <button type="button" data-days="3" class="duration-btn active py-3 px-2 rounded-2xl border-2 border-brand-600 bg-brand-50 text-xs font-bold text-brand-700 transition-all">2박 3일</button>
                        <button type="button" data-days="4" class="duration-btn py-3 px-2 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">3박 4일</button>
                    </div>
                </div>

                <!-- 3. 동행자 선택 -->
                <div class="space-y-2">
                    <label class="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                        <i data-lucide="users" class="w-4 h-4 text-brand-600"></i>
                        누구와 함께 가시나요?
                    </label>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2" id="companion-group">
                        <button type="button" data-val="혼자" class="companion-btn py-3 px-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition-all">
                            <span>🎒</span> 혼자서
                        </button>
                        <button type="button" data-val="연인" class="companion-btn active py-3 px-3 rounded-2xl border-2 border-brand-600 bg-brand-50 text-xs font-bold text-brand-700 flex items-center justify-center gap-1.5 transition-all">
                            <span>💑</span> 연인과
                        </button>
                        <button type="button" data-val="친구" class="companion-btn py-3 px-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition-all">
                            <span>👯</span> 친구들과
                        </button>
                        <button type="button" data-val="가족" class="companion-btn py-3 px-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition-all">
                            <span>👨‍👩‍👧‍👦</span> 가족과
                        </button>
                        <button type="button" data-val="부모님" class="companion-btn py-3 px-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition-all">
                            <span>💐</span> 부모님과
                        </button>
                        <button type="button" data-val="아이와" class="companion-btn py-3 px-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition-all">
                            <span>🧸</span> 아이와
                        </button>
                    </div>
                </div>

                <!-- 4. 관심사 / 테마 (다중 선택 가능) -->
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <label class="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                            <i data-lucide="sparkles" class="w-4 h-4 text-brand-600"></i>
                            어떤 여행을 원하시나요?
                        </label>
                        <span class="text-[11px] text-slate-400">중복 선택 가능</span>
                    </div>
                    <div class="flex flex-wrap gap-2" id="interest-group">
                        <button type="button" data-val="맛집 탐방" class="interest-btn active px-3.5 py-2.5 rounded-2xl border-2 border-brand-600 bg-brand-50 text-xs font-bold text-brand-700 transition-all">🍽️ 맛집 탐방</button>
                        <button type="button" data-val="카페 투어" class="interest-btn px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 transition-all">☕ 카페 투어</button>
                        <button type="button" data-val="자연/힐링" class="interest-btn active px-3.5 py-2.5 rounded-2xl border-2 border-brand-600 bg-brand-50 text-xs font-bold text-brand-700 transition-all">🌿 자연/힐링</button>
                        <button type="button" data-val="인생샷/포토" class="interest-btn px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 transition-all">📸 인생샷/포토</button>
                        <button type="button" data-val="액티비티" class="interest-btn px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 transition-all">🏄 액티비티</button>
                        <button type="button" data-val="역사/문화" class="interest-btn px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 transition-all">🎨 역사/문화</button>
                        <button type="button" data-val="쇼핑" class="interest-btn px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 transition-all">🛍️ 쇼핑</button>
                    </div>
                </div>

                <!-- 일정 생성 버튼 -->
                <div class="pt-2">
                    <button type="button" id="generate-btn" class="w-full py-4 px-6 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-bold text-base rounded-2xl shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2 transition-all">
                        <i data-lucide="wand-2" class="w-5 h-5"></i>
                        <span>맞춤 여행 일정 만들기</span>
                    </button>
                </div>
            </section>

            <!-- 로딩 상태 UI (숨김 처리됨) -->
            <section id="loading-section" class="hidden py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div class="relative w-16 h-16 flex items-center justify-center">
                    <div class="absolute inset-0 rounded-full border-4 border-brand-100"></div>
                    <div class="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
                    <i data-lucide="plane" class="w-6 h-6 text-brand-600 animate-pulse"></i>
                </div>
                <div class="space-y-1">
                    <h3 class="text-base font-bold text-slate-900" id="loading-title">최적의 동선을 계산하고 있어요</h3>
                    <p class="text-xs text-slate-500">AI가 취향에 딱 맞는 장소들을 고르는 중입니다...</p>
                </div>
            </section>

            <!-- 결과 영역 (일정 카드 리스트) -->
            <section id="result-section" class="hidden space-y-5 pt-2 border-t border-slate-100">
                <!-- 결과 요약 헤더 -->
                <div class="bg-slate-900 text-white p-5 rounded-3xl shadow-md space-y-3">
                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <span id="result-badge" class="inline-block px-2.5 py-0.5 rounded-lg bg-white/15 text-brand-100 text-[11px] font-semibold mb-1.5">
                                예시 일정 (API 연동 대기중)
                            </span>
                            <h2 id="result-title" class="text-xl font-bold tracking-tight">제주도 2박 3일 여행</h2>
                        </div>
                        <button type="button" id="copy-plan-btn" class="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors" title="일정 텍스트 복사">
                            <i data-lucide="copy" class="w-4 h-4"></i>
                        </button>
                    </div>
                    <p id="result-subtitle" class="text-xs text-slate-300 leading-relaxed">
                        연인과 함께하는 맛집 탐방 & 자연/힐링 중심의 추천 코스입니다.
                    </p>
                </div>

                <!-- Day 탭 네비게이션 (일차가 많을 때 빠르게 이동) -->
                <div id="day-tabs" class="flex gap-2 overflow-x-auto no-scrollbar py-1 sticky top-[68px] z-10 bg-white/95 backdrop-blur-sm">
                    <!-- JS로 동적 생성 -->
                </div>

                <!-- 하루별 일정 카드 컨테이너 -->
                <div id="itinerary-cards" class="space-y-5">
                    <!-- JS로 동적 생성 -->
                </div>

                <!-- 다시 짜기 버튼 -->
                <div class="pt-4">
                    <button type="button" id="reset-scroll-btn" class="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors">
                        <i data-lucide="sliders-horizontal" class="w-4 h-4"></i>
                        <span>조건 수정해서 다시 만들기</span>
                    </button>
                </div>
            </section>

        </main>

        <!-- 커스텀 토스트 메시지 (alert 대체용) -->
        <div id="toast-message" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-0 transition-all duration-300 translate-y-4">
            <div class="bg-slate-800/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-medium flex items-center gap-2 whitespace-nowrap">
                <i data-lucide="info" class="w-4 h-4 text-brand-400 shrink-0"></i>
                <span id="toast-text">알림 메시지</span>
            </div>
        </div>
    </div>

    <script>
        // 아이콘 초기화
        lucide.createIcons();

        // ==========================================
        // 1. 상태 관리 (State)
        // ==========================================
        const state = {
            destination: '',
            days: 3, // 기본 2박 3일 (3일 일정)
            companion: '연인',
            interests: ['맛집 탐방', '자연/힐링']
        };

        // ==========================================
        // 2. DOM 요소 참조
        // ==========================================
        const destInput = document.getElementById('destination');
        const clearDestBtn = document.getElementById('clear-dest-btn');
        const quickDestBtns = document.querySelectorAll('.quick-dest-btn');
        const durationBtns = document.querySelectorAll('.duration-btn');
        const companionBtns = document.querySelectorAll('.companion-btn');
        const interestBtns = document.querySelectorAll('.interest-btn');
        const generateBtn = document.getElementById('generate-btn');
        
        const loadingSection = document.getElementById('loading-section');
        const loadingTitle = document.getElementById('loading-title');
        const resultSection = document.getElementById('result-section');
        const resultBadge = document.getElementById('result-badge');
        const resultTitle = document.getElementById('result-title');
        const resultSubtitle = document.getElementById('result-subtitle');
        const dayTabs = document.getElementById('day-tabs');
        const itineraryCards = document.getElementById('itinerary-cards');
        const copyPlanBtn = document.getElementById('copy-plan-btn');
        const resetScrollBtn = document.getElementById('reset-scroll-btn');
        const apiStatusBadge = document.getElementById('api-status-badge');

        // ==========================================
        // 3. UI 인터랙션 및 이벤트 리스너
        // ==========================================
        
        // 토스트 알림 함수 (alert 대신 사용)
        let toastTimeout;
        function showToast(message) {
            const toast = document.getElementById('toast-message');
            const toastText = document.getElementById('toast-text');
            toastText.textContent = message;
            
            toast.classList.remove('opacity-0', 'translate-y-4');
            toast.classList.add('opacity-100', 'translate-y-0');
            
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.remove('opacity-100', 'translate-y-0');
                toast.classList.add('opacity-0', 'translate-y-4');
            }, 2800);
        }

        // 여행지 입력 감지 및 지우기 버튼
        destInput.addEventListener('input', (e) => {
            state.destination = e.target.value.trim();
            if (state.destination.length > 0) {
                clearDestBtn.classList.remove('hidden');
            } else {
                clearDestBtn.classList.add('hidden');
            }
        });

        clearDestBtn.addEventListener('click', () => {
            destInput.value = '';
            state.destination = '';
            clearDestBtn.classList.add('hidden');
            destInput.focus();
        });

        // 빠른 여행지 선택 칩
        quickDestBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.dataset.val;
                destInput.value = val;
                state.destination = val;
                clearDestBtn.classList.remove('hidden');
            });
        });

        // 기간 선택 (단일 선택)
        durationBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                durationBtns.forEach(b => {
                    b.classList.remove('active', 'border-2', 'border-brand-600', 'bg-brand-50', 'font-bold', 'text-brand-700');
                    b.classList.add('border', 'border-slate-200', 'bg-white', 'font-semibold', 'text-slate-600');
                });
                btn.classList.remove('border', 'border-slate-200', 'bg-white', 'font-semibold', 'text-slate-600');
                btn.classList.add('active', 'border-2', 'border-brand-600', 'bg-brand-50', 'font-bold', 'text-brand-700');
                state.days = parseInt(btn.dataset.days, 10);
            });
        });

        // 동행자 선택 (단일 선택)
        companionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                companionBtns.

        // 관심사 선택 (다중 선택)
        interestBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.dataset.val;
                const isSelected = state.interests.includes(val);

                if (isSelected) {
                    if (state.interests.length === 1) {
                        showToast('최소 1개 이상의 관심사를 선택해주세요.');
                        return;
                    }
                    state.interests = state.interests.filter(item => item !== val);
                    btn.classList.remove('active', 'border-2', 'border-brand-600', 'bg-brand-50', 'font-bold', 'text-brand-700');
                    btn.classList.add('border', 'border-slate-200', 'bg-white', 'font-semibold', 'text-slate-600');
                } else {
                    state.interests.push(val);
                    btn.classList.remove('border', 'border-slate-200', 'bg-white', 'font-semibold', 'text-slate-600');
                    btn.classList.add('active', 'border-2', 'border-brand-600', 'bg-brand-50', 'font-bold', 'text-brand-700');
                }
            });
        });

        // 상단으로 스크롤 이동
        resetScrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            destInput.focus();
        });

        // ==========================================
        // 4. API 연동 및 예시 데이터 생성 로직
        // ==========================================

        /**
         * Vercel 함수 (/api/plan) 호출 및 폴백(Fallback) 처리
         * 추후 /api/plan 을 구현하실 때 아래 JSON 스키마 형태로 응답을 내려주시면 바로 연동됩니다!
         * 
         * 기대하는 응답 JSON 구조:
         * {
         *   "summary": "여행 한 줄 요약",
         *   "itinerary": [
         *     {
         *       "day": 1,
         *       "theme": "1일차 테마 제목",
         *       "schedule": [
         *         {
         *           "time": "10:30",
         *           "place": "장소명",
         *           "category": "관광 | 식사 | 카페 | 휴식",
         *           "description": "활동 설명 및 팁"
         *         }
         *       ]
         *     }
         *   ]
         * }
         */
        async function fetchTravelPlan(payload) {
            try {
                // Vercel Serverless Function 호출 시도
                const response = await fetch('/api/plan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                // 함수가 아직 배포되지 않았거나(404) 게이트웨이 오류인 경우 폴백(예시 데이터)으로 이동
                if (response.status === 404) {
                    throw new Error('API 엔드포인트가 아직 없습니다 (404)');
                }

                // 서버가 JSON 응답을 내려준 경우 파싱
                const data = await response.json();

                // 400(가드레일 차단 등) 또는 500 에러이면서 서버가 명확한 error 메시지를 보낸 경우
                if (!response.ok) {
                    updateApiStatusBadge(true);
                    return {
                        isError: true,
                        errorMessage: data.error || `요청을 처리할 수 없습니다. (${response.status})`
                    };
                }
                
                // 실제 API 연동 성공 시 상단 뱃지 업데이트
                updateApiStatusBadge(true);
                return { isMock: false, data };

            } catch (error) {
                console.warn('[/api/plan] 호출 실패 (아직 함수가 없거나 로컬 환경임). 예시 일정을 생성합니다:', error.message);
                
                // 자연스러운 로딩 경험을 위한 짧은 지연 (0.8초)
                await new Promise(resolve => setTimeout(resolve, 800));
                
                updateApiStatusBadge(false);
                const mockData = generateMockItinerary(payload);
                return { isMock: true, data: mockData };
            }
        }

        function updateApiStatusBadge(isConnected) {
            if (isConnected) {
                apiStatusBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60';
                apiStatusBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Gemini 연동됨';
            } else {
                apiStatusBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60';
                apiStatusBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>예시 데이터';
            }
        }

        // 입력값에 맞춰 그럴듯한 예시 일정을 동적으로 조립하는 함수
        function generateMockItinerary({ destination, days, companion, interests }) {
            const mainInterest = interests[0] || '맛집 탐방';
            const subInterest = interests[1] || interests[0] || '힐링';

            // 제주도 특화 예시 vs 범용 여행지 예시
            const isJeju = destination.includes('제주');
            
            const dayTemplates = [
                {
                    theme: isJeju ? '에메랄드빛 애월 해안과 감성 카페' : `${destination} 핵심 랜드마크와 로컬 미식`,
                    schedule: [
                        {
                            time: '10:30',
                            place: isJeju ? '제주 국제공항 도착 및 렌터카 픽업' : `${destination}역 / 터미널 도착`,
                            category: '이동',
                            description: `설레는 ${destination} 여행의 시작! 짐을 정리하고 첫 번째 코스로 이동합니다.`
                        },
                        {
                            time: '12:00',
                            place: isJeju ? '애월 해안도로 오션뷰 식당' : `${destination} 대표 로컬 맛집`,
                            category: '식사',
                            description: `${companion}과 함께 즐기기 좋은 현지 특산 요리로 든든하게 점심 식사를 합니다.`
                        },
                        {
                            time: '14:00',
                            place: isJeju ? '한담해안산책로 & 감성 카페' : `${destination} 시그니처 뷰 카페`,
                            category: '카페',
                            description: `${subInterest} 취향을 저격하는 공간에서 시그니처 음료와 디저트를 맛보며 여유를 즐겨보세요.`
                        },
                        {
                            time: '16:30',
                            place: isJeju ? '새별오름 억새밭 산책' : `${destination} 대표 명소 산책`,
                            category: '관광',
                            description: `노을이 지기 시작하는 시간대에 방문하면 인생샷을 남기기에 가장 좋습니다.`
                        },
                        {
                            time: '19:00',
                            place: isJeju ? '근고기 흑돼지 전문점' : `${destination} 야경 명소 & 저녁 식사`,
                            category: '식사',
                            description: `하루의 피로를 풀어주는 맛있는 저녁 식사와 함께 ${companion}과 도란도란 이야기를 나눕니다.`
                        }
                    ]
                },
                {
                    theme: isJeju ? '푸른 숲길 힐링과 동쪽 바다 투어' : `깊이 있는 ${mainInterest} & 로컬 골목 탐험`,
                    schedule: [
                        {
                            time: '09:30',
                            place: isJeju ? '사려니숲길 피톤치드 산책' : `${destination} 아침 산책 공원`,
                            category: '관광',
                            description: `상쾌한 아침 공기를 마시며 가볍게 걷기 좋은 코스입니다. 편한 신발을 추천해요.`
                        },
                        {
                            time: '12:00',
                            place: isJeju ? '성산 해녀의 집 전복죽 & 해물' : `${destination} 숨은 골목 인기 식당`,
                            category: '식사',
                            description: `웨이팅이 있을 수 있으니 점심 피크 시간보다 조금 일찍 방문하는 것을 추천합니다.`
                        },
                        {
                            time: '14:30',
                            place: isJeju ? '섭지코지 & 아쿠아플라넷 인근 해변' : `${destination} 문화/테마 스팟`,
                            category: '관광',
                            description: `${interests.join(', ')} 테마에 딱 맞는 코스로, 볼거리와 즐길 거리가 가득합니다.`
                        },
                        {
                            time: '17:00',
                            place: isJeju ? '월정리 해변 로스터리 카페' : `${destination} 루프탑 / 테라스 카페`,
                            category: '카페',
                            description: `잠시 다리를 쉬어가며 여행 중 찍은 사진들을 정리하는 시간을 가져보세요.`
                        },
                        {
                            time: '19:30',
                            place: isJeju ? '동문재래시장 야시장 투어' : `${destination} 야시장 & 로컬 펍`,
                            category: '식사',
                            description: `다양한 길거리 음식과 현지 분위기를 생생하게 느낄 수 있는 활기찬 저녁 코스입니다.`
                        }
                    ]
                },
                {
                    theme: isJeju ? '여유로운 브런치와 기념품 쇼핑' : `아쉬움을 달래는 기념품 쇼핑 & 브런치`,
                    schedule: [
                        {
                            time: '10:30',
                            place: isJeju ? '조천읍 숲속 브런치 카페' : `${destination} 인기 브런치 카페`,
                            category: '식사',
                            description: `마지막 날 아침은 조금 여유롭게 일어나 신선한 재료로 만든 브런치로 시작합니다.`
                        },
                        {
                            time: '13:00',
                            place: isJeju ? '제주시 소품샵 & 기념품 거리' : `${destination} 로컬 소품샵 & 특산품 거리`,
                            category: '쇼핑',
                            description: `${companion}과의 추억을 간직할 수 있는 아기자기한 굿즈와 선물을 골라보세요.`
                        },
                        {
                            time: '15:30',
                            place: isJeju ? '용두암 해안도로 드라이브' : `${destination} 마지막 포토 스팟`,
                            category: '관광',
                            description: `집으로 돌아가기 전, ${destination}의 풍경을 한 번 더 눈에 담는 짧은 코스입니다.`
                        },
                        {
                            time: '17:30',
                            place: isJeju ? '제주 공항 출발 및 귀가' : `${destination} 출발 및 귀가`,
                            category: '이동',
                            description: `즐거웠던 ${days}일간의 ${destination} 여행을 마무리하고 안전하게 귀가합니다.`
                        }
                    ]
                },
                {
                    theme: `${destination} 근교 히든 스팟 완전 정복`,
                    schedule: [
                        {
                            time: '10:00',
                            place: `${destination} 근교 드라이브 코스`,
                            category: '관광',
                            description: `번화가를 벗어나 한적하고 아름다운 자연 경관을 만끽할 수 있는 히든 명소입니다.`
                        },
                        {
                            time: '12:30',
                            place: `현지인 추천 전통 한정식/로컬푸드`,
                            category: '식사',
                            description: `정갈한 상차림으로 부모님이나 ${companion} 모두 만족할 만한 식사 장소입니다.`
                        },
                        {
                            time: '15:00',
                            place: `복합문화공간 & 전시 관람`,
                            category: '관광',
                            description: `감각적인 건축물과 예술 작품을 감상하며 영감을 채우는 오후 시간입니다.`
                        },
                        {
                            time: '18:30',
                            place: `야경이 아름다운 전망대 & 디너`,
                            category: '식사',
                            description: `반짝이는 도시의 불빛을 바라보며 여행의 하이라이트를 장식하세요.`
                        }
                    ]
                }
            ];

            // 선택한 일수(days)만큼 일정 배열 생성
            const itinerary = [];
            for (let i = 0; i < days; i++) {
                // 마지막 날은 가급적 귀가 템플릿(index 2)을 활용하도록 배치
                let templateIndex = i;
                if (days === 1) templateIndex = 0;
                else if (i === days - 1 && days > 2) templateIndex = 2;
                else templateIndex = i % dayTemplates.length;

                const selectedTemplate = dayTemplates[templateIndex];
                itinerary.push({
                    day: i + 1,
                    theme: selectedTemplate.theme,
                    schedule: selectedTemplate.schedule
                });
            }

            return {
                summary: `${companion}과 함께 떠나는 ${destination} 맞춤 코스! '${interests.join(', ')}' 취향을 반영해 동선을 최적화했어요.`,
                itinerary
            };
        }

        // ==========================================
        // 5. 결과 렌더링 로직
        // ==========================================
        
        // 카테고리별 뱃지 색상 및 아이콘 매핑
        function getCategoryStyle(category) {
            const map = {
                '식사': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200/70', icon: 'utensils' },
                '카페': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/70', icon: 'coffee' },
                '관광': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200/70', icon: 'camera' },
                '쇼핑': { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200/70', icon: 'shopping-bag' },
                '이동': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', icon: 'navigation' },
                '휴식': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200/70', icon: 'sparkles' }
            };
            return map[category] || { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200/70', icon: 'map-pin' };
        }

        let currentRenderedData = null;

        function renderItinerary(result, payload) {
            const { isMock, data } = result;
            currentRenderedData = { payload, data };

            // 기간 텍스트 포맷팅 (예: 3일 -> 2박 3일)
            const durationText = payload.days === 1 ? '당일치기' : `${payload.days - 1}박 ${payload.days}일`;

            resultBadge.textContent = isMock 
                ? '💡 예시 일정 (추후 /api/plan 연동 시 자동 전환)' 
                : '✨ Gemini AI 맞춤 생성 일정';
            resultTitle.textContent = `${payload.destination} ${durationText} 여행`;
            resultSubtitle.textContent = data.summary || `${payload.companion}과 함께하는 추천 일정입니다.`;

            // Day 탭 초기화 및 생성
            dayTabs.innerHTML = '';
            data.itinerary.forEach((dayItem, idx) => {
                const tabBtn = document.createElement('button');
                tabBtn.type = 'button';
                tabBtn.className = `shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    idx === 0 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`;
                tabBtn.textContent = `Day ${dayItem.day}`;
                tabBtn.addEventListener('click', () => {
                    // 탭 스타일 업데이트
                    Array.from(dayTabs.children).forEach(btn => {
                        btn.className = 'shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-600 hover:bg-slate-200';
                    });
                    tabBtn.className = 'shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-slate-900 text-white shadow-sm';
                    
                    // 해당 Day 카드로 부드럽게 스크롤
                    const targetCard = document.getElementById(`day-card-${dayItem.day}`);
                    if (targetCard) {
                        const yOffset = -125; // 상단 고정 헤더 높이 고려
                        const y = targetCard.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                });
                dayTabs.appendChild(tabBtn);
            });

            // 하루별 일정 카드 생성
            itineraryCards.innerHTML = '';
            data.itinerary.forEach((dayItem, dayIdx) => {
                const card = document.createElement('article');
                card.id = `day-card-${dayItem.day}`;
                card.className = 'bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4 animate-fade-in-up';
                card.style.animationDelay = `${dayIdx * 0.1}s`;

                // 카드 상단 헤더 (Day N + 테마)
                const cardHeader = `
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div class="flex items-center gap-2.5">
                            <span class="px-3 py-1 rounded-xl bg-brand-600 text-white text-xs font-extrabold tracking-wide">
                                DAY ${dayItem.day}
                            </span>
                            <h3 class="text-sm font-bold text-slate-900 line-clamp-1">${dayItem.theme}</h3>
                        </div>
                    </div>
                `;

                // 타임라인 리스트 생성
                const timelineItems = dayItem.schedule.map((item, idx) => {
                    const isLast = idx === dayItem.schedule.length - 1;
                    const style = getCategoryStyle(item.category);

                    return `
                        <div class="relative flex gap-3.5 ${isLast ? '' : 'pb-5'}">
                            <!-- 타임라인 세로 연결선 -->
                            ${!isLast ? '<div class="absolute left-[19px] top-8 bottom-0 w-[2px] bg-slate-100"></div>' : ''}
                            
                            <!-- 시간 및 아이콘 노드 -->
                            <div class="relative z-10 flex flex-col items-center shrink-0 w-10">
                                <div class="w-9 h-9 rounded-2xl ${style.bg} ${style.text} border ${style.border} flex items-center justify-center shadow-xs">
                                    <i data-lucide="${style.icon}" class="w-4 h-4"></i>
                                </div>
                                <span class="text-[11px] font-bold text-slate-500 mt-1.5 tracking-tight">${item.time}</span>
                            </div>

                            <!-- 장소 상세 내용 박스 -->
                            <div class="flex-1 bg-slate-50/80 hover:bg-slate-50 rounded-2xl p-3.5 border border-slate-100 transition-colors">
                                <div class="flex items-center justify-between gap-2 mb-1">
                                    <h4 class="text-sm font-bold text-slate-900 leading-snug">${item.place}</h4>
                                    <span class="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold ${style.bg} ${style.text}">
                                        ${item.category}
                                    </span>
                                </div>
                                <p class="text-xs text-slate-600 leading-relaxed">
                                    ${item.description}
                                </p>
                            </div>
                        </div>
                    `;
                }).join('');

                card.innerHTML = `
                    ${cardHeader}
                    <div class="pt-1">
                        ${timelineItems}
                    </div>
                `;

                itineraryCards.appendChild(card);
            });

            // 동적으로 추가된 Lucide 아이콘 렌더링
            lucide.createIcons();
        }

        // ==========================================
        // 6. 일정 생성 실행 및 복사 기능
        // ==========================================
        generateBtn.addEventListener('click', async () => {
            const destination = destInput.value.trim();
            if (!destination) {
                showToast('어디로 떠나실지 여행지를 입력해주세요!');
                destInput.focus();
                return;
            }

            // UI 상태 전환: 버튼 비활성화 & 로딩 표시
            generateBtn.disabled = true;
            generateBtn.classList.add('opacity-70', 'cursor-not-allowed');
            resultSection.classList.add('hidden');
            loadingSection.classList.remove('hidden');
            loadingTitle.textContent = `${destination} 맞춤 일정을 짜고 있어요`;

            // 로딩 섹션으로 부드럽게 스크롤
            loadingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

            const payload = {
                destination: destination,
                days: state.days,
                companion: state.companion,
                interests: state.interests
            };

            // API 호출 (실패 시 자동으로 예시 일정 반환)
            const result = await fetchTravelPlan(payload);

            // 로딩 숨김 및 버튼 복구
            loadingSection.classList.add('hidden');
            generateBtn.disabled = false;
            generateBtn.classList.remove('opacity-70', 'cursor-not-allowed');

            // 서버 가드레일 차단 등 명시적 에러 응답이 온 경우 토스트 안내 후 종료
            if (result.isError) {
                showToast(result.errorMessage);
                return;
            }

            resultSection.classList.remove('hidden');
            renderItinerary(result, payload);

            // 결과 섹션 상단으로 스크롤 이동
            setTimeout(() => {
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        });

        // 일정 텍스트 클립보드 복사 (iFrame 호환 execCommand 사용)
        copyPlanBtn.addEventListener('click', () => {
            if (!currentRenderedData) return;

            const { payload, data } = currentRenderedData;
            const durationText = payload.days === 1 ? '당일치기' : `${payload.days - 1}박 ${payload.days}일`;
            
            let textToCopy = `[✈️ ${payload.destination} ${durationText} 여행 일정]\n`;
            textToCopy += `• 동행: ${payload.companion} | 테마: ${payload.interests.join(', ')}\n`;
            textToCopy += `• 요약: ${data.summary}\n\n`;

            data.itinerary.forEach(day => {
                textToCopy += `=== Day ${day.day}: ${day.theme} ===\n`;
                day.schedule.forEach(item => {
                    textToCopy += `- ${item.time} [${item.category}] ${item.place}\n  (${item.description})\n`;
                });
                textToCopy += `\n`;
            });

            // 임시 textarea를 이용한 안전한 복사
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                showToast('전체 일정이 클립보드에 복사되었습니다!');
            } catch (err) {
                showToast('복사에 실패했습니다. 다시 시도해주세요.');
            }
            
            document.body.removeChild(textArea);
        });
    </script>
</body>
</html>
