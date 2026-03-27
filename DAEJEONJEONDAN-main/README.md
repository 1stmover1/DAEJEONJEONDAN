# 대전디자인 - 전단지 디자인 · 인쇄 · 배포 전문 웹사이트

## 프로젝트 개요
세종AI디자인(대전디자인) 공식 웹사이트. 대전 지역 소상공인을 위한 전단지, 현수막, 명함, 리플렛 등 홍보물 디자인·인쇄·배포 원스톱 서비스 소개 사이트.

## 완료된 기능

### 메인 페이지 (index.html)
- **웰컴 팝업**: 첫 방문 시 자동 팝업 (가격 정보, CTA 버튼, "오늘 하루 보지 않기" 기능)
- **히어로 슬라이더**: 4장 시네마틱 슬라이드 (자동 재생 6초, 터치 스와이프, 도트 진행 바)
- **모핑 텍스트 효과**: 슬라이드 강조 텍스트가 3개 단어로 순환 (char-by-char 애니메이션)
- **글래스모피즘 헤더**: 투명→다크 글래스→라이트 글래스 자동 전환
- **전화번호 아이콘화**: 상단 메뉴에서 번호 텍스트 숨김, 아이콘 링크만 노출 (tel: 연결 유지)
- **히어로 버튼**: "무료 시안받기" + "문의하기" 2개 버튼 (전화번호 제거)
- 쇼케이스 3종 (디자인/인쇄/배포), 포트폴리오 미리보기 6종, 통계 카운트업, CTA 배너

### 서비스 (services.html)
- 전단지, 배포, 현수막/배너, 명함, 리플렛/브로슈어 5개 서비스 상세
- 가격표 (전단지 6만원대~, 현수막 3만원대~, 명함 1만원대~)

### 포트폴리오 (portfolio.html)
- 탭 필터 (전체/식당·카페/학원·교육/병원·뷰티/부동산·기타)
- 9개 갤러리 아이템, 호버 오버레이

### 회사소개 (about.html)
- 회사 소개, 4단계 프로세스, 6가지 강점 카드, FAQ 5개 아코디언

### 상담신청 (contact.html)
- **Formspree 연동**: 폼 제출 → https://formspree.io/f/mvgdzwry 전송
- 로컬 DB(tables/consultations)에도 동시 저장
- 필드: 업체명, 담당자명, 연락처(자동 포맷), 서비스유형(체크박스), 문의내용
- 전화번호 자동 하이픈 포맷팅, 제출 후 성공 모달

### SEO/지역 타겟팅 페이지 (신규)
- **daejeon-flyer.html**: "대전전단지" 키워드 최적화 랜딩페이지
- **daejeon-banner.html**: "대전현수막" 키워드 최적화 랜딩페이지
- **daejeon-promotion.html**: "대전홍보" 키워드 최적화 랜딩페이지
- 각 페이지에 JSON-LD 구조화 데이터, geo 메타태그, 키워드 메타태그 포함
- **sitemap.xml**: 전체 8개 페이지 사이트맵
- **robots.txt**: 크롤러 허용 설정

### 공통 기능 (전 페이지)
- 글래스모피즘 헤더 (투명/다크/라이트 전환)
- 전화번호 아이콘 (텍스트 숨김, tel: 링크 유지)
- 푸터 "분양 , 선거 마케팅 관련 문의" → sejong-marketing.com 링크
- 플로팅 CTA (전화/상담)
- 스크롤 리빌 애니메이션
- 완전 반응형 (모바일/태블릿/데스크톱)

## 페이지 URI
| 경로 | 설명 |
|------|------|
| `index.html` | 메인 페이지 |
| `services.html` | 서비스 상세 |
| `portfolio.html` | 포트폴리오 갤러리 |
| `about.html` | 회사소개 · FAQ |
| `contact.html` | 상담신청 폼 |
| `daejeon-flyer.html` | SEO: 대전전단지 |
| `daejeon-banner.html` | SEO: 대전현수막 |
| `daejeon-promotion.html` | SEO: 대전홍보 |
| `sitemap.xml` | 사이트맵 |
| `robots.txt` | 크롤러 설정 |

## 기술 스택
- **HTML5** + **CSS3** (커스텀 프로퍼티, 글래스모피즘, 그리드, 플렉스박스)
- **JavaScript ES6+** (Intersection Observer, MutationObserver, 모핑 텍스트 엔진)
- **Pretendard** (본문), **Playfair Display** (헤드라인)
- **Font Awesome 6.4** (아이콘)
- **Formspree** (폼 제출 외부 서비스)
- **RESTful Table API** (consultations 테이블)

## 데이터 모델
### consultations 테이블
| 필드 | 타입 | 설명 |
|------|------|------|
| id | text | UUID |
| companyName | text | 업체명 |
| contactName | text | 담당자명 |
| phone | text | 연락처 |
| serviceType | text | 서비스 유형 |
| message | text | 문의내용 |
| status | text | 상태 |
| submittedAt | datetime | 접수일시 |

## 핵심 정보
- **연락처**: 010-4433-0938
- **상호명**: 세종AI디자인
- **사업자번호**: 431-87-03181
- **주소**: 세종특별자치시 한누리대로 234
- **서비스 지역**: 대전광역시 전지역 (유성구, 서구, 중구, 동구, 대덕구)
- **분양/선거 마케팅**: sejong-marketing.com

## 향후 개발 권장 사항
1. 실제 도메인 연결 후 sitemap.xml, canonical URL 업데이트
2. Google Search Console / Naver Search Advisor 등록
3. Google Analytics / 네이버 애널리틱스 연동
4. 실제 포트폴리오 이미지 교체
5. 블로그/소식 페이지 추가 (SEO 콘텐츠 확장)
6. 카카오톡 채널 연동
