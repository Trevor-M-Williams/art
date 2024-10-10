"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Spirals = dynamic(() => import("./components/spirals"), { ssr: false });
const Spirals2 = dynamic(() => import("./components/spirals2"), { ssr: false });

export default function Home() {
  const scenes = [
    { component: Spirals, name: "Flower Trance" },
    { component: Spirals2, name: "Galactic Tornado" },
  ];

  const [activeScene, setActiveScene] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {scenes.map(({ component: Scene, name }, index) => (
        <div
          className="aspect-square flex items-center justify-center border border-gray-800 rounded-lg overflow-hidden relative group hover:border-gray-500 transition-colors duration-300"
          key={index}
          onMouseEnter={() => setActiveScene(index)}
          onMouseLeave={() => setActiveScene(null)}
        >
          <Scene paused={activeScene !== index} />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 group-hover:bg-opacity-0 transition-opacity duration-300 flex items-center justify-center">
            <h2 className="text-white text-2xl font-bold group-hover:hidden">
              {name}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
}
