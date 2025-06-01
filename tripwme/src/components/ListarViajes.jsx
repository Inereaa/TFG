
import { useEffect, useState } from "react";
import Viaje from "./Viaje";
import { motion } from "framer-motion";

export default function ListarViajes({ filtros, orden }) {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);

  const paisesPorContinente = {
    Europa: ["España", "Francia", "Italia", "Alemania", "Grecia"],
    Asia: ["Japón", "China", "Corea del Sur"],
    América: ["Estados Unidos", "México", "Brasil", "Argentina", "Colombia"],
    África: ["Marruecos", "Egipto"],
    Oceanía: ["Australia"],
  };

  useEffect(() => {
    fetch("http://tripwme.work.gd:8080/api/viajes")
      .then((res) => res.json())
      .then((data) => {
        setViajes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar los viajes:", error);
        setLoading(false);
      });
  }, []);

  const hoy = new Date().toISOString().split("T")[0];

  const viajesFiltrados = viajes.filter((viaje) => {
    const fechaInicio = new Date(viaje.fechaInicio).toISOString().split("T")[0];
  
    const coincideDestino = viaje.destino
      .toLowerCase()
      .includes(filtros.destino.toLowerCase());
  
    const coincideFecha =
      !filtros.fechaInicio || fechaInicio >= filtros.fechaInicio;
  
    const coincidePrecioMax =
      !filtros.precioMaximo || viaje.presupuestoMinimo <= filtros.precioMaximo;    
    
    const coincideContinente =
    !filtros.continentes || filtros.continentes.length === 0
      ? true
      : filtros.continentes.some((continente) =>
          paisesPorContinente[continente]?.includes(viaje.destino)
        );
      
    const coincidePersonas =
    !filtros.personasMaximo || viaje.maxPersonas <= filtros.personasMaximo;
  
    return (
      coincideDestino &&
      coincideFecha &&
      coincidePrecioMax &&
      coincideContinente &&
      coincidePersonas &&
      fechaInicio > hoy
    );    
  });
  
  const ordenarViajes = (viajes) => {
    switch (orden) {
      case "Precio (más caro primero)":
        return viajes.sort((a, b) => b.presupuestoMinimo - a.presupuestoMinimo );
      case "Precio (más bajo primero)":
        return viajes.sort((a, b) => a.presupuestoMinimo - b.presupuestoMinimo );
      case "Fecha (más próxima primero)":
        return viajes.sort(
          (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)
        );
      case "Fecha (más lejana primero)":
        return viajes.sort(
          (a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio)
        );
      default:
        return viajes;
    }
  };
  
  const viajesOrdenados = ordenarViajes(viajesFiltrados);

  if (loading) return <p className="text-center mt-10">Cargando viajes...</p>;

  return (
    <div className="flex flex-col gap-10">
      {viajesOrdenados.length > 0 ? (
        viajesOrdenados.map((viaje, index) => (
          <motion.div
            key={viaje.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Viaje viaje={viaje} />
          </motion.div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-6">No se encontraron viajes.</p>
      )}
    </div>
  );
}
