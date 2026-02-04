import { Page } from '../../types';
import { PAGE_WIDTH, PAGE_HEIGHT } from '../../constants';

/**
 * 리뉴얼 카탈로그 — 틸/에메랄드 톤, 카드형 레이아웃
 * 동일한 내용, 새 디자인: Primary #0f766e, Accent #14b8a6, 배경 #f0fdfa
 */
const RENEWAL_PRIMARY = '#0f766e';
const RENEWAL_ACCENT = '#14b8a6';
const RENEWAL_BG = '#f0fdfa';
const RENEWAL_CARD_BG = '#ffffff';
const RENEWAL_MUTED = '#5eead4';

const sX = (n: number) => Math.round((n * PAGE_WIDTH) / 595);
const sY = (n: number) => Math.round((n * PAGE_HEIGHT) / 842);

const CONTENT_AREA = { margin: sX(24), backgroundColor: RENEWAL_BG };

/**
 * 교량 3차원 거동 측정 기술 특허 카탈로그 — 리뉴얼 버전
 * 페이지 순서: Cover → PatentCertificates → PatentOverview → TechnicalDetails(1/2) → (2/2) → ApplicationCases(1/2) → (2/2) → Results
 */
export const RENEWAL_CATALOG_PAGES: Page[] = [
  // ========== 1. 표지 (Cover) — 리뉴얼 ==========
  {
    id: 'catalog-cover',
    title: 'Cover',
    backgroundColor: '#ffffff',
    elements: [
      { id: 'c1-bg', type: 'shape', x: 0, y: 0, width: sX(595), height: sY(320), content: '', styles: { backgroundColor: RENEWAL_PRIMARY } },
      { id: 'c1-bg-pattern', type: 'image', x: sX(200), y: sY(20), width: sX(200), height: sY(200), content: '/assets/redblue.png', styles: { opacity: 0.08, objectFit: 'contain' } },
      { id: 'c1-logo', type: 'image', x: sX(51), y: sY(36), width: sX(120), height: sY(64), content: '/assets/logo3.png', styles: { objectFit: 'contain' } },
      { id: 'c1-eng', type: 'text', x: sX(51), y: sY(108), width: sX(280), height: sY(14), content: 'KOREA DISABLED VETERANS ASSOCIATION', styles: { fontSize: 11, color: RENEWAL_MUTED, letterSpacing: 2 } },
      { id: 'c1-org', type: 'text', x: sX(51), y: sY(125), width: sX(200), height: sY(20), content: '대한민국상이군경회', styles: { fontSize: 14, color: '#ffffff', fontWeight: 600 } },
      { id: 'c1-cat', type: 'text', x: sX(443), y: sY(43), width: sX(100), height: sY(14), content: 'PATENT CATALOG', styles: { fontSize: 12, color: RENEWAL_MUTED, textAlign: 'right' } },
      { id: 'c1-year', type: 'text', x: sX(443), y: sY(58), width: sX(100), height: sY(14), content: '2024', styles: { fontSize: 12, color: RENEWAL_MUTED, textAlign: 'right' } },
      { id: 'c1-title1', type: 'text', x: sX(51), y: sY(360), width: sX(493), height: sY(38), content: '교량 3차원 거동 측정', styles: { fontSize: 30, color: RENEWAL_PRIMARY, fontWeight: 'bold', textAlign: 'center' } },
      { id: 'c1-title2', type: 'text', x: sX(51), y: sY(408), width: sX(493), height: sY(32), content: '기술 특허 카탈로그', styles: { fontSize: 24, color: '#0f172a', fontWeight: 'bold', textAlign: 'center' } },
      { id: 'c1-line', type: 'shape', x: sX(265), y: sY(458), width: sX(64), height: 3, content: '', styles: { backgroundColor: RENEWAL_ACCENT } },
      { id: 'c1-desc', type: 'text', x: sX(80), y: sY(478), width: sX(435), height: sY(44), content: '초음파 센서 기반 비접촉식 변위 측정 시스템을 활용한\n교량 구조물의 실시간 3차원 거동 모니터링 기술', styles: { fontSize: 14, color: '#475569', textAlign: 'center', alignItems: 'flex-start' } },
      { id: 'c1-pat1-img', type: 'image', x: sX(51), y: sY(548), width: sX(155), height: sY(200), content: '/assets/1.jpg', styles: { borderRadius: 12, border: `3px solid ${RENEWAL_ACCENT}`, objectFit: 'contain' } },
      { id: 'c1-pat1-num', type: 'text', x: sX(51), y: sY(758), width: sX(155), height: sY(20), content: '특허 제10-2654625호', styles: { fontSize: 13, color: RENEWAL_PRIMARY, fontWeight: 700, textAlign: 'center' } },
      { id: 'c1-pat1-title', type: 'text', x: sX(51), y: sY(776), width: sX(155), height: sY(22), content: '측정 장치 및 시스템', styles: { fontSize: 13, color: '#64748b', textAlign: 'center' } },
      { id: 'c1-pat2-img', type: 'image', x: sX(220), y: sY(548), width: sX(155), height: sY(200), content: '/assets/2.jpg', styles: { borderRadius: 12, border: `3px solid ${RENEWAL_ACCENT}`, objectFit: 'contain' } },
      { id: 'c1-pat2-num', type: 'text', x: sX(220), y: sY(758), width: sX(155), height: sY(20), content: '특허 제10-2654629호', styles: { fontSize: 13, color: RENEWAL_PRIMARY, fontWeight: 700, textAlign: 'center' } },
      { id: 'c1-pat2-title', type: 'text', x: sX(220), y: sY(776), width: sX(155), height: sY(22), content: '측정 방법', styles: { fontSize: 13, color: '#64748b', textAlign: 'center' } },
      { id: 'c1-pat3-img', type: 'image', x: sX(389), y: sY(548), width: sX(155), height: sY(200), content: '/assets/3.jpg', styles: { borderRadius: 12, border: `3px solid ${RENEWAL_ACCENT}`, objectFit: 'contain' } },
      { id: 'c1-pat3-num', type: 'text', x: sX(389), y: sY(758), width: sX(155), height: sY(20), content: '특허 제10-2654632호', styles: { fontSize: 13, color: RENEWAL_PRIMARY, fontWeight: 700, textAlign: 'center' } },
      { id: 'c1-pat3-title', type: 'text', x: sX(389), y: sY(776), width: sX(155), height: sY(22), content: '측정 시스템', styles: { fontSize: 13, color: '#64748b', textAlign: 'center' } },
      { id: 'c1-footer-line', type: 'shape', x: sX(51), y: sY(812), width: sX(493), height: 1, content: '', styles: { backgroundColor: '#e2e8f0' } },
      { id: 'c1-pub1', type: 'text', x: sX(51), y: sY(824), width: sX(250), height: sY(16), content: '발행처', styles: { fontSize: 12, color: RENEWAL_PRIMARY, fontWeight: 600 } },
      { id: 'c1-pub2', type: 'text', x: sX(51), y: sY(840), width: sX(250), height: sY(14), content: '대한민국상이군경회시설사업소', styles: { fontSize: 12, color: '#64748b' } },
      { id: 'c1-pub3', type: 'text', x: sX(51), y: sY(854), width: sX(250), height: sY(14), content: '안전진단팀', styles: { fontSize: 12, color: '#64748b' } },
      { id: 'c1-qr', type: 'image', x: sX(480), y: sY(820), width: sX(64), height: sY(64), content: '/assets/qr-code.png', styles: { objectFit: 'contain' } },
    ]
  },

  // ========== 2. 특허 등록 현황 ==========
  {
    id: 'catalog-patent-cert',
    title: 'Patent Certificates',
    backgroundColor: RENEWAL_BG,
    contentArea: CONTENT_AREA,
    elements: [
      { id: 'c2-header', type: 'shape', x: 0, y: 0, width: sX(547), height: sY(72), content: '', styles: { backgroundColor: RENEWAL_PRIMARY } },
      { id: 'c2-title', type: 'text', x: sX(24), y: sY(14), width: sX(400), height: sY(28), content: '특허 등록 현황', styles: { fontSize: 22, color: '#ffffff', fontWeight: 'bold' } },
      { id: 'c2-subtitle', type: 'text', x: sX(24), y: sY(44), width: sX(300), height: sY(16), content: 'REGISTERED PATENTS', styles: { fontSize: 11, color: RENEWAL_MUTED, letterSpacing: 2 } },
      { id: 'c2-regdate', type: 'text', x: sX(456), y: sY(18), width: sX(83), height: sY(28), content: '등록일 2024.04.01', styles: { fontSize: 12, color: RENEWAL_MUTED } },
      { id: 'c2-intro', type: 'text', x: sX(24), y: sY(88), width: sX(515), height: sY(72), content: '대한민국상이군경회 안전진단팀에서는 교량 구조물의 안전 관리를 위한 혁신적인 3차원 거동 측정 기술을 개발하여 3건의 특허를 등록하였습니다. 본 기술은 기존의 아날로그 방식 측정의 한계를 극복하고, 인력 투입 없이 실시간으로 정밀한 데이터를 수집할 수 있는 시스템입니다.', styles: { fontSize: 14, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c2-pat1-box', type: 'shape', x: sX(24), y: sY(178), width: sX(515), height: sY(110), content: '', styles: { backgroundColor: RENEWAL_CARD_BG, borderLeft: `4px solid ${RENEWAL_ACCENT}`, borderRadius: 8 } },
      { id: 'c2-pat1-header', type: 'shape', x: sX(24), y: sY(178), width: sX(515), height: sY(40), content: '', styles: { backgroundColor: '#f0fdfa', borderBottom: '1px solid #ccfbf1', borderTopLeftRadius: 8 } },
      { id: 'c2-pat1-badge', type: 'shape', x: sX(28), y: sY(186), width: sX(44), height: sY(24), content: '', styles: { backgroundColor: RENEWAL_ACCENT, borderRadius: 6 } },
      { id: 'c2-pat1-badge-txt', type: 'text', x: sX(28), y: sY(188), width: sX(44), height: sY(20), content: '특허 1', styles: { fontSize: 12, color: '#ffffff', fontWeight: 600, textAlign: 'center' } },
      { id: 'c2-pat1-num', type: 'text', x: sX(80), y: sY(188), width: sX(200), height: sY(26), content: '제10-2654625호', styles: { fontSize: 18, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c2-pat1-reg', type: 'text', x: sX(388), y: sY(194), width: sX(143), height: sY(18), content: '등록일: 2024년 04월 01일', styles: { fontSize: 12, color: '#64748b' } },
      { id: 'c2-pat1-title', type: 'text', x: sX(28), y: sY(224), width: sX(503), height: sY(24), content: '교량의 3차원 거동 측정 장치 및 이를 포함하는 시스템', styles: { fontSize: 15, color: '#0f172a', fontWeight: 'bold' } },
      { id: 'c2-pat1-desc', type: 'text', x: sX(28), y: sY(248), width: sX(503), height: sY(34), content: '초음파 센서를 활용하여 교량 상부구조물의 교축, 교직, 상하 방향 변위를 동시에 측정할 수 있는 장치 및 이를 통합한 모니터링 시스템', styles: { fontSize: 13, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c2-pat1-meta', type: 'text', x: sX(28), y: sY(278), width: sX(503), height: sY(16), content: '출원번호: 제10-2023-0185643호   출원일: 2023년 12월 19일', styles: { fontSize: 11, color: '#94a3b8' } },
      { id: 'c2-pat2-box', type: 'shape', x: sX(24), y: sY(298), width: sX(515), height: sY(110), content: '', styles: { backgroundColor: RENEWAL_CARD_BG, borderLeft: `4px solid ${RENEWAL_ACCENT}`, borderRadius: 8 } },
      { id: 'c2-pat2-header', type: 'shape', x: sX(24), y: sY(298), width: sX(515), height: sY(40), content: '', styles: { backgroundColor: '#f0fdfa', borderBottom: '1px solid #ccfbf1' } },
      { id: 'c2-pat2-badge', type: 'shape', x: sX(28), y: sY(306), width: sX(44), height: sY(24), content: '', styles: { backgroundColor: RENEWAL_ACCENT, borderRadius: 6 } },
      { id: 'c2-pat2-badge-txt', type: 'text', x: sX(28), y: sY(308), width: sX(44), height: sY(20), content: '특허 2', styles: { fontSize: 12, color: '#ffffff', fontWeight: 600, textAlign: 'center' } },
      { id: 'c2-pat2-num', type: 'text', x: sX(80), y: sY(308), width: sX(200), height: sY(26), content: '제10-2654629호', styles: { fontSize: 18, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c2-pat2-reg', type: 'text', x: sX(388), y: sY(314), width: sX(143), height: sY(18), content: '등록일: 2024년 04월 01일', styles: { fontSize: 12, color: '#64748b' } },
      { id: 'c2-pat2-title', type: 'text', x: sX(28), y: sY(344), width: sX(503), height: sY(24), content: '교량의 3차원 거동 측정 방법', styles: { fontSize: 15, color: '#0f172a', fontWeight: 'bold' } },
      { id: 'c2-pat2-desc', type: 'text', x: sX(28), y: sY(368), width: sX(503), height: sY(34), content: '측정 기준판을 기준으로 3개의 초음파 센서를 배치하여 교량의 3차원 거동을 측정하는 방법', styles: { fontSize: 13, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c2-pat2-meta', type: 'text', x: sX(28), y: sY(398), width: sX(503), height: sY(16), content: '출원번호: 제10-2023-0185661호   출원일: 2023년 12월 19일', styles: { fontSize: 11, color: '#94a3b8' } },
      { id: 'c2-pat3-box', type: 'shape', x: sX(24), y: sY(418), width: sX(515), height: sY(110), content: '', styles: { backgroundColor: RENEWAL_CARD_BG, borderLeft: `4px solid ${RENEWAL_ACCENT}`, borderRadius: 8 } },
      { id: 'c2-pat3-header', type: 'shape', x: sX(24), y: sY(418), width: sX(515), height: sY(40), content: '', styles: { backgroundColor: '#f0fdfa', borderBottom: '1px solid #ccfbf1' } },
      { id: 'c2-pat3-badge', type: 'shape', x: sX(28), y: sY(426), width: sX(44), height: sY(24), content: '', styles: { backgroundColor: RENEWAL_ACCENT, borderRadius: 6 } },
      { id: 'c2-pat3-badge-txt', type: 'text', x: sX(28), y: sY(428), width: sX(44), height: sY(20), content: '특허 3', styles: { fontSize: 12, color: '#ffffff', fontWeight: 600, textAlign: 'center' } },
      { id: 'c2-pat3-num', type: 'text', x: sX(80), y: sY(428), width: sX(200), height: sY(26), content: '제10-2654632호', styles: { fontSize: 18, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c2-pat3-reg', type: 'text', x: sX(388), y: sY(434), width: sX(143), height: sY(18), content: '등록일: 2024년 04월 01일', styles: { fontSize: 12, color: '#64748b' } },
      { id: 'c2-pat3-title', type: 'text', x: sX(28), y: sY(464), width: sX(503), height: sY(24), content: '교량의 3차원 거동 측정 시스템', styles: { fontSize: 15, color: '#0f172a', fontWeight: 'bold' } },
      { id: 'c2-pat3-desc', type: 'text', x: sX(28), y: sY(488), width: sX(503), height: sY(34), content: '블루투스 통신과 클라우드 데이터 저장을 활용한 원격 모니터링 및 데이터 관리 통합 시스템', styles: { fontSize: 13, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c2-pat3-meta', type: 'text', x: sX(28), y: sY(518), width: sX(503), height: sY(16), content: '출원번호: 제10-2023-0185678호   출원일: 2023년 12월 19일', styles: { fontSize: 11, color: '#94a3b8' } },
      { id: 'c2-sect-title', type: 'text', x: sX(24), y: sY(552), width: sX(515), height: sY(26), content: '특허 활용실적 증명서', styles: { fontSize: 18, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c2-cert1', type: 'image', x: sX(24), y: sY(586), width: sX(162), height: sY(152), content: '/assets/certification1.jpg', styles: { borderRadius: 10, border: `2px solid ${RENEWAL_ACCENT}`, objectFit: 'contain' } },
      { id: 'c2-cert1-cap', type: 'text', x: sX(24), y: sY(742), width: sX(162), height: sY(16), content: '특허 실용신안 활용실적 확인', styles: { fontSize: 12, color: RENEWAL_PRIMARY, fontWeight: 600, textAlign: 'center' } },
      { id: 'c2-cert2', type: 'image', x: sX(202), y: sY(586), width: sX(162), height: sY(152), content: '/assets/certification2.jpg', styles: { borderRadius: 10, border: `2px solid ${RENEWAL_ACCENT}`, objectFit: 'contain' } },
      { id: 'c2-cert2-cap', type: 'text', x: sX(202), y: sY(742), width: sX(162), height: sY(16), content: '활용기술 목록', styles: { fontSize: 12, color: RENEWAL_PRIMARY, fontWeight: 600, textAlign: 'center' } },
      { id: 'c2-cert3', type: 'image', x: sX(380), y: sY(586), width: sX(162), height: sY(152), content: '/assets/certification3.jpg', styles: { borderRadius: 10, border: `2px solid ${RENEWAL_ACCENT}`, objectFit: 'contain' } },
      { id: 'c2-cert3-cap', type: 'text', x: sX(380), y: sY(742), width: sX(162), height: sY(16), content: '활용실적 내역표', styles: { fontSize: 12, color: RENEWAL_PRIMARY, fontWeight: 600, textAlign: 'center' } },
      { id: 'c2-pagenum', type: 'text', x: sX(496), y: sY(778), width: sX(40), height: sY(16), content: '01', styles: { fontSize: 12, color: RENEWAL_ACCENT } },
    ]
  },

  // ========== 3. 교량의 3차원 거동 측정 장치 (Patent Overview) ==========
  {
    id: 'catalog-overview',
    title: 'Patent Overview',
    backgroundColor: RENEWAL_BG,
    contentArea: CONTENT_AREA,
    elements: [
      { id: 'c3-header', type: 'shape', x: 0, y: 0, width: sX(547), height: sY(72), content: '', styles: { backgroundColor: RENEWAL_PRIMARY } },
      { id: 'c3-title', type: 'text', x: sX(24), y: sY(14), width: sX(400), height: sY(28), content: '교량의 3차원 거동 측정 장치', styles: { fontSize: 22, color: '#ffffff', fontWeight: 'bold' } },
      { id: 'c3-subtitle', type: 'text', x: sX(24), y: sY(44), width: sX(450), height: sY(16), content: 'BRIDGE Thermal movement Measurement Device with System', styles: { fontSize: 11, color: RENEWAL_MUTED, letterSpacing: 2 } },
      { id: 'c3-inventor-lbl', type: 'text', x: sX(24), y: sY(88), width: sX(128), height: sY(14), content: 'INVENTOR', styles: { fontSize: 11, color: RENEWAL_ACCENT, letterSpacing: 2 } },
      { id: 'c3-inventor', type: 'text', x: sX(24), y: sY(104), width: sX(128), height: sY(18), content: '나상우', styles: { fontSize: 14, color: '#0f172a', fontWeight: 600 } },
      { id: 'c3-assignee-lbl', type: 'text', x: sX(24), y: sY(136), width: sX(128), height: sY(14), content: 'ASSIGNEE', styles: { fontSize: 11, color: RENEWAL_ACCENT, letterSpacing: 2 } },
      { id: 'c3-assignee', type: 'text', x: sX(24), y: sY(152), width: sX(128), height: sY(36), content: '대한민국상이군경회', styles: { fontSize: 14, color: '#0f172a', fontWeight: 600, alignItems: 'flex-start' } },
      { id: 'c3-ref-lbl', type: 'text', x: sX(24), y: sY(202), width: sX(128), height: sY(14), content: 'REF CODE', styles: { fontSize: 11, color: RENEWAL_ACCENT, letterSpacing: 2 } },
      { id: 'c3-ref', type: 'text', x: sX(24), y: sY(218), width: sX(128), height: sY(18), content: 'KR10-2654625-B1', styles: { fontSize: 14, color: '#0f172a', fontFamily: 'monospace' } },
      { id: 'c3-abstract-lbl', type: 'text', x: sX(168), y: sY(88), width: sX(100), height: sY(14), content: 'ABSTRACT', styles: { fontSize: 12, color: RENEWAL_PRIMARY, fontWeight: 'bold', letterSpacing: 2 } },
      { id: 'c3-abstract', type: 'text', x: sX(168), y: sY(106), width: sX(371), height: sY(100), content: '아두이노와 초음파 센서 모듈을 사용하여 교량의 교축, 교직, 상하 방향의 3차원 거동을 측정하는 시스템 및 방법. 본 시스템은 교량 상부구조물(거더)에 측정 장치를 설치하고, 하부구조물(교대, 교각)에 측정 기준판을 부착하여 초음파 센서를 통해 상부 구조물의 이동에 따른 변위를 정밀 측정한다. 블루투스 모듈을 통한 무선 데이터 송신과 SD카드 저장을 통해 장기간 모니터링이 가능하며, 모바일 어플리케이션을 통해 실시간으로 데이터를 클라우드 서버로 전송할 수 있다.', styles: { fontSize: 13, color: '#475569', textAlign: 'justify', alignItems: 'flex-start' } },
      { id: 'c3-fig-box', type: 'shape', x: sX(24), y: sY(222), width: sX(515), height: sY(276), content: '', styles: { backgroundColor: RENEWAL_CARD_BG, borderRadius: 12, border: `1px solid #99f6e4` } },
      { id: 'c3-fig', type: 'image', x: sX(36), y: sY(234), width: sX(491), height: sY(244), content: '/assets/Overview.png', styles: { objectFit: 'contain' } },
      { id: 'c3-fig-cap', type: 'text', x: sX(24), y: sY(494), width: sX(515), height: sY(14), content: 'FIG. 1 - 시스템 구성도', styles: { fontSize: 12, color: '#64748b', textAlign: 'center' } },
      { id: 'c3-desc-lbl', type: 'text', x: sX(24), y: sY(524), width: sX(250), height: sY(22), content: 'DESCRIPTION', styles: { fontSize: 18, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c3-desc', type: 'text', x: sX(24), y: sY(548), width: sX(250), height: sY(164), content: '본 발명은 교량 구조물의 3차원 거동량을 정밀하게 측정하기 위한 시스템에 관한 것이다. 교량 구조물은 형식 및 온도 변화에 따라 지속적으로 신축과 수축을 반복하며, 이에 대응하기 위해 상부에는 신축이음이, 하부에는 교량받침이 설치된다.\n\n기존의 육안 검사 및 아날로그 방식의 측정 기법과 비교하여, 본 연구에서 개발한 초음파 센서 기반의 변위 측정 시스템은 자동화된 데이터 수집과 고정밀 측정을 가능하게 한다. 온습도 데이터를 동시에 저장하여 환경 변화에 따른 교량의 거동을 정밀하게 분석할 수 있도록 설계되었다.\n\n아두이노 기반 시스템을 활용함으로써 제작 비용을 절감하면서도 실시간 데이터 수집 및 저장이 가능하며, 블루투스 모듈을 통한 무선 데이터 송신 기능으로 유지보수 인력의 접근성을 높였다.', styles: { fontSize: 13, color: '#475569', textAlign: 'justify', alignItems: 'flex-start' } },
      { id: 'c3-claims-lbl', type: 'text', x: sX(294), y: sY(524), width: sX(250), height: sY(22), content: 'CLAIMS', styles: { fontSize: 18, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c3-claims', type: 'text', x: sX(294), y: sY(548), width: sX(245), height: sY(164), content: '1. 교량 상부구조물에 설치되며, 3개의 초음파 센서를 포함하여 교축, 교직, 상하 방향의 변위를 동시에 측정하는 3차원 거동 측정 장치.\n\n2. 제1항의 장치에 있어서, 온습도 센서를 포함하여 측정 시점의 환경 데이터를 함께 기록하는 것을 특징으로 하는 측정 장치.\n\n3. 블루투스 모듈을 통해 측정 데이터를 무선으로 전송하고, 모바일 어플리케이션을 통해 클라우드 서버로 데이터를 전송하는 방법.\n\n4. SD카드 모듈을 통해 장기간의 측정 데이터를 로컬에 저장하고, 사용자 요청 시 특정 기간의 데이터를 필터링하여 전송하는 시스템.', styles: { fontSize: 13, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c3-pagenum', type: 'text', x: sX(496), y: sY(778), width: sX(40), height: sY(16), content: '02', styles: { fontSize: 12, color: RENEWAL_ACCENT } },
    ]
  },

  // ========== 4. 기술 세부 사양 (1/2) ==========
  {
    id: 'catalog-tech-1',
    title: 'Technical Details 1',
    backgroundColor: RENEWAL_BG,
    contentArea: CONTENT_AREA,
    elements: [
      { id: 'c4-header', type: 'shape', x: 0, y: 0, width: sX(547), height: sY(72), content: '', styles: { backgroundColor: RENEWAL_PRIMARY } },
      { id: 'c4-title', type: 'text', x: sX(24), y: sY(14), width: sX(400), height: sY(28), content: '기술 세부 사양 (1/2)', styles: { fontSize: 22, color: '#ffffff', fontWeight: 'bold' } },
      { id: 'c4-subtitle', type: 'text', x: sX(24), y: sY(44), width: sX(450), height: sY(16), content: 'TECHNICAL SPECIFICATIONS - SYSTEM OVERVIEW', styles: { fontSize: 11, color: RENEWAL_MUTED, letterSpacing: 2 } },
      { id: 'c4-overview-lbl', type: 'text', x: sX(24), y: sY(88), width: sX(515), height: sY(22), content: '시스템 개요', styles: { fontSize: 18, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c4-overview', type: 'text', x: sX(24), y: sY(114), width: sX(515), height: sY(44), content: '본 측정 시스템은 Arduino UNO를 메인 컨트롤러로 사용하며, 5개의 핵심 모듈로 구성됩니다. 각 모듈은 Digital Pin(D2~D13)과 Analog Pin(A0~A5)에 연결되어 통합 운영됩니다.', styles: { fontSize: 14, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c4-comp-box', type: 'shape', x: sX(24), y: sY(174), width: sX(515), height: sY(566), content: '', styles: { backgroundColor: RENEWAL_CARD_BG, borderRadius: 12, border: '1px solid #ccfbf1' } },
      { id: 'c4-hcsr-img', type: 'image', x: sX(32), y: sY(182), width: sX(184), height: sY(92), content: '/assets/HC-SR04.png', styles: { objectFit: 'contain' } },
      { id: 'c4-hcsr-name', type: 'text', x: sX(232), y: sY(186), width: sX(200), height: sY(22), content: 'HC-SR04', styles: { fontSize: 17, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c4-hcsr-kr', type: 'text', x: sX(314), y: sY(188), width: sX(120), height: sY(18), content: '(초음파 거리 센서)', styles: { fontSize: 13, color: '#64748b' } },
      { id: 'c4-hcsr-desc', type: 'text', x: sX(232), y: sY(212), width: sX(299), height: sY(40), content: '초음파로 거리 측정. 343m/s 전파속도 활용.\nPIN: VCC, Trig(A0/A2/A4), Echo(A1/A3/A5), GND', styles: { fontSize: 13, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c4-div1', type: 'shape', x: sX(32), y: sY(292), width: sX(499), height: 1, content: '', styles: { backgroundColor: '#ccfbf1' } },
      { id: 'c4-dht-img', type: 'image', x: sX(32), y: sY(304), width: sX(184), height: sY(92), content: '/assets/DHT-11.png', styles: { objectFit: 'contain' } },
      { id: 'c4-dht-name', type: 'text', x: sX(232), y: sY(308), width: sX(200), height: sY(22), content: 'DHT-11', styles: { fontSize: 17, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c4-dht-kr', type: 'text', x: sX(289), y: sY(310), width: sX(100), height: sY(18), content: '(온습도 센서)', styles: { fontSize: 13, color: '#64748b' } },
      { id: 'c4-dht-desc', type: 'text', x: sX(232), y: sY(334), width: sX(299), height: sY(40), content: '온도/습도 기록. 환경-변위 상관관계 분석용.\nPIN: GND, NC, D2, VCC', styles: { fontSize: 13, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c4-div2', type: 'shape', x: sX(32), y: sY(416), width: sX(499), height: 1, content: '', styles: { backgroundColor: '#ccfbf1' } },
      { id: 'c4-hc06-img', type: 'image', x: sX(32), y: sY(428), width: sX(184), height: sY(92), content: '/assets/HC-06.png', styles: { objectFit: 'contain' } },
      { id: 'c4-hc06-name', type: 'text', x: sX(232), y: sY(432), width: sX(200), height: sY(22), content: 'HC-06', styles: { fontSize: 17, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c4-hc06-kr', type: 'text', x: sX(289), y: sY(434), width: sX(100), height: sY(18), content: '(블루투스 모듈)', styles: { fontSize: 13, color: '#64748b' } },
      { id: 'c4-hc06-desc', type: 'text', x: sX(232), y: sY(458), width: sX(299), height: sY(40), content: '무선 데이터 통신. 모바일 앱 연동 실시간 전송.\nPIN: VCC, GND, TX(D7), RX(D8)', styles: { fontSize: 13, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c4-div3', type: 'shape', x: sX(32), y: sY(540), width: sX(499), height: 1, content: '', styles: { backgroundColor: '#ccfbf1' } },
      { id: 'c4-ds-img', type: 'image', x: sX(32), y: sY(552), width: sX(184), height: sY(92), content: '/assets/DS-1302.png', styles: { objectFit: 'contain' } },
      { id: 'c4-ds-name', type: 'text', x: sX(232), y: sY(556), width: sX(200), height: sY(22), content: 'DS-1302', styles: { fontSize: 17, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c4-ds-kr', type: 'text', x: sX(302), y: sY(558), width: sX(80), height: sY(18), content: '(RTC 모듈)', styles: { fontSize: 13, color: '#64748b' } },
      { id: 'c4-ds-desc', type: 'text', x: sX(232), y: sY(582), width: sX(299), height: sY(40), content: '실시간 시계. 타임스탬프 기록으로 시계열 분석.\nPIN: VCC, GND, CLK(D6), DAT(D5), RST(D3)', styles: { fontSize: 13, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c4-div4', type: 'shape', x: sX(32), y: sY(664), width: sX(499), height: 1, content: '', styles: { backgroundColor: '#ccfbf1' } },
      { id: 'c4-sd-img', type: 'image', x: sX(32), y: sY(676), width: sX(184), height: sY(92), content: '/assets/SDcard.png', styles: { objectFit: 'contain' } },
      { id: 'c4-sd-name', type: 'text', x: sX(232), y: sY(680), width: sX(200), height: sY(22), content: 'SD Card Module', styles: { fontSize: 17, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c4-sd-kr', type: 'text', x: sX(384), y: sY(682), width: sX(100), height: sY(18), content: '(SD카드 소켓 모듈)', styles: { fontSize: 13, color: '#64748b' } },
      { id: 'c4-sd-desc', type: 'text', x: sX(232), y: sY(706), width: sX(299), height: sY(40), content: '장기 데이터 로컬 저장. 월간 전송 약 2분 30초.\nPIN: CS(D4), SCK(D13), MOSI(D11), MISO(D12), VCC, GND', styles: { fontSize: 13, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c4-pagenum', type: 'text', x: sX(496), y: sY(778), width: sX(40), height: sY(16), content: '03', styles: { fontSize: 12, color: RENEWAL_ACCENT } },
    ]
  },

  // ========== 5. 기술 세부 사양 (2/2) ==========
  {
    id: 'catalog-tech-2',
    title: 'Technical Details 2',
    backgroundColor: RENEWAL_BG,
    contentArea: CONTENT_AREA,
    elements: [
      { id: 'c5-header', type: 'shape', x: 0, y: 0, width: sX(547), height: sY(72), content: '', styles: { backgroundColor: RENEWAL_PRIMARY } },
      { id: 'c5-title', type: 'text', x: sX(24), y: sY(14), width: sX(400), height: sY(28), content: '기술 세부 사양 (2/2)', styles: { fontSize: 22, color: '#ffffff', fontWeight: 'bold' } },
      { id: 'c5-subtitle', type: 'text', x: sX(24), y: sY(44), width: sX(450), height: sY(16), content: 'TECHNICAL SPECIFICATIONS - PIN CONFIGURATION DIAGRAM', styles: { fontSize: 11, color: RENEWAL_MUTED, letterSpacing: 2 } },
      { id: 'c5-diag-lbl', type: 'text', x: sX(24), y: sY(88), width: sX(515), height: sY(22), content: 'PIN CONFIGURATION DIAGRAM', styles: { fontSize: 18, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c5-diag-box', type: 'shape', x: sX(24), y: sY(116), width: sX(515), height: sY(280), content: '', styles: { backgroundColor: RENEWAL_CARD_BG, borderRadius: 12, border: '1px solid #ccfbf1' } },
      { id: 'c5-diag', type: 'image', x: sX(36), y: sY(128), width: sX(491), height: sY(248), content: '/assets/Pin number matching.png', styles: { objectFit: 'contain' } },
      { id: 'c5-diag-cap', type: 'text', x: sX(24), y: sY(394), width: sX(515), height: sY(32), content: 'D는 Digital 핀을, A는 Analog 핀을 의미합니다. VCC(전원)는 빨간색, GND(접지)는 검정색으로 표기됩니다.', styles: { fontSize: 12, color: '#64748b', textAlign: 'center' } },
      { id: 'c5-desc1', type: 'text', x: sX(24), y: sY(438), width: sX(515), height: sY(52), content: '본 측정 시스템은 Arduino UNO를 메인 컨트롤러로 사용하며, 5개의 핵심 모듈이 Digital Pin(D2~D13)과 Analog Pin(A0~A5)에 체계적으로 연결되어 통합 운영됩니다. 3개의 초음파 센서(HC-SR04)는 Analog Pin을 통해 교축, 교직, 상하 방향의 변위를 동시에 측정하며, 온습도 센서(DHT-11)는 Digital Pin D2에 연결되어 측정 시점의 환경 데이터를 함께 기록합니다.', styles: { fontSize: 13, color: '#475569', textAlign: 'justify', alignItems: 'flex-start' } },
      { id: 'c5-desc2', type: 'text', x: sX(24), y: sY(496), width: sX(515), height: sY(52), content: '블루투스 모듈(HC-06)은 Digital Pin D7(TX), D8(RX)에 연결되어 측정 데이터를 무선으로 전송하고, 모바일 어플리케이션을 통해 클라우드 서버로 데이터를 전송할 수 있습니다. SD카드 모듈은 Digital Pin D4(CS), D11(MOSI), D12(MISO), D13(SCK)에 연결되어 장기간의 측정 데이터를 로컬에 저장하며, 사용자 요청 시 특정 기간의 데이터를 필터링하여 전송하는 기능을 제공합니다.', styles: { fontSize: 13, color: '#475569', textAlign: 'justify', alignItems: 'flex-start' } },
      { id: 'c5-desc3', type: 'text', x: sX(24), y: sY(554), width: sX(515), height: sY(52), content: 'RTC 모듈(DS-1302)은 Digital Pin D3(RST), D5(DAT), D6(CLK)에 연결되어 실시간 시계 기능을 제공하며, 타임스탬프 기록을 통해 시계열 데이터 분석을 가능하게 합니다. 이러한 모듈 간의 체계적인 핀 구성은 아두이노 기반 시스템의 제작 비용 절감과 함께 실시간 데이터 수집 및 저장을 가능하게 하며, 블루투스 모듈을 통한 무선 데이터 송신 기능으로 유지보수 인력의 접근성을 높였습니다.', styles: { fontSize: 13, color: '#475569', textAlign: 'justify', alignItems: 'flex-start' } },
      { id: 'c5-spec-box', type: 'shape', x: sX(24), y: sY(618), width: sX(515), height: sY(96), content: '', styles: { backgroundColor: '#f0fdfa', borderRadius: 10, borderLeft: `4px solid ${RENEWAL_ACCENT}` } },
      { id: 'c5-spec-lbl', type: 'text', x: sX(36), y: sY(630), width: sX(200), height: sY(20), content: '데이터 저장 사양', styles: { fontSize: 14, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c5-spec1-lbl', type: 'text', x: sX(36), y: sY(658), width: sX(150), height: sY(14), content: '저장 주기', styles: { fontSize: 10, color: '#64748b' } },
      { id: 'c5-spec1-val', type: 'text', x: sX(36), y: sY(672), width: sX(150), height: sY(18), content: '30분 단위', styles: { fontSize: 14, color: RENEWAL_PRIMARY, fontWeight: 600 } },
      { id: 'c5-spec2-lbl', type: 'text', x: sX(206), y: sY(658), width: sX(150), height: sY(14), content: '월간 데이터 전송', styles: { fontSize: 10, color: '#64748b' } },
      { id: 'c5-spec2-val', type: 'text', x: sX(206), y: sY(672), width: sX(150), height: sY(18), content: '약 2분 30초', styles: { fontSize: 14, color: RENEWAL_PRIMARY, fontWeight: 600 } },
      { id: 'c5-spec3-lbl', type: 'text', x: sX(376), y: sY(658), width: sX(150), height: sY(14), content: '연간 데이터 전송', styles: { fontSize: 10, color: '#64748b' } },
      { id: 'c5-spec3-val', type: 'text', x: sX(376), y: sY(672), width: sX(150), height: sY(18), content: '약 30분', styles: { fontSize: 14, color: RENEWAL_PRIMARY, fontWeight: 600 } },
      { id: 'c5-pagenum', type: 'text', x: sX(496), y: sY(778), width: sX(40), height: sY(16), content: '04', styles: { fontSize: 12, color: RENEWAL_ACCENT } },
    ]
  },

  // ========== 6. 실제 적용 사례 (1/2) ==========
  {
    id: 'catalog-app-1',
    title: 'Application Cases 1',
    backgroundColor: RENEWAL_BG,
    contentArea: CONTENT_AREA,
    elements: [
      { id: 'c6-header', type: 'shape', x: 0, y: 0, width: sX(547), height: sY(72), content: '', styles: { backgroundColor: RENEWAL_PRIMARY } },
      { id: 'c6-title', type: 'text', x: sX(24), y: sY(14), width: sX(400), height: sY(28), content: '실제 적용 사례 (1/2)', styles: { fontSize: 22, color: '#ffffff', fontWeight: 'bold' } },
      { id: 'c6-subtitle', type: 'text', x: sX(24), y: sY(44), width: sX(450), height: sY(16), content: 'FIELD APPLICATION CASE STUDY - INSTALLATION PROCESS', styles: { fontSize: 11, color: RENEWAL_MUTED, letterSpacing: 2 } },
      { id: 'c6-intro', type: 'text', x: sX(24), y: sY(88), width: sX(515), height: sY(44), content: '본 기술은 실제 교량 구조물에 설치되어 장기간 운영 테스트를 거쳤습니다. 아래는 현장 설치 과정을 단계별로 설명합니다.', styles: { fontSize: 14, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c6-step1-box', type: 'shape', x: sX(24), y: sY(148), width: sX(515), height: sY(136), content: '', styles: { backgroundColor: RENEWAL_CARD_BG, borderRadius: 10, borderLeft: `4px solid ${RENEWAL_ACCENT}` } },
      { id: 'c6-step1-img', type: 'image', x: sX(32), y: sY(156), width: sX(248), height: sY(120), content: '/assets/location.png', styles: { objectFit: 'contain', borderRadius: 8 } },
      { id: 'c6-step1-num', type: 'shape', x: sX(296), y: sY(160), width: sX(28), height: sY(28), content: '', styles: { backgroundColor: RENEWAL_ACCENT, borderRadius: 999 } },
      { id: 'c6-step1-num-txt', type: 'text', x: sX(296), y: sY(162), width: sX(28), height: sY(24), content: '1', styles: { fontSize: 14, color: '#ffffff', fontWeight: 'bold', textAlign: 'center' } },
      { id: 'c6-step1-title', type: 'text', x: sX(332), y: sY(162), width: sX(199), height: sY(22), content: '설치 위치 선정', styles: { fontSize: 16, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c6-step1-desc', type: 'text', x: sX(296), y: sY(188), width: sX(235), height: sY(80), content: '교량 하부 구조물(교대, 교각)에서 거더와의 적절한 거리를 확보할 수 있는 위치를 선정합니다.', styles: { fontSize: 13, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c6-step2-box', type: 'shape', x: sX(24), y: sY(298), width: sX(515), height: sY(136), content: '', styles: { backgroundColor: RENEWAL_CARD_BG, borderRadius: 10, borderLeft: `4px solid ${RENEWAL_ACCENT}` } },
      { id: 'c6-step2-img', type: 'image', x: sX(32), y: sY(306), width: sX(248), height: sY(120), content: '/assets/install.png', styles: { objectFit: 'contain', borderRadius: 8 } },
      { id: 'c6-step2-num', type: 'shape', x: sX(296), y: sY(310), width: sX(28), height: sY(28), content: '', styles: { backgroundColor: RENEWAL_ACCENT, borderRadius: 999 } },
      { id: 'c6-step2-num-txt', type: 'text', x: sX(296), y: sY(312), width: sX(28), height: sY(24), content: '2', styles: { fontSize: 14, color: '#ffffff', fontWeight: 'bold', textAlign: 'center' } },
      { id: 'c6-step2-title', type: 'text', x: sX(332), y: sY(312), width: sX(199), height: sY(22), content: '덮개판 설치', styles: { fontSize: 16, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c6-step2-desc', type: 'text', x: sX(296), y: sY(338), width: sX(235), height: sY(80), content: '측정 장치를 보호하고 외부 환경으로부터 센서를 보호하기 위한 덮개판을 교량 받침 상부에 설치합니다.', styles: { fontSize: 13, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c6-step3-box', type: 'shape', x: sX(24), y: sY(448), width: sX(515), height: sY(136), content: '', styles: { backgroundColor: RENEWAL_CARD_BG, borderRadius: 10, borderLeft: `4px solid ${RENEWAL_ACCENT}` } },
      { id: 'c6-step3-img', type: 'image', x: sX(32), y: sY(456), width: sX(248), height: sY(120), content: '/assets/Slide.png', styles: { objectFit: 'contain', borderRadius: 8 } },
      { id: 'c6-step3-num', type: 'shape', x: sX(296), y: sY(460), width: sX(28), height: sY(28), content: '', styles: { backgroundColor: RENEWAL_ACCENT, borderRadius: 999 } },
      { id: 'c6-step3-num-txt', type: 'text', x: sX(296), y: sY(462), width: sX(28), height: sY(24), content: '3', styles: { fontSize: 14, color: '#ffffff', fontWeight: 'bold', textAlign: 'center' } },
      { id: 'c6-step3-title', type: 'text', x: sX(332), y: sY(462), width: sX(199), height: sY(22), content: '슬라이딩 형식 측정장치 설치', styles: { fontSize: 16, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c6-step3-desc', type: 'text', x: sX(296), y: sY(488), width: sX(235), height: sY(80), content: '덮개판 내부에 슬라이딩 방식으로 측정 장치를 삽입합니다. 이 방식은 유지보수 시 장치 교체를 용이하게 합니다.', styles: { fontSize: 13, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c6-pagenum', type: 'text', x: sX(496), y: sY(778), width: sX(40), height: sY(16), content: '05', styles: { fontSize: 12, color: RENEWAL_ACCENT } },
    ]
  },

  // ========== 7. 실제 적용 사례 (2/2) ==========
  {
    id: 'catalog-app-2',
    title: 'Application Cases 2',
    backgroundColor: RENEWAL_BG,
    contentArea: CONTENT_AREA,
    elements: [
      { id: 'c7-header', type: 'shape', x: 0, y: 0, width: sX(547), height: sY(72), content: '', styles: { backgroundColor: RENEWAL_PRIMARY } },
      { id: 'c7-title', type: 'text', x: sX(24), y: sY(14), width: sX(400), height: sY(28), content: '실제 적용 사례 (2/2)', styles: { fontSize: 22, color: '#ffffff', fontWeight: 'bold' } },
      { id: 'c7-subtitle', type: 'text', x: sX(24), y: sY(44), width: sX(450), height: sY(16), content: 'FIELD APPLICATION CASE STUDY - DATA COLLECTION', styles: { fontSize: 11, color: RENEWAL_MUTED, letterSpacing: 2 } },
      { id: 'c7-step4-box', type: 'shape', x: sX(24), y: sY(80), width: sX(515), height: sY(136), content: '', styles: { backgroundColor: RENEWAL_CARD_BG, borderRadius: 10, borderLeft: `4px solid ${RENEWAL_ACCENT}` } },
      { id: 'c7-step4-img', type: 'image', x: sX(32), y: sY(88), width: sX(248), height: sY(120), content: '/assets/figure.png', styles: { objectFit: 'contain', borderRadius: 8 } },
      { id: 'c7-step4-num', type: 'shape', x: sX(296), y: sY(92), width: sX(28), height: sY(28), content: '', styles: { backgroundColor: RENEWAL_ACCENT, borderRadius: 999 } },
      { id: 'c7-step4-num-txt', type: 'text', x: sX(296), y: sY(94), width: sX(28), height: sY(24), content: '4', styles: { fontSize: 14, color: '#ffffff', fontWeight: 'bold', textAlign: 'center' } },
      { id: 'c7-step4-title', type: 'text', x: sX(332), y: sY(94), width: sX(199), height: sY(22), content: '측정기준판 및 배터리 연결', styles: { fontSize: 16, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c7-step4-desc', type: 'text', x: sX(296), y: sY(120), width: sX(235), height: sY(80), content: '하부 구조물에 측정 기준판을 부착하고, 측정 장치에 전원(배터리)을 연결합니다.', styles: { fontSize: 13, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c7-step5-box', type: 'shape', x: sX(24), y: sY(230), width: sX(515), height: sY(136), content: '', styles: { backgroundColor: RENEWAL_CARD_BG, borderRadius: 10, borderLeft: `4px solid ${RENEWAL_ACCENT}` } },
      { id: 'c7-step5-img', type: 'image', x: sX(32), y: sY(238), width: sX(248), height: sY(120), content: '/assets/start.png', styles: { objectFit: 'contain', borderRadius: 8 } },
      { id: 'c7-step5-num', type: 'shape', x: sX(296), y: sY(242), width: sX(28), height: sY(28), content: '', styles: { backgroundColor: RENEWAL_ACCENT, borderRadius: 999 } },
      { id: 'c7-step5-num-txt', type: 'text', x: sX(296), y: sY(244), width: sX(28), height: sY(24), content: '5', styles: { fontSize: 14, color: '#ffffff', fontWeight: 'bold', textAlign: 'center' } },
      { id: 'c7-step5-title', type: 'text', x: sX(332), y: sY(244), width: sX(199), height: sY(22), content: '설치 완료 및 측정 시작', styles: { fontSize: 16, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c7-step5-desc', type: 'text', x: sX(296), y: sY(270), width: sX(235), height: sY(80), content: '모든 연결을 확인한 후 시스템을 가동합니다. RTC 모듈이 현재 시간을 기록하고 데이터가 자동 저장됩니다.', styles: { fontSize: 13, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c7-step6-box', type: 'shape', x: sX(24), y: sY(380), width: sX(515), height: sY(136), content: '', styles: { backgroundColor: RENEWAL_CARD_BG, borderRadius: 10, borderLeft: `4px solid ${RENEWAL_ACCENT}` } },
      { id: 'c7-step6-img', type: 'image', x: sX(32), y: sY(388), width: sX(248), height: sY(120), content: '/assets/data.png', styles: { objectFit: 'contain', borderRadius: 8 } },
      { id: 'c7-step6-num', type: 'shape', x: sX(296), y: sY(392), width: sX(28), height: sY(28), content: '', styles: { backgroundColor: RENEWAL_ACCENT, borderRadius: 999 } },
      { id: 'c7-step6-num-txt', type: 'text', x: sX(296), y: sY(394), width: sX(28), height: sY(24), content: '6', styles: { fontSize: 14, color: '#ffffff', fontWeight: 'bold', textAlign: 'center' } },
      { id: 'c7-step6-title', type: 'text', x: sX(332), y: sY(394), width: sX(199), height: sY(22), content: '데이터 수집', styles: { fontSize: 16, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c7-step6-desc', type: 'text', x: sX(296), y: sY(420), width: sX(235), height: sY(80), content: '모바일 어플리케이션을 통해 블루투스로 장치에 접속하여 저장된 데이터를 조회하고 클라우드로 전송합니다.', styles: { fontSize: 13, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c7-stats-box', type: 'shape', x: sX(24), y: sY(532), width: sX(515), height: sY(100), content: '', styles: { backgroundColor: '#f0fdfa', borderRadius: 10, border: `1px solid #99f6e4` } },
      { id: 'c7-stats-lbl', type: 'text', x: sX(24), y: sY(544), width: sX(515), height: sY(20), content: '시스템 운영 현황', styles: { fontSize: 14, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c7-stat1-val', type: 'text', x: sX(72), y: sY(574), width: sX(100), height: sY(28), content: '3', styles: { fontSize: 20, color: RENEWAL_ACCENT, fontWeight: 'bold', textAlign: 'center' } },
      { id: 'c7-stat1-lbl', type: 'text', x: sX(72), y: sY(600), width: sX(100), height: sY(14), content: '등록 특허', styles: { fontSize: 10, color: '#64748b', textAlign: 'center' } },
      { id: 'c7-stat2-val', type: 'text', x: sX(200), y: sY(574), width: sX(100), height: sY(28), content: '24h', styles: { fontSize: 20, color: RENEWAL_ACCENT, fontWeight: 'bold', textAlign: 'center' } },
      { id: 'c7-stat2-lbl', type: 'text', x: sX(200), y: sY(600), width: sX(100), height: sY(14), content: '연속 모니터링', styles: { fontSize: 10, color: '#64748b', textAlign: 'center' } },
      { id: 'c7-stat3-val', type: 'text', x: sX(328), y: sY(574), width: sX(100), height: sY(28), content: '3축', styles: { fontSize: 20, color: RENEWAL_ACCENT, fontWeight: 'bold', textAlign: 'center' } },
      { id: 'c7-stat3-lbl', type: 'text', x: sX(328), y: sY(600), width: sX(100), height: sY(14), content: '동시 측정', styles: { fontSize: 10, color: '#64748b', textAlign: 'center' } },
      { id: 'c7-stat4-val', type: 'text', x: sX(456), y: sY(574), width: sX(100), height: sY(28), content: '1mm', styles: { fontSize: 20, color: RENEWAL_ACCENT, fontWeight: 'bold', textAlign: 'center' } },
      { id: 'c7-stat4-lbl', type: 'text', x: sX(456), y: sY(600), width: sX(100), height: sY(14), content: '측정 정밀도', styles: { fontSize: 10, color: '#64748b', textAlign: 'center' } },
      { id: 'c7-pagenum', type: 'text', x: sX(496), y: sY(778), width: sX(40), height: sY(16), content: '06', styles: { fontSize: 12, color: RENEWAL_ACCENT } },
    ]
  },

  // ========== 8. 측정 결과 및 분석 ==========
  {
    id: 'catalog-results',
    title: 'Results',
    backgroundColor: RENEWAL_BG,
    contentArea: CONTENT_AREA,
    elements: [
      { id: 'c8-header', type: 'shape', x: 0, y: 0, width: sX(547), height: sY(72), content: '', styles: { backgroundColor: RENEWAL_PRIMARY } },
      { id: 'c8-title', type: 'text', x: sX(24), y: sY(14), width: sX(400), height: sY(28), content: '측정 결과 및 분석', styles: { fontSize: 22, color: '#ffffff', fontWeight: 'bold' } },
      { id: 'c8-subtitle', type: 'text', x: sX(24), y: sY(44), width: sX(450), height: sY(16), content: 'MEASUREMENT RESULTS & ANALYSIS', styles: { fontSize: 11, color: RENEWAL_MUTED, letterSpacing: 2 } },
      { id: 'c8-data-lbl', type: 'text', x: sX(24), y: sY(88), width: sX(515), height: sY(20), content: 'DATA COLLECTION RESULTS', styles: { fontSize: 17, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c8-data-desc', type: 'text', x: sX(24), y: sY(112), width: sX(515), height: sY(44), content: '본 시스템을 통해 수집된 데이터는 구글 스프레드시트로 자동 전송되어 실시간으로 모니터링됩니다. 측정 데이터에는 날짜, 시간, 교량명, 온도, 그리고 3축(교축, 교직, 상하) 방향의 변위값이 포함됩니다.', styles: { fontSize: 14, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c8-graph-lbl', type: 'text', x: sX(24), y: sY(172), width: sX(515), height: sY(20), content: '결과 그래프', styles: { fontSize: 17, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c8-graph-box', type: 'shape', x: sX(24), y: sY(198), width: sX(515), height: sY(248), content: '', styles: { backgroundColor: RENEWAL_CARD_BG, borderRadius: 12, border: '1px solid #ccfbf1' } },
      { id: 'c8-graph', type: 'image', x: sX(36), y: sY(210), width: sX(491), height: sY(216), content: '/assets/Graph.png', styles: { objectFit: 'contain' } },
      { id: 'c8-graph-cap', type: 'text', x: sX(24), y: sY(442), width: sX(515), height: sY(16), content: '온도 및 3개 측정값 동시 표시 그래프 (2025년 9월 측정 데이터)', styles: { fontSize: 10, color: '#64748b', textAlign: 'center' } },
      { id: 'c8-guide-box', type: 'shape', x: sX(24), y: sY(472), width: sX(515), height: sY(128), content: '', styles: { backgroundColor: '#f0fdfa', borderRadius: 10, borderLeft: `4px solid ${RENEWAL_ACCENT}` } },
      { id: 'c8-guide-lbl', type: 'text', x: sX(40), y: sY(484), width: sX(200), height: sY(18), content: '그래프 해석 가이드', styles: { fontSize: 14, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c8-guide1-color', type: 'shape', x: sX(40), y: sY(514), width: sX(14), height: 4, content: '', styles: { backgroundColor: '#ef4444', borderRadius: 2 } },
      { id: 'c8-guide1', type: 'text', x: sX(58), y: sY(508), width: sX(225), height: sY(44), content: '온도 (Temperature)\n일교차에 따른 온도 변화 패턴. 교량 거동과 강한 상관관계를 보임.', styles: { fontSize: 11, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c8-guide2-color', type: 'shape', x: sX(308), y: sY(514), width: sX(14), height: 4, content: '', styles: { backgroundColor: '#3b82f6', borderRadius: 2 } },
      { id: 'c8-guide2', type: 'text', x: sX(326), y: sY(508), width: sX(205), height: sY(44), content: '교축 방향 변위\n교량 길이 방향의 신축. 온도 상승 시 팽창, 하강 시 수축.', styles: { fontSize: 11, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c8-guide3-color', type: 'shape', x: sX(40), y: sY(562), width: sX(14), height: 4, content: '', styles: { backgroundColor: '#22c55e', borderRadius: 2 } },
      { id: 'c8-guide3', type: 'text', x: sX(58), y: sY(556), width: sX(225), height: sY(44), content: '교직 방향 변위\n교량 폭 방향의 이동. 정상 상태에서는 미미한 변화.', styles: { fontSize: 11, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c8-guide4-color', type: 'shape', x: sX(308), y: sY(562), width: sX(14), height: 4, content: '', styles: { backgroundColor: '#f97316', borderRadius: 2 } },
      { id: 'c8-guide4', type: 'text', x: sX(326), y: sY(556), width: sX(205), height: sY(44), content: '상하 방향 변위\n수직 방향의 처짐. 하중 및 온도에 따른 변화 모니터링.', styles: { fontSize: 11, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c8-anomaly-lbl', type: 'text', x: sX(24), y: sY(618), width: sX(515), height: sY(20), content: '이상 거동 판단', styles: { fontSize: 17, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c8-anomaly-desc', type: 'text', x: sX(24), y: sY(642), width: sX(515), height: sY(36), content: '수집된 장기 데이터를 분석하여 교량의 정상 거동 패턴을 학습하고, 이를 벗어나는 이상 거동을 조기에 감지할 수 있습니다.', styles: { fontSize: 14, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c8-criteria-box', type: 'shape', x: sX(24), y: sY(688), width: sX(515), height: sY(58), content: '', styles: { backgroundColor: RENEWAL_CARD_BG, borderRadius: 10, border: '1px solid #99f6e4' } },
      { id: 'c8-criteria-lbl', type: 'text', x: sX(32), y: sY(698), width: sX(200), height: sY(16), content: '이상 거동 판단 기준', styles: { fontSize: 12, color: RENEWAL_PRIMARY, fontWeight: 'bold' } },
      { id: 'c8-criteria', type: 'text', x: sX(32), y: sY(714), width: sX(499), height: sY(38), content: '• 온도 변화와 무관한 급격한 변위 발생\n• 과거 동일 온도 조건 대비 변위량 편차 증가\n• 교직 또는 상하 방향의 비정상적 증가 추세\n• 설계 허용치 초과 변위 발생', styles: { fontSize: 10, color: '#475569', alignItems: 'flex-start' } },
      { id: 'c8-pagenum', type: 'text', x: sX(496), y: sY(778), width: sX(40), height: sY(16), content: '07', styles: { fontSize: 12, color: RENEWAL_ACCENT } },
    ]
  },
];
