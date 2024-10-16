"use client";

import React, { useEffect, useRef } from "react";
import p5 from "p5";

interface SpiralsProps {
  paused: boolean;
}

const Spirals: React.FC<SpiralsProps> = ({ paused }) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const sketchInstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (sketchRef.current) {
      if (sketchInstanceRef.current) {
        sketchInstanceRef.current.remove();
      }

      const sketch = (p: p5) => {
        const offset = 0.23;
        const bgOpacity = 0.05;
        const numLayers = 12;
        const numSpirals = 5;
        let angle = 2;

        p.setup = () => {
          p.createCanvas(
            sketchRef.current!.clientWidth,
            sketchRef.current!.clientHeight
          );
          p.colorMode(p.HSB, 360, 100, 100, 1);
          p.background(0);
        };

        p.draw = () => {
          if (paused) p.noLoop();

          p.background(0, bgOpacity);

          p.translate(p.width / 2, p.height / 2);

          for (let i = 0; i < numLayers; i++) {
            p.push();
            p.rotate(angle * i * 0.1);

            const hue = (p.frameCount + i * 60) % 360;
            p.stroke(hue, 80, 100, 0.5);
            p.noFill();

            p.beginShape();
            const baseRadius = Math.min(p.width, p.height) * 0.25 - 10;
            for (let a = 0; a < p.TWO_PI; a += 0.01) {
              const r =
                baseRadius +
                10 +
                baseRadius * p.sin(a * numSpirals + angle + i);
              const x = r * p.cos(a - offset);
              const y = r * p.sin(a - offset);
              p.vertex(x, y);
            }
            p.endShape(p.CLOSE);

            p.pop();
          }

          angle += 0.01;
        };

        p.windowResized = () => {
          p.background(0);
          p.resizeCanvas(
            sketchRef.current!.clientWidth,
            sketchRef.current!.clientHeight
          );
        };
      };

      sketchInstanceRef.current = new p5(sketch, sketchRef.current);
    }
  }, [paused]);

  return <div ref={sketchRef} className="size-full"></div>;
};

export default Spirals;
