// src/components/PhotoCarousel.jsx
import React, { useState } from 'react';

function PhotoCarousel() {
  const [loadedImages, setLoadedImages] = useState(new Set());

  const photos = [
    "/2.jpg",
    "/3.jpg",
    "/right.jpg",
    "/images/vcDoctor.jpg",
    "/images/custom/616.jpg",
    "/images/custom/rural-health.jpg",
    "/images/custom/1000_F_476187086_rfTAfF13ubtmqqDMNF5HJhDEgSC3DWuI.jpg",
    "/images/custom/2021-05-05T115931Z_1_LYNXMPEH440PR_RTROPTP_4_HEALTH-CORONAVIRUS-INDIA.jpg",
    "/images/custom/gettyimages-1498660319-640x640.jpg",
    "/images/custom/istockphoto-1680653991-612x612.jpg",
    "/images/custom/Screenshot 2025-09-19 213255.png",
    "/images/custom/generated-image (1).png",
    "/images/custom/generated-image (2).png",
  ];

  const handleImageLoad = (src) => {
    setLoadedImages(prev => new Set([...prev, src]));
  };

  return (
    <div className="w-full overflow-hidden py-4">
      <div className="flex gap-4 animate-scroll min-w-max">
        {/* Duplicate photos array for seamless scroll */}
        {[...photos, ...photos].map((src, idx) => (
          <div
            key={idx}
            className="h-32 xs:h-40 sm:h-48 md:h-56 lg:h-64 w-48 xs:w-56 sm:w-64 md:w-72 lg:w-80 flex-shrink-0 relative"
          >
            <img
              src={src}
              alt={`Healthcare Image ${idx + 1}`}
              className={`h-full w-full rounded-md sm:rounded-lg object-cover shadow-sm transition-opacity duration-300 ${
                loadedImages.has(src) ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => handleImageLoad(src)}
            />
            {!loadedImages.has(src) && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 animate-pulse rounded-md sm:rounded-lg flex items-center justify-center">
                <div className="text-blue-400 text-lg">📷</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Tailwind CSS animation */}
      <style>
{`
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-scroll {
    display: flex;
    animation: scroll 35s linear infinite; /* Medium speed scroll */
  }
`}
</style>


    </div>
  );
}

export default PhotoCarousel;