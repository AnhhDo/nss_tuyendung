import CandidateDetail from "./CandidateDetail";
import "./component-style.css";
import { useState, useEffect, useMemo } from "react";
import candidateService from "../services/candidateService";

const Candidate = ({ filteredCandidates, onCandidateUpdate }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [shareModal, setShareModal] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (filteredCandidates.length === 1) {
      setSelectedCandidate(filteredCandidates[0]);
    } else {
      setSelectedCandidate(null);
    }
  }, [filteredCandidates]);

  const groupedByRecruitment = useMemo(() => {
    const groups = new Map();

    for (const c of filteredCandidates) {
      const key =
        (c.recruitment_name ?? "Không có tên tin tuyển dụng cụ thể")
          .toString()
          .trim() || "Không có tên tin tuyển dụng cụ thể";

      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(c);
    }

    return Array.from(groups.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [filteredCandidates]);

  const handleShare = async () => {
  try {
    const candidateIds = shareModal.candidates.map((c) => c.candidate_id);

    await candidateService.forwardCandidates(candidateIds);

    setIsSuccess(true);
  } catch (error) {
    console.error("Error sharing candidates:", error);
    alert("Có lỗi xảy ra khi gửi danh sách. Vui lòng thử lại.");
  }
};

  const closeModal = () => {
    setShareModal(null);
    setIsSuccess(false);
  };

  // --- Detail View ---
  if (selectedCandidate) {
    return (
      <div>
        <div className="pl-6 mb-4">
          <button
            onClick={() => setSelectedCandidate(null)}
            className="return-button"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_left
            </span>
            Quay lại danh sách
          </button>
        </div>

        <CandidateDetail
          c={selectedCandidate}
          variant="full"
          // Catch the update and pass the ID + Data to App.jsx
          onUpdated={(updatedData) => onCandidateUpdate(selectedCandidate.candidate_id, updatedData)}
        />
      </div>
    );
  }

  // --- List View ---
  return (
    <div className="space-y-6 relative">
      {groupedByRecruitment.map(([recruitmentName, candidates]) => (
        <div key={recruitmentName} className="space-y-3">

          <div className="flex items-center justify-between px-2 pl-6 pr-6 mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-white font-semibold text-lg m-0">
                {recruitmentName}
              </h2>

              <button
                onClick={() => {
                  const passedCandidates = candidates.filter(c => c.user_decision === true);

                  if (passedCandidates.length === 0) {
                    alert("Chưa có ứng viên nào được đánh giá 'Đạt' để gửi.");
                    return;
                  }

                  setShareModal({ recruitmentName, candidates: passedCandidates });
                  setIsSuccess(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[#38bdf8] hover:bg-[#38bdf8]/20 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">
                  send
                </span>
                Update trạng thái ứng viên trên iViec
              </button>
            </div>

            <span className="text-slate-400 text-sm">
              {candidates.length} ứng viên
            </span>
          </div>

          <div className="space-y-3">
            {candidates.map((candidate) => (
              <div key={candidate.candidate_id}>
                <CandidateDetail
                  c={candidate}
                  variant="compact"
                  // Catch the update and pass the ID + Data to App.jsx
                  onUpdated={(updatedData) => onCandidateUpdate(candidate.candidate_id, updatedData)}
                >
                  <button
                    className="view-detail"
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      visibility
                    </span>
                  </button>
                </CandidateDetail>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* --- Share/Success Modal --- */}
      {shareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#1b2a41] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">

            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                {isSuccess ? "Gửi thành công!" : "Xác nhận gửi danh sách"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {!isSuccess ? (
              /* Confirmation State */
              <>
                <p className="text-sm text-slate-400 mb-4">
                  Vị trí: <span className="text-[#38bdf8] font-medium">{shareModal.recruitmentName}</span>
                  <br/>
                  <span className="text-emerald-400 text-xs mt-1 inline-block">
                    *Đang chuẩn bị gửi {shareModal.candidates.length} ứng viên "Đạt"
                  </span>
                </p>

                <div className="space-y-2 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {shareModal.candidates.map((candidate, index) => (
                    <div key={candidate.candidate_id} className="p-3 bg-[#0a0f1d] border border-slate-700/50 rounded-xl text-sm text-slate-300">
                      {index + 1}. {candidate.candidate_name || candidate.name || "Ứng viên"}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-5 py-2 rounded-xl text-sm font-bold bg-[#38bdf8] text-[#0f172a] hover:bg-sky-400 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    Gửi ngay
                  </button>
                </div>
              </>
            ) : (
              /* Success State */
              <>
                <div className="mb-6">
                  <p className="text-sm text-emerald-400 mb-3">
                    Đã update thành công các ứng viên sau sang bước Sơ loại ứng viên:
                  </p>
                  <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {shareModal.candidates.map((candidate, index) => (
                      <div key={candidate.candidate_id} className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-200">
                        <span className="font-semibold">{index + 1}.</span> {candidate.candidate_name || candidate.name || "Ứng viên"}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10">
                  <button
                    onClick={closeModal}
                    className="px-5 py-2 rounded-xl text-sm font-bold bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidate;