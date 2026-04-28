import { useEffect, useState } from "react";
import "./component-style.css";
import candidateService from "../services/candidateService"; // ✅ adjust path if your file structure differs

const CandidateDetail = ({ c, variant = "compact", children, onUpdated }) => {
  const isFull = variant === "full";

  // ✅ controlled local state (resets when candidate changes)
  const [userDecision, setUserDecision] = useState(c.user_decision ?? null);
  const [userNote, setUserNote] = useState(c.user_note ?? "");

  // ✅ save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveOk, setSaveOk] = useState(false);

  useEffect(() => {
    setUserDecision(c.user_decision ?? null);
    setUserNote(c.user_note ?? "");
    setSaveError("");
    setSaveOk(false);
  }, [c?.candidate_id]);

  const decisionConfig = {
    true: { label: "Đạt", className: "badge--green" },
    false: { label: "Loại", className: "badge--red" },
    null: { label: "CBTD chưa đánh giá", className: "badge--orange" },
  };

  const decision = decisionConfig[String(userDecision)] ?? decisionConfig.null;

  const parseMaybeJsonArray = (v) => {
    if (Array.isArray(v)) return v;
    if (typeof v === "string") {
      try {
        const parsed = JSON.parse(v);
        return Array.isArray(parsed) ? parsed : [v];
      } catch {
        return [v];
      }
    }
    return [];
  };

  const formatStringToArray = (inputString) => {
    return (inputString || "")
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const formatRelativeTimeVI = (isoString) => {
    const now = new Date();
    const past = new Date(isoString);
    const diffMs = now - past;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  // ✅ Save to DB
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError("");
    setSaveOk(false);

    try {
      const candidateId = c.candidate_id;
      if (!candidateId) throw new Error("Missing candidate_id");

      const updates = {
        user_decision: userDecision,
        user_note: userNote,
        last_updated_at: new Date().toISOString(), // optional
      };

      const res = await candidateService.updateCandidate(candidateId, updates);

      setSaveOk(true);
      onUpdated?.(res?.data ?? updates);

      setTimeout(() => setSaveOk(false), 1500);
    } catch (err) {
      setSaveError(
        err?.response?.data?.message ||
          err?.message ||
          "Lưu thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      <div className="candidate-card w-full">
        <div className="candidate-card__header">
          <div className="flex items-center gap-4">
            <div className="candidate-avatar">
              {c.candidate_name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="candidate-name">
                {c.candidate_name}{" "}
                {isFull &&
                  c.Candidate_Address &&
                  ` - ${c.Candidate_Address}`}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`badge ${decision.className}`}>
              {decision.label}
            </span>
            {children}
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full">

          <div className="candidate-score-col flex-shrink-0">
            <div className="score-circle">{c.AI_score ?? "-"}</div>
            <p className="score-label">AI SCORE</p>

            <a
              href={c.candidate_cv_path}
              download
              target="_blank"
              rel="noreferrer noopener"
              className="cv-button"
            >
              <span className="material-symbols-outlined">description</span>
              <span className="cv-button__label">Mở CV</span>
            </a>
          </div>

          <div className="flex-1 p-6 min-w-0 flex flex-col w-full space-y-6">
              <div className="w-full">
                <h4 className="section-title">
                  <span className="material-symbols-outlined text-[14px] text-[#7d93bf]">
                    description
                  </span>
                  Tóm tắt
                </h4>
                <ul className="section-text w-full">
                  {parseMaybeJsonArray(c.AI_nhan_xet).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>

                {isFull && (
                  <div className="detailed-information mt-4 w-full">
                    <h4 className="section-title">
                      <span className="material-symbols-outlined text-[14px] text-[#7d93bf]">
                        school
                      </span>
                      Học vấn
                    </h4>
                    <ul className="section-text">
                      {formatStringToArray(c.Candidate_Education).map(
                        (edu, i) => (
                          <li key={i} className="space-y-1 ">
                            <div className="text-xs leading-relaxed text-[#eaf1ff]">
                              <p>
                                {edu.major} - {edu.education}
                              </p>
                            </div>

                            <div className="text-xs text-slate-500">
                              {new Date(edu.startTime).getFullYear()} –{" "}
                              {edu.isCurrent
                                ? "Hiện tại"
                                : new Date(edu.endTime).getFullYear()}
                            </div>
                          </li>
                        )
                      )}
                    </ul>

                    <h4 className="section-title mt-4">
                      <span className="material-symbols-outlined text-[14px] text-[#7d93bf]">
                        target
                      </span>
                      Mục tiêu
                    </h4>
                    <ul className="list">
                      {formatStringToArray(c.Strengths).map((s, i) => (
                        <li key={i}>
                          <span className="material-symbols-outlined text-[14px]">
                            exclamation
                          </span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 2. THREE COLUMNS OF STRENGTHS & WEAKNESSES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="w-full">
                  <h4 className="section-title section-title--strength">
                    <span className="material-symbols-outlined text-[14px] text-[#38bdf8]">
                      auto_awesome
                    </span>
                    Điểm mạnh
                  </h4>
                  <ul className="list w-full">
                    {formatStringToArray(c.AI_ki_nang_noi_bat).map((s, i) => (
                      <li key={i}>
                        <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">
                          check_circle
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-full">
                  <h4 className="section-title section-title--strength">
                    <span className="material-symbols-outlined text-[14px] text-[#38bdf8]">
                      auto_awesome
                    </span>
                    Giá trị phù hợp
                  </h4>
                  <ul className="list w-full">
                    {formatStringToArray(c.AI_gia_tri_phu_hop).map((s, i) => (
                      <li key={i}>
                        <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">
                          check_circle
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-full">
                  <h4 className="section-title section-title--weak">
                    <span className="material-symbols-outlined text-[14px] text-[#ff9f43]">
                      trending_up
                    </span>
                    Điểm yếu
                  </h4>
                  <ul className="list list--weak w-full">
                    {formatStringToArray(c.AI_thieu_ki_nang).map((w, i) => (
                      <li key={i}>
                        <span className="material-symbols-outlined text-[16px] text-[#ff9f43]">
                          priority_high
                        </span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 3. RISKS & COMMENT BOX STACKED IN 1 COLUMN */}
              <div className="flex flex-col gap-6 mt-auto pt-6 border-t border-white/5 w-full">

                {/* AI nhận xét rủi ro (Top) */}
                <div className="w-full">
                  <h4 className="section-title section-title--weak">
                    <span className="material-symbols-outlined text-[14px] text-[#ff9f43]">
                      warning
                    </span>
                    AI nhận xét rủi ro
                  </h4>
                  <ul className="list list--weak w-full">
                    {formatStringToArray(c.AI_rui_ro_khi_tuyen).map((w, i) => (
                      <li key={i}>
                        <span className="material-symbols-outlined text-[16px] text-[#ff9f43]">
                          priority_high
                        </span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ghi chú của CBTD (Bottom) */}
                <div className="candidate-note w-full flex flex-col">
                  <h4 className="section-title">
                    <span className="material-symbols-outlined text-[14px] text-[#7d93bf]">
                      edit_note
                    </span>
                    Ghi chú của CBTD
                  </h4>
                  <textarea
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    placeholder="Nhập ghi chú vào đây..."
                    disabled={isSaving}
                    className="w-full mt-2 min-h-[120px]"
                  />
                </div>

              </div>

          </div>
        </div>

        <div className="candidate-footer mt-auto w-full">
          <span className="footer-tag">JD: {c.recruitment_name ?? "N/A"}</span>
          <span className="footer-tag">
            Cập nhật lần cuối:{" "}
            {formatRelativeTimeVI(c.last_updated_at ?? c.Created_At)}
          </span>
          <span className="badge badge--blue">
            Đánh giá của AI: {c.AI_danh_gia ?? "N/A"}
          </span>

          <select
            className={`badge ${decision.className} ml-auto cursor-pointer`}
            value={userDecision === null ? "null" : String(userDecision)}
            onChange={(e) => {
              const v = e.target.value;
              setUserDecision(v === "null" ? null : v === "true");
            }}
            disabled={isSaving}
          >
            <option value="null">Chưa đánh giá</option>
            <option value="true">Đạt</option>
            <option value="false">Loại</option>
          </select>

          {/* ✅ save button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-md text-xs font-bold badge--blue text-[#9fb3d9] hover:opacity-90 transition-opacity"
          >
            {isSaving ? "Đang gửi ..." : "Đã gửi"}
          </button>
        </div>

        {/* ✅ save feedback */}
        {saveError && (
          <div className="mt-3 min-h-[40px] px-3 py-1 text-sm text-red-400">{saveError}</div>
        )}
        {saveOk && (
          <div className="mt-3 min-h-[40px] px-3 py-1 text-sm text-green-400">Đã gửi thành công ✅</div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetail;