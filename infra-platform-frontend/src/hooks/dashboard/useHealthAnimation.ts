// src/hooks/dashboard/useHealthAnimation.ts
import { useState, useEffect, RefObject } from 'react';

export const useHealthAnimation = (lottieRef: RefObject<any>) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Use an embedded animation directly instead of fetching
    const pulsatingCircle = {
      v: "5.7.4",
      fr: 30,
      ip: 0,
      op: 60,
      w: 200,
      h: 200,
      nm: "Network Pulse",
      ddd: 0,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: "Core",
          sr: 1,
          ks: {
            o: { a: 0, k: 90 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: {
              a: 1,
              k: [
                { t: 0, s: [100, 100, 100], e: [110, 110, 100] },
                { t: 30, s: [110, 110, 100], e: [100, 100, 100] },
                { t: 60, s: [100, 100, 100] }
              ]
            }
          },
          ao: 0,
          shapes: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [80, 80] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.4, 0.6, 1, 1] },
              o: { a: 0, k: 100 },
              r: 1
            }
          ]
        },
        {
          ddd: 0,
          ind: 2,
          ty: 4,
          nm: "Pulse Ring 1",
          sr: 1,
          ks: {
            o: {
              a: 1,
              k: [
                { t: 0, s: [100], e: [0] },
                { t: 30, s: [0] }
              ]
            },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: {
              a: 1,
              k: [
                { t: 0, s: [100, 100, 100], e: [150, 150, 100] },
                { t: 30, s: [150, 150, 100] }
              ]
            }
          },
          ao: 0,
          shapes: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [80, 80] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "st",
              c: { a: 0, k: [0.4, 0.6, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3 },
              lc: 2,
              lj: 2
            }
          ]
        },
        {
          ddd: 0,
          ind: 3,
          ty: 4,
          nm: "Pulse Ring 2",
          sr: 1,
          ks: {
            o: {
              a: 1,
              k: [
                { t: 15, s: [100], e: [0] },
                { t: 45, s: [0] }
              ]
            },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: {
              a: 1,
              k: [
                { t: 15, s: [100, 100, 100], e: [150, 150, 100] },
                { t: 45, s: [150, 150, 100] }
              ]
            }
          },
          ao: 0,
          shapes: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [80, 80] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "st",
              c: { a: 0, k: [0.4, 0.6, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3 },
              lc: 2,
              lj: 2
            }
          ]
        },
        {
          ddd: 0,
          ind: 4,
          ty: 4,
          nm: "Particles",
          sr: 1,
          ks: {
            o: { a: 0, k: 80 },
            r: {
              a: 1,
              k: [
                { t: 0, s: [0], e: [360] },
                { t: 60, s: [360] }
              ]
            },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] }
          },
          ao: 0,
          shapes: [
            {
              ty: "gr",
              it: [
                {
                  ty: "el",
                  d: 1,
                  s: { a: 0, k: [10, 10] },
                  p: { a: 0, k: [40, 0] }
                },
                {
                  ty: "fl",
                  c: { a: 0, k: [0.4, 0.6, 1, 1] },
                  o: { a: 0, k: 100 },
                  r: 1
                }
              ]
            },
            {
              ty: "gr",
              it: [
                {
                  ty: "el",
                  d: 1,
                  s: { a: 0, k: [8, 8] },
                  p: { a: 0, k: [0, 50] }
                },
                {
                  ty: "fl",
                  c: { a: 0, k: [0.4, 0.6, 1, 1] },
                  o: { a: 0, k: 100 },
                  r: 1
                }
              ]
            },
            {
              ty: "gr",
              it: [
                {
                  ty: "el",
                  d: 1,
                  s: { a: 0, k: [12, 12] },
                  p: { a: 0, k: [-45, 20] }
                },
                {
                  ty: "fl",
                  c: { a: 0, k: [0.4, 0.6, 1, 1] },
                  o: { a: 0, k: 100 },
                  r: 1
                }
              ]
            }
          ]
        }
      ]
    };

    setAnimationData(pulsatingCircle);
  }, []);

  return {
    animationData,
    isHovered,
    setIsHovered
  };
};