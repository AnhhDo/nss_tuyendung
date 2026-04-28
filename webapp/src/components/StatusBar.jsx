import "./status-bar.css";

const StatusBar = ({ decisionCounts }) => {
  const { null: unDecided, true: passed, false: rejected } = decisionCounts;
  const total = unDecided + passed + rejected;
  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      <div className="statusbar">
        <div className="statusbar__grid">
          <div className="statusbar__card">
            <div className="statusbar__header">
              <p className="statusbar__label">Đang chờ phê duyệt</p>
              <span className="material-symbols-outlined statusbar__icon statusbar__icon--pending">
                hourglass_top
              </span>
            </div>

            <div className="statusbar__metric">
              <h2 className="statusbar__number">{unDecided}</h2>
              <p className="statusbar__hint">hồ sơ mới</p>
            </div>
          </div>

          <div className="statusbar__card">
            <div className="statusbar__header">
              <p className="statusbar__label">Đã duyệt</p>
              <span className="material-symbols-outlined statusbar__icon statusbar__icon--approved">
                check_circle
              </span>
            </div>

            <div className="statusbar__metric">
              <h2 className="statusbar__number">{passed}</h2>
              <p className="statusbar__hint">Tỷ lệ duyệt: {passed*100 / total}%</p>
            </div>
          </div>

          <div className="statusbar__card">
            <div className="statusbar__header">
              <p className="statusbar__label">Từ chối</p>
              <span className="material-symbols-outlined statusbar__icon statusbar__icon--rejected">
                cancel
              </span>
            </div>

            <div className="statusbar__metric">
              <h2 className="statusbar__number">{rejected}</h2>
              <p className="statusbar__hint">Tỷ lệ loại: {rejected*100 / total}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;