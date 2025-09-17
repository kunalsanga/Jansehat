import { useRef, useEffect } from "react";

function PhotoCarousel() {
  const carouselRef = useRef(null);
  const currentIndexRef = useRef(0);

  const photos = [
    "/images/photo1.jpg",
    "/images/photo2.jpg",
    "/images/photo3.jpg",
    "/images/photo4.jpg",
    "/images/photo5.jpg",
  ];

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      currentIndexRef.current =
        (currentIndexRef.current + 1) % photos.length;
      const nextChild = container.children[currentIndexRef.current];
      container.scrollTo({
        left: nextChild.offsetLeft,
        behavior: "smooth",
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [photos.length]);

  return (
    <div className="w-full max-w-screen-lg mx-auto overflow-hidden">
      <div
        ref={carouselRef}
        className="flex overflow-x-hidden scroll-smooth snap-x snap-mandatory"
      >
        {photos.map((src, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-full h-64 snap-start"
          >
            <img
              src={src}
              alt={`Photo ${idx + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoCarousel;
