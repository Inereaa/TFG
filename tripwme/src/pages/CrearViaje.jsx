
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Componente CrearViaje.
 * 
 * Renderiza un formulario para crear un nuevo viaje.
 * Gestiona el estado del formulario, validaciones básicas y envía los datos a la API.
 * Navega a la lista de viajes tras crear un viaje exitosamente.
 * 
 * @component
 * @returns {JSX.Element} Formulario para creación de viajes.
 */
export default function CrearViaje() {
  const [viaje, setViaje] = useState({
    destino: "",
    fecha_inicio: "",
    fecha_fin: "",
    presupuesto: "",
    min_personas: "",
    max_personas: "",
  });

  const navigate = useNavigate();

  // Actualiza el estado del formulario según el input del usuario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setViaje({ ...viaje, [name]: value });
  };

  // Maneja el envío del formulario, con validaciones y llamada a la API
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const hoy = new Date();
    const fechaInicio = new Date(viaje.fecha_inicio);
    const fechaFin = new Date(viaje.fecha_fin);
  
    if (fechaInicio < hoy.setHours(0, 0, 0, 0)) {
      alert("La fecha de inicio no puede ser anterior a hoy.");
      return;
    }
  
    if (fechaFin < fechaInicio) {
      alert("La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }

    if (parseInt(viaje.min_personas) < 1) {
      alert("El número mínimo de personas debe ser al menos 1.");
      return;
    }
  
    if (parseInt(viaje.max_personas) <= parseInt(viaje.min_personas)) {
      alert("El número máximo de personas debe ser mayor que el mínimo.");
      return;
    }
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Error: usuario no autenticado.");
      return;
    }
  
    try {
      const response = await fetch("https://tripwme.work.gd/api/viajes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(viaje),
      });
  
      if (!response.ok) {
        throw new Error("Error al crear el viaje");
      }
  
      const data = await response.json();
      alert("Viaje creado correctamente");
      console.log(data);
      navigate("/viajes");
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al crear el viaje.");
    }
  };
  

  return (
    <div className="min-h-screen bg-[#f6fbf0] flex flex-col">
      <nav className="flex justify-center items-center px-6 py-4 bg-[#bad0bb] shadow-md">
        <Link to="/">
          <img
            src="/img/imagen_2025-04-02_110941347-removebg-preview.png"
            alt="logo"
            className="h-14 mr-200 cursor-pointer hover:scale-105 transform duration-300"
          />
        </Link>

        <div className="relative group flex items-center justify-center">
          <button className="text-[#5c3838] text-sm hover:underline hover:text-[#c36c6c] transition cursor-pointer">
            ¿Ayuda?
          </button>
          <div className="absolute gap-1 flex flex-col items-center top-full mt-2 w-64 bg-white border border-gray-200 shadow-md rounded-md p-3 text-sm text-gray-700 z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 left-1/2 -translate-x-1/2">
            ¿Necesitas ayuda? Contáctanos:<br />
            <strong className="text-[#163e15]">helptripwme@gmail.com</strong>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl p-8 mt-8 space-y-6 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center text-[#6e3e3e]">✈️ Crear nuevo viaje</h2>
            <p className="text-sm text-center text-gray-600">¡Completa los detalles para organizar un nuevo viaje!</p>
          </div>

          <div className="space-y-4">
            <select
              name="destino"
              value={viaje.destino}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bad0bb]"
              required
            >
              <option value="">Selecciona un destino</option>
              <optgroup label="🌍 Europa">
                <option value="España">España</option>
                <option value="Francia">Francia</option>
                <option value="Italia">Italia</option>
                <option value="Alemania">Alemania</option>
                <option value="Grecia">Grecia</option>
              </optgroup>
              <optgroup label="🌏 Asia">
                <option value="Japón">Japón</option>
                <option value="China">China</option>
                <option value="Corea del Sur">Corea del Sur</option>
              </optgroup>
              <optgroup label="🌎 América">
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="México">México</option>
                <option value="Brasil">Brasil</option>
                <option value="Argentina">Argentina</option>
                <option value="Colombia">Colombia</option>
              </optgroup>
              <optgroup label="🌍 África">
                <option value="Marruecos">Marruecos</option>
                <option value="Egipto">Egipto</option>
              </optgroup>
              <optgroup label="🌏 Oceanía">
                <option value="Australia">Australia</option>
              </optgroup>
            </select>

            <div className="flex gap-4 items-center">
              <p className="text-sm">Fecha inicio: </p>
              <input
                type="date"
                name="fecha_inicio"
                value={viaje.fecha_inicio}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bad0bb]"
                required
              />
              <p className="text-sm">Fecha fin: </p>
              <input
                type="date"
                name="fecha_fin"
                value={viaje.fecha_fin}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bad0bb]"
                required
              />
            </div>

            <input
              type="number"
              step="0.01"
              name="presupuesto"
              placeholder="Presupuesto mínimo (€)"
              value={viaje.presupuesto}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bad0bb]"
              required
            />

            <div className="flex gap-4">
              <input
                type="number"
                name="min_personas"
                placeholder="Mínimo personas"
                value={viaje.min_personas}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bad0bb]"
                required
              />
              <input
                type="number"
                name="max_personas"
                placeholder="Máximo personas"
                value={viaje.max_personas}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bad0bb]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#a6c3a1] hover:bg-[#8aad88] text-white font-semibold py-3 rounded-md transition duration-300 cursor-pointer"
          >
            Crear viaje
          </button>

          <div className="text-center">
            <Link
              to="/viajes"
              className="text-[#5c3838] text-sm hover:underline hover:text-[#c36c6c] transition duration-200"
            >
              ← Volver a viajes
            </Link>
            <hr className="opacity-20 mt-4 mb-4" />
            <div className="flex flex-col items-center gap-4">
              <div>
                <p className="text-xs opacity-50 text-center w-80">Todos los derechos reservados.</p>
                <p className="text-xs opacity-50 text-center w-80">&copy; 2024 - 2025 tripWme.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
