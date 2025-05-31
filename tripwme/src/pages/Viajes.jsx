
import Navegacion from "../components/Navegacion";
import Footer from "../components/Footer";
import Filtros from "../components/Filtros";
import Buscar from "../components/Buscar";
import Ordenar from "../components/Ordenar";
import ListarViajes from "../components/ListarViajes";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Viajes() {
  const location = useLocation();
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [filtros, setFiltros] = useState({
    destino: "",
    fechaInicio: "",
    precioMaximo: null,
    continentes: [],
  });
  const [orden, setOrden] = useState("Precio (más caro primero)");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUsuarioAutenticado(!!token);

    const queryParams = new URLSearchParams(location.search);
    const destino = queryParams.get("destino");
    const fechaInicio = queryParams.get("fechaInicio");

    setFiltros((prev) => ({
      ...prev,
      destino: destino || "",
      fechaInicio: fechaInicio || "",
    }));
  }, [location.search]);

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <Navegacion />
      <div className="-mt-4">
        <Buscar filtros={filtros} setFiltros={setFiltros} />
      </div>

      <div className="flex px-10 py-8 gap-10 ml-60 mr-60">
        <Filtros setFiltros={setFiltros} filtros={filtros} />

        <section className="xl:w-3/4 flex flex-col gap-6">
          <Ordenar setOrden={setOrden} />

          {usuarioAutenticado && (
            <div className="flex xl:justify-end justify-center">
              <p className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 xl:px-6 xl:py-3 rounded-xl font-semibold transition cursor-pointer">
                <Link to="/crearviaje">➕ <span className="hidden md:inline-block"> Crear nuevo viaje</span></Link>
              </p>
            </div>
          )}

          <ListarViajes filtros={filtros} orden={orden} />
        </section>
      </div>
      <Footer />
    </div>
  );
}
