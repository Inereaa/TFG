
import { useState } from "react";

/**
 * Componente Ordenar que permite seleccionar el criterio de ordenación para una lista.
 *
 * @param {Object} props
 * @param {function(string): void} props.setOrden - Función para actualizar el criterio de ordenación seleccionado en el componente padre.
 * 
 * @component
 * 
 * @returns {JSX.Element} Un select desplegable para elegir el orden.
 */
export default function Ordenar({ setOrden }) {
  const [orden, setOrdenInternal] = useState("Precio (más caro primero)");

  const opcionesOrden = [
    "Precio (más caro primero)",
    "Precio (más bajo primero)",
    "Fecha (más próxima primero)",
    "Fecha (más lejana primero)",
  ];

  const handleChange = (e) => {
    setOrdenInternal(e.target.value);
    setOrden(e.target.value);
  };

  return (
    <div className="relative md:inline-block text-left mt-2 ml-6 hidden">
      <label className="mr-2 font-semibold text-sm text-gray-700">Ordenar por:</label>
      <select
        value={orden}
        onChange={handleChange}
        className="border border-gray-300 rounded-xl py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-sm w-[250px] cursor-pointer"
      >
        {opcionesOrden.map((opcion, idx) => (
          <option key={idx} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    </div>
  );
}
