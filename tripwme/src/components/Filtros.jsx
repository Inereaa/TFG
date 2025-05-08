
import { useState } from "react";

export default function Filtros({ setFiltros }) {
    const [precioMaximo, setPrecioMaximo] = useState(null);
    const [continentesSeleccionados, setContinentesSeleccionados] = useState([]);
    const [personasMaximo, setPersonasMaximo] = useState(20);
  
    const handlePrecioMaximoChange = (e) => {
      const value = e.target.value;
      setPrecioMaximo(value);
      setFiltros((prev) => ({
        ...prev,
        precioMaximo: parseFloat(value),
      }));
    };

    const paisesPorContinente = {
      Europa: ["España", "Francia", "Italia", "Alemania", "Grecia"],
      Asia: ["Japón", "China", "Corea del Sur"],
      América: ["Estados Unidos", "México", "Brasil", "Argentina", "Colombia"],
      África: ["Marruecos", "Egipto"],
      Oceanía: ["Australia"],
    };
    
    const handleContinenteChange = (e) => {
      const continente = e.target.value;
      setContinentesSeleccionados((prev) =>
        e.target.checked
          ? [...prev, continente]
          : prev.filter((c) => c !== continente)
      );
    
      setFiltros((prev) => ({
        ...prev,
        continentes: e.target.checked
          ? [...(prev.continentes || []), continente]
          : (prev.continentes || []).filter((c) => c !== continente),
      }));
    };

    const handlePersonasMaximoChange = (e) => {
      const value = parseInt(e.target.value);
      setPersonasMaximo(value);
      setFiltros((prev) => ({
        ...prev,
        personasMaximo: value,
      }));
    };

  return (
    <aside className="w-1/4 bg-[#f2dede] p-4 rounded-xl shadow-md flex flex-col gap-6 h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="w-full h-64 rounded-xl overflow-hidden shadow-md">
        <iframe
          title="mapa"
          className="w-full h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086347368292!2d-122.41941618468161!3d37.77492977975921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f7e2d11cbba13%3A0x4d7595585f0d3549!2sSan+Francisco%2C+CA!5e0!3m2!1ses!2ses!4v1682515790137!5m2!1ses!2ses"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <button className="bg-[#e07e7e] text-white py-2 rounded-md font-semibold hover:bg-[#c36c6c] duration-300 cursor-pointer">Ver en el mapa</button>
      <hr />
      <div className="ml-2 mr-2">
        <h3 className="font-bold mb-2">Tu presupuesto (total)</h3>
        <p className="ml-4 mb-2 font-light">€ {precioMaximo}</p>
        <input
          type="range"
          min="1"
          max="5000"
          value={precioMaximo}
          onChange={handlePrecioMaximoChange}
          className="w-full"
        />
      </div>
      <hr />
      <div className="ml-2 mr-2">
        <h3 className="font-bold mb-2">Continente</h3>
        <ul className="space-y-3 text-sm ml-2 mt-4">
          {Object.keys(paisesPorContinente).map((continente) => (
            <li key={continente}>
              <input
                type="checkbox"
                value={continente}
                checked={continentesSeleccionados.includes(continente)}
                onChange={handleContinenteChange}
              />
              <span className="ml-2">{continente}</span>
            </li>
          ))}
        </ul>
      </div>
      <hr />
      <div className="ml-2 mr-2">
        <h3 className="font-bold mb-2">Nº de personas máximo</h3>
        <p className="ml-4 mb-2 font-light">{personasMaximo} personas</p>
        <input
          type="range"
          min="2"
          max="20"
          value={personasMaximo}
          onChange={handlePersonasMaximoChange}
          className="w-full"
        />
      </div>
    </aside>
  );
}
