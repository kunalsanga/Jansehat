import { useRef, useEffect } from 'react';

function PhotoCarousel() {
  const carouselRef = useRef(null);
  const currentIndexRef = useRef(0);

  const photos = [
    '/images/photo1.jpg',
    '/images/photo2.jpg',
    '/images/photo3.jpg',
    '/images/photo4.jpg',
    '/images/photo5.jpg',
  ];

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      currentIndexRef.current = (currentIndexRef.current + 1) % photos.length;
      const nextChild = container.children[currentIndexRef.current];
      container.scrollTo({ left: nextChild.offsetLeft, behavior: 'smooth' });
    }, 2000);

    return () => clearInterval(interval);
  }, [photos.length]);

  return (
    <div
      ref={carouselRef}
      className="flex gap-4 overflow-hidden rounded-2xl border border-zinc-200 p-2"
    >
      {photos.map((src, idx) => (
        <div key={idx} className="flex-shrink-0 w-36 h-36">
          <img
            src={src}
            alt={`Photo ${idx + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}

export default PhotoCarousel;
