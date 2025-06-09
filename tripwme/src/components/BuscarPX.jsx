
import { useNavigate } from "react-router";
import { useState } from "react";

/**
 * Componente de búsqueda principal para la pantalla de inicio.
 * Permite al usuario ingresar un destino y una fecha, y redirige
 * a la página de resultados de viajes con filtros aplicados por query string.
 *
 * @component
 * @example
 * return <BuscarPX />
 *
 * @returns {JSX.Element} Formulario de búsqueda con inputs de texto y fecha, y un botón para buscar viajes.
 */
export default function BuscarPX() {
  const navigate = useNavigate();

  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');

  /**
   * Maneja el clic en el botón de búsqueda.
   * Crea la query string a partir del destino y fecha seleccionados
   * y navega a la página de resultados.
   */
  const handleClick = () => {
    const queryParams = new URLSearchParams();
    if (destino) queryParams.append("destino", destino);
    if (fecha) queryParams.append("fechaInicio", fecha);

    navigate(`/viajes?${queryParams.toString()}`);
  };

  return (
    <main className="flex flex-col items-center h-200">
      <section className="bg-verdePXOP flex flex-col items-center gap-10 mt-14 w-120 pt-2 pb-6 rounded-2xl max-sm:w-80">
        <div>
          <img src="/img/logoR.png" alt="logo" className="w-35" />
        </div>
        <div className="flex flex-col gap-6 justify-center">
          <input
            type="text"
            placeholder="Destino..."
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className="bgcolor-inputPX rounded-3xl p-2 w-75 pl-6 max-sm:w-60"
          />
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="bgcolor-inputPX rounded-3xl p-2 w-75 pl-6 pr-6 text-gray-900 max-sm:w-60"
          />
        </div>
        <button
          onClick={handleClick}
          className="bg-red-800 text-white p-2 rounded-2xl w-50 cursor-pointer flex items-center justify-center gap-2 font-bold animate-bounce"
        >
          BUSCAR VIAJES
          <img src="/img/buscarviajes.png" alt="buscar" className="w-10" />
        </button>
      </section>
    </main>
  );
}
