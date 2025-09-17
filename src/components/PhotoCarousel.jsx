import { useRef, useEffect } from "react";

function PhotoCarousel() {
  const carouselRef = useRef(null);
  const currentIndexRef = useRef(0);
  const resetTimeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const photos = [
    "/images/vcDoctor.jpg",
    "/images/photo2.jpg",
    "/images/photo3.jpg",
    "/images/photo4.jpg",
    "/images/photo5.jpg",
    "/images/photo6.jpg",
    "/images/photo7.jpg",
    "/images/photo8.jpg",
    "/images/photo9.jpg",
    "/images/photo10.jpg",
  ];

  // Duplicate once for the "fake" continuous track
  const loopPhotos = [...photos, ...photos];

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    // Start at the first slide
    currentIndexRef.current = 0;
    container.scrollTo({ left: 0, behavior: "auto" });

    // Clear any leftover timers
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    intervalRef.current = setInterval(() => {
      // Clear any pending reset to avoid collisions
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }

      // move to next slide index
      currentIndexRef.current += 1;
      const nextElem = container.children[currentIndexRef.current];
      if (!nextElem) return;

      // smooth scroll to next
      nextElem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });

      // If we just moved into the duplicated part (index === photos.length),
      // schedule an instant jump back to the original first slide after the smooth animation ends.
      // The small timeout gives the browser time to finish the smooth scroll.
      if (currentIndexRef.current === photos.length) {
        resetTimeoutRef.current = setTimeout(() => {
          // jump back to the original first slide without animation
          currentIndexRef.current = 0;
          const original = container.children[0];
          if (original) original.scrollIntoView({ behavior: "auto", block: "nearest", inline: "start" });
        }, 420); // 420ms usually covers the browser's smooth-scroll; tweak if you see a flicker
      }
    }, 2000); // change interval as needed

    return () => {
      clearInterval(intervalRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [photos.length]);

  return (
    <div className="w-full max-w-screen-lg mx-auto overflow-hidden">
      <div
        ref={carouselRef}
        className="flex overflow-x-hidden scroll-snap-type-x-mandatory snap-x"
        // note: tailwind's `snap-*` classes vary; you can also use "snap-x snap-mandatory"
      >
        {loopPhotos.map((src, idx) => (
          <div key={idx} className="flex-shrink-0 w-full h-64 flex justify-center snap-start">
          <img
            src={src}
            alt={`Photo ${idx + 1}`}
            className="max-w-[90%] h-full object-cover rounded-lg"
          />
        </div>
        
        ))}
      </div>
    </div>
  );
}

export default PhotoCarousel;
