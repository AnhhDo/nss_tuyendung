import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../services/supabaseService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    await supabase.auth.signOut();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return setErr(error.message);
    if (!data?.session) {
      const { data: s } = await supabase.auth.getSession();
      if (!s?.session) return setErr("Session not ready. Please try again.");
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[#0b1220]">
      <div className="w-full max-w-[420px] rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <h1 className="mb-6 text-xl font-semibold text-[#eaf1ff]">
          Đăng nhập hệ thống
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-[#eaf1ff] placeholder:text-slate-500 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <input
            className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-[#eaf1ff] placeholder:text-slate-500 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Đăng nhập
          </button>

          {err && <p className="text-sm text-red-400">{err}</p>}
        </form>
      </div>
    </div>
  );
}
