function TopBar() {
    return (
      <div className="sticky top-0 z-20 bg-gradient-to-b from-white/90 to-white/70 backdrop-blur border-b border-zinc-200/70">
        <div className="w-full max-w-9xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 3xl:px-12 py-2 sm:py-3 flex items-center justify-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src="/jansehat-favicon.svg" 
              alt="JanSehat Logo" 
              className="w-6 h-6 sm:w-7 sm:h-7"
            />
            <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              JanSehat
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default TopBar; 