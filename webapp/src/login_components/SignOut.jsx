import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseService";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="
  px-6 py-2.5
  rounded-2xl
  bg-[#ef4444]
  text-white

  transition-all duration-200 ease-out
  hover:-translate-y-0.5
  hover:shadow-[0_8px_20px_rgba(239,68,68,0.35)]
  hover:bg-[#f87171]
"
    >
      Đăng xuất
    </button>
  );
}
