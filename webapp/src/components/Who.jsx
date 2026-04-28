import { useAuth } from "../login_components/AuthContext";

const Who = () => {
  const session = useAuth();
  const email = session?.user?.email;

  return (
    <div className="w-full max-w-7xl mx-auto px-8 mt-6">
      <h2 className="text-slate-200 font-bold">Xin chào CBTD {email ?? "test"}</h2>
    </div>
  );
};

export default Who;
