
import BuscarPX from "../components/BuscarPX";
import NavegacionPX from "../components/NavegacionPX";
import FooterPX from "../components/FooterPX";
import ViajesDestacados from "../components/ViajesDestacados";

export default function Principal() {
    return (
      <div className="bg-MAIN relative min-h-screen">
        <div className="relative z-10">
          <NavegacionPX />
        </div>

        <section className="hidden xl:block relative w-full max-w-5xl mx-auto p-10 text-center text-gray-900 bg-verdePX rounded-b-full">
          <h1 className="text-5xl font-extrabold mb-3">
            Explora el mundo con <span className="text-red-700">tripWme</span>
          </h1>
          <p className="text-lg max-w-3xl mx-auto mb-6 opacity-50">
            Descubre viajes únicos, actividades exclusivas y experiencias memorables, adaptadas solo para ti.
          </p>
          <hr className="w-24 mx-auto border-red-600 mb-6" />
          <p className="text-sm text-gray-800 uppercase tracking-widest">Tu próxima aventura comienza aquí</p>
        </section>

        <main className="flex flex-col items-center h-160 relative z-10">
          <BuscarPX />
        </main>

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
