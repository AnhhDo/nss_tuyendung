const CandidateSearch = ({ findCandidate, filters, setFilters }) => {
  const updateFilter = (key) => (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      <div className="bg-[#1e293b] p-5 rounded-2xl border border-white/10 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-6 relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors">
              search
            </span>
            <input
              className="w-full pl-11 px-4 pr-10 py-3 bg-[#0a0f1d] border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none transition-all"
              onChange={findCandidate}
              placeholder="Tìm kiếm ứng viên hoặc tin tuyển dụng"
              type="text"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={filters.status}
              onChange={updateFilter("status")}
              className="w-full px-4 pr-10 py-3 bg-[#0a0f1d] border border-slate-700/50 rounded-xl text-sm text-slate-300 focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 cursor-pointer outline-none transition-all"
            >
              <option value="all">Đánh giá của CBTD</option>
              <option value="true">Đạt</option>
              <option value="null">Chưa đánh giá</option>
              <option value="false">Loại</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={filters.cvScore}
              onChange={updateFilter("cvScore")}
              className="w-full px-4 pr-10 py-3 bg-[#0a0f1d] border border-slate-700/50 rounded-xl text-sm text-slate-300 focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 cursor-pointer outline-none transition-all"
            >
              <option value="all">Điểm CV</option>
              <option value=">90">Trên 90</option>
              <option value="75-90">75-90</option>
              <option value="60-75">60-75</option>
              <option value="<60">Dưới 60</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={filters.ai}
              onChange={updateFilter("ai")}
              className="w-full px-4 pr-10 py-3 bg-[#0a0f1d] border border-slate-700/50 rounded-xl text-sm text-slate-300 focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 cursor-pointer outline-none transition-all"
            >
              <option value="all">AI đánh giá</option>
              <option value="passed">Đạt</option>
              <option value="pending">Xem xét</option>
              <option value="rejected">Loại</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSearch;
