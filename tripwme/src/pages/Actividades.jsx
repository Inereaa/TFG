
import { useEffect, useState } from "react";
import Navegacion from "../components/Navegacion";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function Actividades() {
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/actividades")
      .then((res) => res.json())
      .then((data) => setActividades(data))
      .catch((err) => console.error("Error al obtener actividades", err));
  }, []);

return (
    <div>
      <Navegacion />

      <main className="flex flex-col items-center justify-center py-10 px-4 gap-6">
        <motion.h1
          className="text-4xl font-extrabold text-[#5c3838] text-center relative inline-block mt-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="relative z-10">Elige tu próxima aventura</span>
          <span className="absolute left-0 bottom-2 w-full h-2 bg-[#f3d6d6] z-0 rounded-lg"></span>
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {actividades.map((act, index) => (
            <motion.div
              key={act.id}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col text-center hover:shadow-xl transform hover:-translate-y-1 transition-transform duration-300"
              style={{ minHeight: '380px' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              {act.foto && (
                <img
                  src={`/img/${act.foto}`}
                  alt={act.nombre}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}
              <h2 className="text-xl font-semibold text-[#3a3a3a] mb-4 border-b-2 border-[#e07e7e] inline-block pb-3">
                {act.nombre}
              </h2>

              {act.informacion && (
                <p className="text-sm text-gray-600 mb-4 text-justify">{act.informacion}</p>
              )}

              <div className="mt-auto">
                <a
                  href={act.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#e07e7e] hover:bg-[#c36c6c] text-white font-semibold py-2 px-4 rounded-lg transition duration-300 inline-block"
                >
                  Ir a la actividad
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
