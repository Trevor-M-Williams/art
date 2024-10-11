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
        const stars: Star[] = [];
        const numStars = 1000;
        const arms = 3;
        const spiralTightness = 0.3;

        class Star {
          r: number;
          theta: number;
          arm: number;
          x: number;
          y: number;
          size: number;
          color: p5.Color;
          angularVelocity: number;
          currentTheta: number;
          brightness: number;

          constructor() {
            this.r = p.random(50, Math.min(p.width, p.height) / 2.1);
            this.theta = this.r * spiralTightness;
            this.arm = p.floor(p.random(arms));
            this.theta += (this.arm * p.TWO_PI) / arms;
            this.theta += p.random(-p.PI / 4, p.PI / 4);
            this.x = this.r * p.cos(this.theta);
            this.y = this.r * p.sin(this.theta);
            this.size = p.random(0, 5);
            this.color = p.color(p.random(0), p.random(200), p.random(255));
            this.angularVelocity = 30 / this.r ** 1.5;
            this.currentTheta = this.theta;
            this.brightness = p.random(150, 255);
          }

          update() {
            this.currentTheta += this.angularVelocity;
            this.x = this.r * p.cos(this.currentTheta);
            this.y = this.r * p.sin(this.currentTheta);
            this.brightness += p.random(-5, 5);
            this.brightness = p.constrain(this.brightness, 150, 255);
          }

          display() {
            p.noStroke();
            p.fill(
              p.red(this.color),
              p.green(this.color),
              p.blue(this.color),
              this.brightness
            );
            p.ellipse(this.x, this.y, this.size);
          }
        }

        p.setup = () => {
          p.createCanvas(
            sketchRef.current!.clientWidth,
            sketchRef.current!.clientHeight
          );
          p.background(0);

          for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
          }
        };

        p.draw = () => {
          if (paused) p.noLoop();

          p.background(0, 10);
          p.translate(p.width / 2, p.height / 2);

          for (const star of stars) {
            star.update();
            star.display();
          }
        };

        p.windowResized = () => {
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
