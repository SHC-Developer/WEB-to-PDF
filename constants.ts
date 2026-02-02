import { Page } from './types';

/** A4 페이지 크기 (96 DPI: 794×1123) - 캔버스·PDF 출력 기본값 */
export const PAGE_WIDTH = 794;
export const PAGE_HEIGHT = 1123;

export const INITIAL_PAGES: Page[] = [
  {
    id: 'p1',
    title: 'Cover',
    backgroundColor: '#eff6ff', // light blue tint
    elements: [
      {
        id: 'e1',
        type: 'text',
        x: 60,
        y: 80,
        width: 500,
        height: 60,
        content: 'PET HOSPITAL',
        styles: {
          color: '#e7926b',
          fontSize: 60,
          fontWeight: 'bold',
          textAlign: 'left'
        }
      },
      {
        id: 'e2',
        type: 'text',
        x: 60,
        y: 150,
        width: 400,
        height: 60,
        content: 'BROCHURE',
        styles: {
          color: '#e7926b',
          fontSize: 60,
          fontWeight: 'bold',
          textAlign: 'left'
        }
      },
      {
        id: 'e3',
        type: 'image',
        x: 60,
        y: 250,
        width: 475,
        height: 450,
        content: 'https://picsum.photos/seed/building/600/800', // Placeholder
        styles: {
          borderRadius: 4
        }
      },
      {
        id: 'e4',
        type: 'shape',
        x: 0,
        y: 700,
        width: PAGE_WIDTH,
        height: 142,
        content: '',
        styles: {
          backgroundColor: '#1e293b'
        }
      },
      {
        id: 'e5',
        type: 'text',
        x: 40,
        y: 720,
        width: 500,
        height: 30,
        content: 'A Haven for Pet Wellness',
        styles: {
          color: '#ffffff',
          fontSize: 24,
          fontWeight: 500
        }
      },
      {
         id: 'e6',
         type: 'shape',
         x: 450,
         y: 740,
         width: 80,
         height: 80,
         content: '+',
         styles: {
            backgroundColor: '#ffedd5',
            color: '#e7926b',
            borderRadius: 8
         }
      }
    ]
  },
  {
    id: 'p2',
    title: 'Contents',
    backgroundColor: '#ffffff',
    elements: [
       {
         id: 'e2-1',
         type: 'shape',
         x: 0,
         y: 0,
         width: 80,
         height: PAGE_HEIGHT,
         content: '',
         styles: {
            backgroundColor: '#e7926b'
         }
       },
       {
        id: 'e2-2',
        type: 'text',
        x: 120,
        y: 60,
        width: 400,
        height: 60,
        content: 'CONTENTS',
        styles: {
          color: '#e7926b',
          fontSize: 48,
          fontWeight: 'bold',
          textAlign: 'center'
        }
      },
      // Decorative List
      ...Array.from({ length: 5 }).map((_, i) => ({
         id: `e2-list-${i}`,
         type: 'shape' as const,
         x: 150,
         y: 180 + (i * 70),
         width: 350,
         height: 40,
         content: '',
         styles: {
            backgroundColor: '#e7926b',
            opacity: 0.8
         }
      })),
       ...Array.from({ length: 5 }).map((_, i) => ({
         id: `e2-text-${i}`,
         type: 'text' as const,
         x: 170,
         y: 188 + (i * 70),
         width: 300,
         height: 30,
         content: ['Brief Introduction', 'Our Team', 'Services Offered', 'Advanced Facilities', 'Preventive Care'][i],
         styles: {
            color: '#ffffff',
            fontSize: 18,
            fontWeight: 500
         }
      })),
      ...Array.from({ length: 5 }).map((_, i) => ({
         id: `e2-num-${i}`,
         type: 'text' as const,
         x: 100,
         y: 188 + (i * 70),
         width: 40,
         height: 40,
         content: `0${i + 1}`,
         styles: {
            color: '#e7926b',
            fontSize: 24,
            fontWeight: 'bold'
         }
      }))
    ]
  },
  {
    id: 'p3',
    title: 'Hospital Intro',
    backgroundColor: '#ffffff',
    elements: [
        {
            id: 'e3-1',
            type: 'text',
            x: 60,
            y: 60,
            width: 475,
            height: 50,
            content: 'HOSPITAL INTRODUCTION',
            styles: {
                color: '#e7926b',
                fontSize: 32,
                fontWeight: 'bold',
                textAlign: 'center'
            }
        },
        {
            id: 'e3-2',
            type: 'image',
            x: 60,
            y: 150,
            width: 220,
            height: 300,
            content: 'https://picsum.photos/seed/hospital/300/400',
            styles: {}
        },
        {
            id: 'e3-3',
            type: 'image',
            x: 315,
            y: 150,
            width: 220,
            height: 180,
            content: 'https://picsum.photos/seed/doctor/300/250',
            styles: {}
        },
        {
           id: 'e3-4',
           type: 'text',
           x: 60,
           y: 500,
           width: 475,
           height: 200,
           content: 'We believe in preventive medicine and promote healthy lifestyles, empowering pet owners with the knowledge to maintain their pets optimal health. At our haven for pet wellness, every visit is tailored to your unique needs.',
           styles: {
               color: '#4b5563',
               fontSize: 14,
               fontWeight: 400
           }
        }
    ]
  }
];