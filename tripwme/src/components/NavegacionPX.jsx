
import { Link } from "react-router";

/**
 * Componente NavegacionPX que renderiza una barra de navegación simplificada para pantallas pequeñas.
 * Contiene enlaces a las secciones principales y un logo central.
 *
 * @component
 * 
 * @returns {JSX.Element} Barra de navegación con enlaces y logo.
 */
export default function NavegacionPX() {
  
    return (
      <>
        <nav className="bg-verdePX rounded-b-full max-md:h-10 flex flex-col justify-center">
          <ul className="flex justify-around items-center max-lg:ml-5 max-lg:mr-5">
            <li className="cursor-pointer max-sm:text-sm font-semibold hover-nav transform"><Link to="/">Inicio</Link></li>
            <li className="cursor-pointer max-sm:text-sm font-semibold hover-nav transform"><Link to="/viajes">Viajes</Link></li>
            <img src="img/imagen_2025-04-02_110941347-removebg-preview.png" alt="logo" className="hidden md:block md:w-25 lg:w-35 logo-mov" />
            <li className="cursor-pointer max-sm:text-sm font-semibold hover-nav transform"><Link to="/actividades">Actividades</Link></li>
            <li className="cursor-pointer max-sm:text-sm font-semibold hover-nav transform"><Link to="/cuenta">Mi cuenta</Link></li>
          </ul>
        </nav>
      </>
    )
}
