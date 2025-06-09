
import BuscarPX from "../components/BuscarPX";
import NavegacionPX from "../components/NavegacionPX";
import FooterPX from "../components/FooterPX";
import ViajesDestacados from "../components/ViajesDestacados";
import { motion } from "framer-motion";

/**
 * Componente Principal
 * 
 * Página principal que muestra la navegación, un banner animado con presentación,
 * un buscador de viajes, viajes destacados y el pie de página.
 * Utiliza animaciones con Framer Motion para las transiciones visuales.
 * 
 * @component
 * @returns {JSX.Element} Página principal con contenido destacado y navegación
 */
export default function Principal() {
    return (
      <div className="bg-MAIN relative min-h-screen">
        <div className="relative z-10">
          <NavegacionPX />
        </div>

        <section className="hidden xl:block relative w-full max-w-5xl mx-auto p-10 text-center text-gray-900 bg-verdePX rounded-b-full">
          <motion.h1
            className="text-5xl font-extrabold mb-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Explora el mundo con <span className="text-red-700">tripWme</span>
          </motion.h1>
          <motion.p
            className="text-lg max-w-3xl mx-auto mb-6 opacity-50"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Descubre viajes únicos, actividades exclusivas y experiencias memorables, adaptadas solo para ti.
          </motion.p>
          <motion.hr
            className="w-24 mx-auto border-red-600 mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{ transformOrigin: 'center' }}
          />
          <motion.p
            className="text-sm text-gray-800 uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Tu próxima aventura comienza aquí
          </motion.p>
        </section>

        <motion.main
          className="flex flex-col items-center h-160 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <BuscarPX />
        </motion.main>

        <section className="relative flex flex-col items-center max-md:-mt-20">
          <h2 className="bg-green-900 text-white xl:text-3xl text-2xl font-extrabold px-6 py-3 mb-6 w-80 xl:w-140 text-center rounded-md"> Viajes destacados </h2>
          <ViajesDestacados />
        </section>

        <div className="relative z-10">
          <FooterPX />
        </div>
      </div>
    );
}
