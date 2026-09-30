import { Link, NavLink, useNavigate } from "react-router-dom";

const menuClass = ({ isActive }) =>
  `btn btn-sm ${isActive ? " btn-active" : "btn-ghost"}`;

const Navbar = () => {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }
  return (
    <div className="navbar border-b bg-base-100 px-4">
      <div className="flex-1">
        <Link to="/" className="text-lg font-bold">
          Inventaris Aset
        </Link>
      </div>
      <div className="flex gap-2">
        <NavLink to="/" end className={menuClass}>
          Dashboard
        </NavLink>
        <NavLink to="/kategori" className={menuClass}>
          Kategori
        </NavLink>
        <NavLink to="/aset" className={menuClass}>
          Aset
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-primary btn-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;