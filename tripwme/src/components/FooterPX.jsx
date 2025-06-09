
/**
 * Componente Footer que representa el pie de página del sitio.
 * Muestra el logo de la aplicación, enlaces informativos como
 * términos, cookies y privacidad, y un aviso de derechos reservados.
 *
 * @component
 * @returns {JSX.Element} Elemento JSX que representa el pie de página.
 */
export default function Footer() {
    return (
        <footer className="flex flex-col items-center mt-100">
          <section className="bg-verdePX w-full flex flex-col items-center gap-6 p-10">
            <div className="flex items-center">
              <img src="../img/imagen_2025-04-02_110941347-removebg-preview.png" alt="logo" className="w-25" />
              <p className="text-red-800 text-lg">tripWme</p>
            </div>
            <div>
              <ul className="flex max-sm:flex-col gap-16 opacity-80 max-sm:items-center max-sm:gap-10">
                <li className="underline cursor-pointer hover-footer transform max-md:text-sm">Términos y condiciones</li>
                <p className="max-sm:hidden">|</p>
                <li className="underline cursor-pointer hover-footer transform max-md:text-sm">Uso de cookies</li>
                <p className="max-sm:hidden">|</p>
                <li className="underline cursor-pointer hover-footer transform max-md:text-sm">Política de privacidad</li>
              </ul>
            </div>
            <div>
              <p className="opacity-60 max-md:text-sm">&copy; 2024 - 2025 tripWme. Todos los derechos reservados.</p>
            </div>
          </section>
        </footer>
    );
}
