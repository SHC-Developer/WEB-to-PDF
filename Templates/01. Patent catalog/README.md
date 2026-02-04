# Catalog 템플릿

교량 3차원 거동 측정 기술 특허 카탈로그를 WEB to PDF 형식으로 변환한 템플릿입니다.
**15. Catalog** 프로젝트와 거의 동일한 구조로 8페이지 구성.

## 페이지 구성 (Catalog와 동일 순서)

1. **Cover** - 표지 (로고, 타이틀, 특허증 3장)
2. **Patent Certificates** - 특허 등록 현황 (3건 상세, 활용실적 증명서)
3. **Patent Overview** - 교량의 3차원 거동 측정 장치 (ABSTRACT, FIG.1, DESCRIPTION, CLAIMS)
4. **Technical Details 1** - 기술 세부 사양 1/2 (5개 모듈: HC-SR04, DHT-11, HC-06, DS-1302, SD Card)
5. **Technical Details 2** - 기술 세부 사양 2/2 (PIN 다이어그램, 데이터 저장 사양)
6. **Application Cases 1** - 실제 적용 사례 1/2 (설치 단계 1~3)
7. **Application Cases 2** - 실제 적용 사례 2/2 (설치 단계 4~6, 시스템 운영 현황)
8. **Results** - 측정 결과 및 분석 (그래프, 해석 가이드, 이상 거동 판단)

## 파일 설명

- **catalog.ts** - 소스 파일. 직접 수정 후 `npm run export-templates`로 JSON 생성
- **catalog.json** - 실제 불러오기에 사용되는 파일 (catalog.ts에서 export)

## 이미지 에셋

Catalog 템플릿의 이미지가 표시되려면 `public/assets/` 폴더에 다음 파일들이 필요합니다:

- logo3.png, redblue.png, 1.jpg, 2.jpg, 3.jpg, qr-code.png
- certification1.jpg, certification2.jpg, certification3.jpg
- Overview.png, Graph.png, Pin number matching.png
- HC-SR04.png, DHT-11.png, HC-06.png, DS-1302.png, SDcard.png
- location.png, install.png, Slide.png, figure.png, start.png, data.png

`15. Catalog` 프로젝트의 `public/assets/` 폴더를 이 프로젝트의 `public/assets/`로 복사하면 됩니다.

## 사용 방법

1. **내장 템플릿**: 툴바에서 "템플릿" → "Catalog (특허 카탈로그)" 선택
2. **파일 불러오기**: "템플릿" → "파일에서 불러오기 (.json)" 후 `catalog.json` 선택
