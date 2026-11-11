import React, { useEffect, useRef, useState } from "react";
import HorizontalProjectCard from "./HorizontalProjectCard";
import { ProjectProps } from "./ProjectCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectCarouselProps {
  projects: ProjectProps[];
}

/**
 * Curved "fan" carousel — center card upright and large,
 * side cards rotated inward (like the reference image).
 * Mobile: single card with swipe.
 */
const ProjectCarousel = ({ projects }: ProjectCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (isPaused || projects.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % projects.length);
    }, 4000);
    return () => clearInterval(id);
  }, [isPaused, projects.length]);

  // Swipe
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    setIsPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchStart.current = null;
    setTimeout(() => setIsPaused(false), 4000);
  };

  if (!projects.length) {
    return (
      <div className="text-center py-12 bg-gray-100 rounded-lg">
        <p className="text-gray-600">No latest projects found</p>
      </div>
    );
  }

  const total = projects.length;
  const next = () => setActiveIndex((i) => (i + 1) % total);
  const prev = () => setActiveIndex((i) => (i - 1 + total) % total);

  // Signed circular distance from active (-N..+N)
  const signedDist = (i: number) => {
    let d = i - activeIndex;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  if (isMobile) {
    const activeProject = projects[activeIndex];

    return (
      <div
        className="w-full max-w-full overflow-hidden px-3"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="mx-auto w-full max-w-[360px]">
          <HorizontalProjectCard project={activeProject} />
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={prev}
            aria-label="Previous project"
            className="p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-sizu-yellow hover:border-sizu-yellow transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-sizu-black" />
          </button>

          <div className="flex gap-2 max-w-[52vw] overflow-hidden">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to project ${i + 1}`}
                className={`h-2 rounded-full transition-all flex-shrink-0 ${
                  i === activeIndex ? "w-8 bg-sizu-red" : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next project"
            className="p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-sizu-yellow hover:border-sizu-yellow transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-sizu-black" />
          </button>
        </div>
      </div>
    );
  }

  // Visible window: center + up to 2 on each side on desktop, 0 on mobile
  const maxVisible = 2;

  return (
    <div
      className="relative w-full"
      style={{ perspective: "1600px" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          height: isMobile ? 320 : 340,
          width: "100%",
          transformStyle: "preserve-3d",
        }}
      >
        {projects.map((project, i) => {
          const d = signedDist(i);
          const abs = Math.abs(d);
          // On mobile only show the active card — hide all neighbors to prevent stacked duplicates
          const hidden = isMobile ? abs !== 0 : abs > maxVisible;

          // Mobile: single card centered; Desktop: fan layout
          const xStep = isMobile ? 0 : 300;
          const rotStep = isMobile ? 0 : 22;
          const zStep = isMobile ? 0 : 70;
          const yLift = isMobile ? 0 : 8;

          const translateX = d * xStep;
          const translateZ = -abs * zStep;
          const translateY = abs * yLift;
          const rotateY = -d * rotStep;
          const scale = isMobile ? 1 : abs === 0 ? 1 : 0.92 - abs * 0.04;
          const opacity = hidden ? 0 : abs === 0 ? 1 : 0.85 - abs * 0.15;
          const zIndex = 100 - abs;

          return (
            <div
              key={project.id}
              className="absolute left-1/2 top-1/2 transition-all duration-700 ease-out"
              style={{
                width: isMobile ? "calc(100vw - 32px)" : "380px",
                maxWidth: isMobile ? "360px" : "380px",
                transform: `translate(-50%, -50%) translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                pointerEvents: hidden ? "none" : "auto",
                visibility: hidden ? "hidden" : "visible",
                cursor: abs === 0 ? "default" : "pointer",
              }}
              onClick={() => abs !== 0 && setActiveIndex(i)}
            >
              <HorizontalProjectCard project={project} />
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 px-4">
        <button
          onClick={prev}
          aria-label="Previous project"
          className="p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-sizu-yellow hover:border-sizu-yellow transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-sizu-black" />
        </button>

        <div className="flex gap-2 max-w-[60vw] overflow-hidden">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to project ${i + 1}`}
              className={`h-2 rounded-full transition-all flex-shrink-0 ${
                i === activeIndex ? "w-8 bg-sizu-red" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next project"
          className="p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-sizu-yellow hover:border-sizu-yellow transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-sizu-black" />
        </button>
      </div>
    </div>
  );
};

export default ProjectCarousel;
