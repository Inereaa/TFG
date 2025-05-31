
import { useEffect, useState } from "react";
import TarjetaViaje from "./Viaje";

export default function ViajesDestacados() {
  const [viajes, setViajes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/viajes/destacados")
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar viajes destacados");
        return res.json();
      })
      .then(data => setViajes(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p className="text-red-600 text-center mt-4">{error}</p>;

  return (
    <section className="max-w-6xl mx-auto mt-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      {viajes.length === 0 ? (
        <p className="text-center col-span-3">Cargando viajes destacados...</p>
      ) : (
        (() => {
          const viajesFiltrados = viajes.filter(viaje => viaje.diasRestantes >= 1);
          if (viajesFiltrados.length === 0) {
            return <p className="text-center col-span-3 px-6 py-1 rounded-full text-sm text-green-900"><i>Actualmente no hay viajes disponibles...</i></p>;
          }
          return viajesFiltrados.map(viaje => <TarjetaViaje key={viaje.id} viaje={viaje} />);
        })()
      )}
    </section>
  );
}
