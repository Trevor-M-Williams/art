"use client";

import React, { useEffect, useRef } from "react";
import p5 from "p5";

interface LoganProps {
  paused: boolean;
}

const Logan: React.FC<LoganProps> = ({ paused }) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const sketchInstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (sketchRef.current) {
      if (sketchInstanceRef.current) {
        sketchInstanceRef.current.remove();
      }

      const sketch = (p: p5) => {
        let time = 0;
        let numShapes = 12;
        let centerX: number, centerY: number;

        p.setup = () => {
          p.createCanvas(
            sketchRef.current!.clientWidth,
            sketchRef.current!.clientHeight
          );
          p.colorMode(p.HSB, 360, 100, 100, 1);
          centerX = p.width / 2;
          centerY = p.height / 2;
          p.noFill();
        };

        p.draw = () => {
          if (paused) p.noLoop();

          p.background(0);
          p.translate(centerX, centerY);

          const baseHue = (time * 10) % 360;
          const c1 = p.color(baseHue, 80, 100);
          const c2 = p.color((baseHue + 180) % 360, 80, 100);

          for (let i = 0; i < numShapes; i++) {
            p.push();
            p.rotate((i * p.TWO_PI) / numShapes + p.sin(time * 0.5) * 0.5);

            // Main shape with gradient
            p.beginShape();
            for (let j = 0; j < 360; j += 5) {
              const r =
                150 + 100 * p.sin(j * 8 + time * 2) * p.cos(j * 4 - time);
              const x = r * p.cos(p.radians(j));
              const y = r * p.sin(p.radians(j));
              const inter = p.map(p.sin(j * 4 + time * 3), -1, 1, 0, 1);
              const c = p.lerpColor(c1, c2, inter);
              p.stroke(c);
              p.strokeWeight(2);
              p.vertex(x, y);
            }
            p.endShape(p.CLOSE);

            // Inner details with gradient
            for (let k = 0; k < 3; k++) {
              p.beginShape();
              for (let j = 0; j < 360; j += 10) {
                const r =
                  50 +
                  30 * k +
                  20 * p.sin(j * 6 + time * 3 + k) * p.cos(j * 3 - time * 2);
                const x = r * p.cos(p.radians(j));
                const y = r * p.sin(p.radians(j));
                const inter = p.map(p.sin(j * 6 + time * 4), -1, 1, 0, 1);
                const c = p.lerpColor(c2, c1, inter);
                p.stroke(c);
                p.strokeWeight(1);
                p.vertex(x, y);
              }
              p.endShape(p.CLOSE);
            }

            p.pop();
          }

          // Central pulsating circle with gradient
          const pulseSize = 30 + 10 * p.sin(time * 5);
          for (let r = pulseSize; r > 0; r -= 2) {
            const inter = p.map(r, 0, pulseSize, 0, 1);
            const c = p.lerpColor(c1, c2, inter);
            p.fill(c);
            p.noStroke();
            p.ellipse(0, 0, r, r);
          }

          time += 0.01;
        };

        p.mouseMoved = () => {
          numShapes = p.floor(p.map(p.mouseX, 0, p.width, 6, 24));
          const speedMultiplier = p.map(p.mouseY, 0, p.height, 0.5, 2);
          time += 0.01 * speedMultiplier;
        };

        p.windowResized = () => {
          p.resizeCanvas(
            sketchRef.current!.clientWidth,
            sketchRef.current!.clientHeight
          );
          centerX = p.width / 2;
          centerY = p.height / 2;
        };
      };

      sketchInstanceRef.current = new p5(sketch, sketchRef.current);
    }
  }, [paused]);

  return <div ref={sketchRef} className="size-full"></div>;
};

export default Logan;
