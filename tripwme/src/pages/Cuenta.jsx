
import Navegacion from "../components/Navegacion";
import Footer from "../components/Footer";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

export default function Cuenta() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [prefijo, setPrefijo] = useState("+34");
  const [errorTelefono, setErrorTelefono] = useState("");
  const navigate = useNavigate();
  const inputFotoRef = useRef();
  const baseURL = "http://localhost:8000";
  const [viajes, setViajes] = useState([]);
  const [cargandoViajes, setCargandoViajes] = useState(true);
  const prefijosComunes = ["+34", "+1", "+44", "+33", "+49", "+39", "+52", "+55"];

  useEffect(() => {
    const fetchPerfil = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/api/cuenta", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Error al obtener cuenta");
        }

        const data = await res.json();
        setUsuario(data);
        setNuevoTelefono(data.telefono ? data.telefono.slice(-9) : "");
        setPrefijo(data.telefono ? data.telefono.slice(0, data.telefono.length - 9) : "+34");
      } catch (error) {
        console.error("Error:", error);
        navigate("/login");
      } finally {
        setCargando(false);
      }
    };

    fetchPerfil();
  }, [navigate]);

  useEffect(() => {
    const fetchViajes = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:8000/api/mis-viajes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setViajes(data);
        } else {
          console.error("Error al obtener viajes");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargandoViajes(false);
      }
    };

    fetchViajes();
  }, []);

  if (cargando) return <p className="p-6 text-center">Cargando cuenta...</p>;
  if (!usuario) return null;

  const nombreSinArroba = usuario.email.split("@")[0];

  const validarTelefono = (telefono) => {
    const soloNumeros = /^[0-9]+$/.test(telefono);
    return soloNumeros && telefono.length === 9;
  };

  const guardarTelefono = async () => {
    if (!validarTelefono(nuevoTelefono)) {
      setErrorTelefono("El número debe tener exactamente 9 dígitos numéricos.");
      return;
    }

    setErrorTelefono("");

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8000/api/cuenta", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ telefono: prefijo + nuevoTelefono }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar teléfono");
      }

      const data = await res.json();
      setUsuario(data);
      setEditando(false);
    } catch (error) {
      console.error(error);
    }
  };

  const formatearTelefono = (telefonoCompleto) => {
    if (!telefonoCompleto) return "----";
    const match = telefonoCompleto.match(/^(\+\d{2})(\d{3})(\d{3})(\d{3})$/);
    if (match) return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    return telefonoCompleto;
  };

  const subirFotoPerfil = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append("foto", archivo);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/api/subir-foto", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Error al subir la foto");
      }

      const data = await res.json();
      setUsuario((prev) => ({ ...prev, foto: data.foto }));
    } catch (error) {
      console.error("Error subiendo foto:", error);
    }
  };

  const descargarPDF = (viaje) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("TRIPWME", 10, 20);

    doc.setFontSize(14);
    doc.text("Información de tu viaje:", 10, 30);

    doc.setFontSize(12);
    doc.text(`Destino: ${viaje.destino}`, 10, 45);
    doc.text(`Fecha inicio: ${viaje.fechaInicio}`, 10, 55);
    doc.text(`Fecha fin: ${viaje.fechaFin}`, 10, 65);

    doc.save(`Viaje_${viaje.destino}.pdf`);
  };

  return (
    <>
      <Navegacion />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center bg-white rounded-2xl shadow p-6 mb-8">
          <div className="relative group w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-red-700">
            <img
              src={usuario.foto ? `${baseURL}${usuario.foto}` : "/img/perfil.png"}
              alt="Foto perfil"
              className="w-full h-full object-cover rounded-full"
              onClick={() => inputFotoRef.current.click()}
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={inputFotoRef}
              onChange={subirFotoPerfil}
            />
            <div className="absolute inset-0 bg-[rgba(31,41,55,0.5)] flex items-center justify-center text-white text-sm font-semibold rounded-full opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" 
                  className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M16.768 4.768a2 2 0 112.828 2.828L7 20.172H4v-3L16.768 4.768z" />
              </svg>
            </div>
          </div>

          <div className="ml-6">
            <h2 className="text-2xl font-bold mb-1">Hola, {nombreSinArroba}</h2>
            <p className="text-red-700 font-semibold">Nivel: {usuario.nivel}</p>
            <p className="text-gray-600">Has realizado {usuario.viajes_realizados} viajes</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Tus próximos viajes</h3>

          {cargandoViajes ? (
            <p>Cargando viajes...</p>
          ) : viajes.length === 0 ? (
            <p className="text-gray-500">No tienes viajes programados.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {viajes.map((viaje) => (
                <div
                  key={viaje.viajeId}
                  className="relative border border-red-100 rounded-xl p-4 shadow hover:shadow-lg transition duration-300 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`/img/${viaje.destino.toLowerCase()}.jpg`} alt="destino"
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-red-700">{viaje.destino}</h4>
                      <p className="text-gray-600 text-sm">{`${viaje.fechaInicio} / ${viaje.fechaFin}`}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => descargarPDF(viaje)}
                    className="absolute bottom-2 right-2 bg-red-700 text-white px-2 py-1 rounded text-sm hover:bg-red-800 transition cursor-pointer">
                    Descargar PDF
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Datos Personales</h3>

          <p className="mb-2"><span className="font-semibold">Nombre de usuario <span className="text-xs">(no se puede cambiar)</span>: </span>{nombreSinArroba}</p>
          <p className="mb-2"><span className="font-semibold">Email: </span>{usuario.email}</p>

          {editando ? (
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <span className="font-semibold mr-2">Teléfono: </span>
                <select
                  value={prefijo}
                  onChange={(e) => setPrefijo(e.target.value)}
                  className="border rounded px-2 mr-2 w-20"
                >
                  {prefijosComunes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={nuevoTelefono}
                  onChange={(e) => setNuevoTelefono(e.target.value)}
                  className="border rounded px-2 w-32"
                  placeholder="9 dígitos"
                />
              </div>
              <div className="flex items-center ml-4">
                <button
                  onClick={guardarTelefono}
                  className="text-green-700 font-semibold text-sm mr-2 cursor-pointer hover:bg-green-200 p-1 px-2 rounded-md transition duration-200"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setEditando(false);
                    setErrorTelefono("");
                  }}
                  className="text-gray-800 font-semibold text-sm cursor-pointer hover:bg-gray-200 p-1 px-2 rounded-md transition duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-2 flex items-center justify-between">
              <p>
                <span className="font-semibold">Teléfono: </span>
                {formatearTelefono(usuario.telefono)}
              </p>
              <button
                className="text-red-700 font-semibold cursor-pointer hover:scale-95 transition duration-200"
                onClick={() => {
                  setEditando(true);
                  setErrorTelefono("");
                }}
              >
                Editar
              </button>
            </div>
          )}

          {errorTelefono && (
            <p className="text-red-600 text-sm mt-1">{errorTelefono}</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
