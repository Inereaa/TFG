
export default function Buscar({ filtros, setFiltros }) {
    const handleDestinoChange = (e) => {
      setFiltros((prev) => ({
        ...prev,
        destino: e.target.value,
      }));
    };
  
    const handleFechaChange = (e) => {
      setFiltros((prev) => ({
        ...prev,
        fechaInicio: e.target.value,
      }));
    };
  
    return (
      <section className="bg-white shadow-lg rounded-3xl p-6 max-md:mt-2 max-xl:mt-2 max-md:max-w-md max-xl:max-w-2xl max-w-md xl:max-w-4xl mx-auto mb-6 max-xl:flex max-xl:justify-center">
        <div className="xl:w-full md:w-150 w-80 flex flex-col md:flex-row items-center justify-center gap-6">
          <input
            type="text"
            placeholder="Destino..."
            value={filtros.destino}
            onChange={handleDestinoChange}
            className="p-3 rounded-xl w-full md:w-1/3 bg-[#f3dada] pl-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <input
            type="date"
            value={filtros.fechaInicio}
            onChange={handleFechaChange}
            className="bg-[#f3dada] rounded-xl p-3 pl-6 w-full md:w-[200px] text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-xl font-semibold text-lg hover:bg-red-700 cursor-pointer transition duration-300 w-full md:w-auto"
            disabled
          >
            Buscar
          </button>
        </div>
      </section>
    );
  }
  