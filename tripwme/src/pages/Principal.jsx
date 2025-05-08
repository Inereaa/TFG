
import BuscarPX from "../components/BuscarPX";
import NavegacionPX from "../components/NavegacionPX";
import FooterPX from "../components/FooterPX";

export default function Principal({ setCarrito, carrito }) {
    return (
      <div className="bg-MAIN relative min-h-screen">
        <div className="relative z-10">
          <NavegacionPX />
        </div>

        <main className="flex flex-col items-center h-200 relative z-10">
          <BuscarPX />
        </main>

        <div className="relative z-10">
          <FooterPX />
        </div>
      </div>
    );
}
