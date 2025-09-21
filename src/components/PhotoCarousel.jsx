function PhotoCarousel() {
  const photos = [
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
    "/images/custom/Gemini_Generated_Image_4wytht4wytht4wyt.png",
    "/images/custom/Gemini_Generated_Image_4wytht4wytht4wyt (2).png",
    "/images/custom/Gemini_Generated_Image_k3z4i4k3z4i4k3z4.png",
    "/images/custom/Gemini_Generated_Image_pkqcqypkqcqypkqc.png",
    "/images/custom/Gemini_Generated_Image_pkqcqypkqcqypkqc (1).png",
    "/images/custom/Gemini_Generated_Image_pkqcqypkqcqypkqc (2).png"
  ];

  return (
    <div className="w-full max-w-9xl mx-auto overflow-hidden">
      <div className="flex gap-4 animate-scroll">
        {photos.map((src, idx) => (
          <div 
            key={idx} 
            className="h-32 xs:h-40 sm:h-48 md:h-56 lg:h-64 w-48 xs:w-56 sm:w-64 md:w-72 lg:w-80 flex-shrink-0"
          >
            <img 
              src={src} 
              alt={`Image ${idx + 1}`} 
              className="h-full w-full rounded-md sm:rounded-lg object-cover shadow-sm" 
            />
          </div>
        ))}
        {photos.map((src, idx) => (
          <div 
            key={`dup-${idx}`} 
            className="h-32 xs:h-40 sm:h-48 md:h-56 lg:h-64 w-48 xs:w-56 sm:w-64 md:w-72 lg:w-80 flex-shrink-0"
          >
            <img 
              src={src} 
              alt={`Image ${idx + 1}`} 
              className="h-full w-full rounded-md sm:rounded-lg object-cover shadow-sm" 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoCarousel;
