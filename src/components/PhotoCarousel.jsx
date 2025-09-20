import { useMemo } from "react";

function PhotoCarousel() {
  const photos = [
    "/images/custom/Screenshot 2025-09-19 213255.png",
    "/images/custom/rural-health.jpg",
    "/images/custom/istockphoto-1680653991-612x612.jpg",
    "/images/custom/gettyimages-1498660319-640x640.jpg",
    "/images/custom/generated-image (2).png",
    "/images/custom/generated-image (1).png",
    "/images/custom/Gemini_Generated_Image_pkqcqypkqcqypkqc.png",
    "/images/custom/Gemini_Generated_Image_pkqcqypkqcqypkqc (2).png",
    "/images/custom/Gemini_Generated_Image_pkqcqypkqcqypkqc (1).png",
    "/images/custom/Gemini_Generated_Image_4wytht4wytht4wyt.png",
    "/images/custom/Gemini_Generated_Image_4wytht4wytht4wyt (2).png",
    "/images/custom/2021-05-05T115931Z_1_LYNXMPEH440PR_RTROPTP_4_HEALTH-CORONAVIRUS-INDIA.jpg",
    "/images/custom/1000_F_476187086_rfTAfF13ubtmqqDMNF5HJhDEgSC3DWuI.jpg",
    "/images/custom/616.jpg",
  ];

  // Create two tracks for seamless marquee
  const marqueePhotos = useMemo(() => [...photos, ...photos], [photos]);

  return (
    <div className="w-full max-w-9xl mx-auto overflow-hidden">
      <div className="relative">
        <div className="flex gap-4 animate-marquee-fast">
          {marqueePhotos.map((src, idx) => (
            <div key={`a-${idx}`} className="h-32 xs:h-40 sm:h-48 md:h-56 lg:h-64 flex-shrink-0">
              <img src={src} alt={`Photo ${idx + 1}`} className="h-full w-auto rounded-md sm:rounded-lg object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 -z-10 flex gap-4 animate-marquee-fast" style={{ transform: 'translateX(50%)' }}>
          {marqueePhotos.map((src, idx) => (
            <div key={`b-${idx}`} className="h-32 xs:h-40 sm:h-48 md:h-56 lg:h-64 flex-shrink-0">
              <img src={src} alt={`Photo dup ${idx + 1}`} className="h-full w-auto rounded-md sm:rounded-lg object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhotoCarousel;
