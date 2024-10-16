"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
const Spirals = dynamic(() => import("@/components/spirals"), { ssr: false });
const Spirals2 = dynamic(() => import("@/components/spirals2"), {
  ssr: false,
});
const Logan = dynamic(() => import("@/components/logan"), { ssr: false });
export default function Home() {
  const scenes = [
    { component: Spirals, name: "Flower Trance" },
    { component: Spirals2, name: "Galactic Tornado" },
    { component: Logan, name: "Monday Afternoon Trip" },
  ];

  const [activeScene, setActiveScene] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeScene === null) return;

      switch (event.key) {
        case "Escape":
          setActiveScene(null);
          break;
        case "ArrowRight":
          setActiveScene((prev) => (prev! + 1) % scenes.length);
          break;
        case "ArrowLeft":
          setActiveScene((prev) => (prev! - 1 + scenes.length) % scenes.length);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeScene, scenes.length]);

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <div className="grid grid-cols-3 gap-4 p-4">
        {activeScene !== null && (
          <div
            className="absolute top-4 right-4 z-20"
            onClick={() => setActiveScene(null)}
          >
            <X className="size-8 text-white cursor-pointer" />
          </div>
        )}
        {scenes.map(({ component: Scene, name }, index) => (
          <div
            className={cn(
              "aspect-square flex items-center justify-center border border-gray-700 rounded-lg overflow-hidden relative group hover:border-gray-500 transition-colors duration-300 cursor-pointer",
              activeScene === index &&
                "absolute inset-0 z-10 aspect-auto border-none cursor-default",
              activeScene && activeScene !== index && "opacity-0"
            )}
            key={index}
            onClick={() => setActiveScene(index)}
          >
            <Scene paused={activeScene !== index} />
            <div
              className={cn(
                "absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 group-hover:bg-opacity-0 transition-opacity duration-300 flex items-center justify-center",
                activeScene === index && "hidden"
              )}
            >
              <h2 className="text-white text-2xl font-bold group-hover:opacity-0 transition-opacity duration-300">
                {name}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
