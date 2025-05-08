
import { Link, useNavigate } from "react-router-dom";

export default function Navegacion() {
  const navigate = useNavigate();
  
  const isLoggedIn = localStorage.getItem("token");
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirigir al inicio después de cerrar sesión
  };

  return (
    <header className="bg-[#bad0bb] flex justify-between items-center px-10 py-4">
      <img src="/img/logoR.png" alt="logo" className="h-25 -mt-3 -mb-3" />
      <nav className="flex gap-24 font-semibold">
        <li className="list-none cursor-pointer max-sm:text-sm font-semibold hover-nav transform">
          <Link to="/">Inicio</Link>
        </li>
        <li className="list-none cursor-pointer max-sm:text-sm font-semibold hover-nav transform">
          <Link to="/viajes">Viajes</Link>
        </li>
        <li className="list-none cursor-pointer max-sm:text-sm font-semibold hover-nav transform">
          <Link to="/reventas">Reventas</Link>
        </li>
        <li className="list-none cursor-pointer max-sm:text-sm font-semibold hover-nav transform mr-12">
          <Link to="/perfil">Mi perfil</Link>
        </li>
        {isLoggedIn ? (
          <button
            className="border px-4 py-1 rounded-md bg-verdePX mr-6 text-gray-800 hover-nav cursor-pointer transform"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        ) : (
          <Link
            to="/login"
            className="border px-4 py-1 rounded-md bg-verdePX mr-6 text-gray-800 hover-nav cursor-pointer transform"
          >
            Iniciar sesión / Registrarme
          </Link>
        )}
      </nav>
    </header>
  );
}
