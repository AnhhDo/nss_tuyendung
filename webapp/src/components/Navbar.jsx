import LogoutButton from "../login_components/SignOut";
import "./component-style.css";

const Navbar = ({name}) => {
  return (
    <nav className="nav-bar">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="web-header">
            <span className="material-symbols-outlined text-white text-xl">
              layers
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">{name}</h1>
        </div>
        <LogoutButton/>
      </div>
    </nav>
  );
};

export default Navbar;
