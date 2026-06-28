import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b px-8 py-4 flex items-center justify-between top-0 left-0 right-0 sticky">
      <h1 className="text-xl font-bold text-slate-900">Second Brain</h1>

      <div className="flex items-center gap-6">
        <Link className="text-slate-700 hover:text-black" to="/dashboard">
          Notes
        </Link>
        <Link className="text-slate-700 hover:text-black" to="/search">
          Search
        </Link>
        <Link className="text-slate-700 hover:text-black" to="/chat">
          Chat
        </Link>

        <button
          onClick={logout}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;