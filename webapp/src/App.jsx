import { useState, useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./services/supabaseService";
import "./App.css";

import StatusBar from "./components/StatusBar";
import Navbar from "./components/Navbar";
import Who from "./components/Who";
import CandidateSearch from "./components/CandidateSearch";
import Candidate from "./components/Candidate";

import SignIn from "./login_components/SignIn";
import LogoutButton from "./login_components/SignOut";
import AuthGate from "./login_components/AuthGate";

import candidateService from "./services/candidateService";

function App() {
  const [candidates, setCandidates] = useState([]);
  const [inputString, setInputString] = useState("");

  const [filters, setFilters] = useState({
    status: "all",
    cvScore: "all",
    ai: "all",
  });

  useEffect(() => {
    let alive = true;

    const loadCandidates = async (session) => {
      if (!session) {
        if (alive) setCandidates([]);
        return;
      }

      try {
        // Now only fetches from your main candidates_info table
        const res = await candidateService.getAll();

        if (alive) setCandidates(res.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    // 1) initial load
    supabase.auth.getSession().then(({ data }) => loadCandidates(data.session));

    // 2) react to login/logout instantly
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      loadCandidates(session);
    });

    return () => {
      alive = false;
      sub.subscription?.unsubscribe();
    };
  }, []); // Dependency array is now empty, so this runs once on mount

// Replace this function in App.jsx
const handleCandidateUpdate = (candidateId, updatedData) => {
  setCandidates(prevCandidates =>
    prevCandidates.map(c =>
      c.candidate_id === candidateId
        ? { ...c, ...updatedData } // Merges all new data (decision + note)
        : c
    )
  );
};

  const findCandidate = (event) => {
    setInputString(event.target.value.toLowerCase());
  };

  const getCvScore = (c) => {
    const v = c.AI_score;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const getAiValue = (c) => {
    const raw = (c.AI_danh_gia ?? "").toString().toLowerCase().trim();

    if (raw.includes("đạt")) return "passed";
    if (raw.includes("xem")) return "pending";
    if (raw.includes("loại")) return "rejected";

    return null;
  };

  const passesStatus = (c, status) => {
    if (status === "all") return true;
    const d = c.user_decision;
    if (status === "true") return d === true;
    if (status === "false") return d === false;
    if (status === "null") return d == null;
    return true;
  };

  const passesCv = (c, cvScore) => {
    if (cvScore === "all") return true;
    const score = getCvScore(c);
    if (score == null) return false;

    if (cvScore === ">90") return score >= 90;
    if (cvScore === "75-90") return score >= 75 && score < 90;
    if (cvScore === "60-75") return score >= 60 && score < 75;
    if (cvScore === "<60") return score < 60;

    return true;
  };

  const passesAi = (c, ai) => {
    if (ai === "all") return true;
    const v = getAiValue(c);
    if (typeof v === "string") return v === ai;
    return false;
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const cName = (candidate.candidate_name ?? "").toLowerCase();
      const jdName = (candidate.recruitment_name ?? "").toLowerCase();

      const searchMatch =
        cName.includes(inputString) || jdName.includes(inputString);

      return (
        searchMatch &&
        passesStatus(candidate, filters.status) &&
        passesCv(candidate, filters.cvScore) &&
        passesAi(candidate, filters.ai)
      );
    });
  }, [candidates, inputString, filters]);

  const decisionCounts = candidates.reduce(
    (acc, c) => {
      const d = c.user_decision;
      if (d === true) acc.true += 1;
      else if (d === false) acc.false += 1;
      else acc.null += 1;
      return acc;
    },
    { null: 0, true: 0, false: 0 },
  );

  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route
        path="/"
        element={
          <AuthGate>
            <div>
              <Navbar name={"Trang sơ loại hồ sơ ứng viên cho CBTD"}/>
              <div className="flex flex-col space-y-6 max-w-7xl mx-auto px-6">
                <Who />
                <StatusBar decisionCounts={decisionCounts} />
                <CandidateSearch
                  findCandidate={findCandidate}
                  filters={filters}
                  setFilters={setFilters}
                />
                <Candidate filteredCandidates={filteredCandidates} onCandidateUpdate={handleCandidateUpdate} />
              </div>
            </div>
          </AuthGate>
        }
      ></Route>
    </Routes>
  );
}

export default App;