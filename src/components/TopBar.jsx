function TopBar() {
    return (
      <div className="sticky top-0 z-20 bg-gradient-to-b from-white/90 to-white/70 backdrop-blur border-b border-zinc-200/70">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-lg font-semibold">JanSehat</div>
          <div className="hidden sm:flex items-center gap-8 text-sm text-zinc-500">
            <span className="hover:text-zinc-900 transition-colors">Happy Patients</span>
            <span className="hover:text-zinc-900 transition-colors">Qualified Doctors</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="Search"
              className="hidden sm:block w-56 px-3 py-2 rounded-full bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button className="px-3 py-2 rounded-full bg-blue-600 text-white text-sm">Profile</button>
          </div>
        </div>
      </div>
    )
  }

  export default TopBar; 