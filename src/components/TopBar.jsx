function TopBar() {
    return (
      <div className="sticky top-0 z-20 bg-gradient-to-b from-white/90 to-white/70 backdrop-blur border-b border-zinc-200/70">
        <div className="w-full max-w-9xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 3xl:px-12 py-2 sm:py-3 flex items-center justify-between">
          <div className="text-base sm:text-lg font-semibold">JanSehat</div>
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm text-zinc-500">
            <span className="hover:text-zinc-900 transition-colors">Happy Patients</span>
            <span className="hover:text-zinc-900 transition-colors">Qualified Doctors</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <input
              type="search"
              placeholder="Search"
              className="hidden md:block w-40 lg:w-48 xl:w-56 px-3 py-2 rounded-full bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-blue-600 text-white text-xs sm:text-sm hover:bg-blue-700 transition">Profile</button>
          </div>
        </div>
      </div>
    )
  }

  export default TopBar; 