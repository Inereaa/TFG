
import Navegacion from "../components/Navegacion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cuenta() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [prefijo, setPrefijo] = useState("+34");
  const [errorTelefono, setErrorTelefono] = useState("");
  const navigate = useNavigate();

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

  return (
    <>
      <Navegacion />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center bg-white rounded-2xl shadow p-6 mb-8">
          <img
            src={usuario.foto}
            alt="Foto perfil"
            className="w-24 h-24 rounded-full mr-6 border-2 border-red-700"
          />
          <div>
            <h2 className="text-2xl font-bold mb-1">Hola, {nombreSinArroba}</h2>
            <p className="text-red-700 font-semibold">Nivel: {usuario.nivel}</p>
            <p className="text-gray-600">Has realizado {usuario.viajes_realizados} viajes</p>
          </div>
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

        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Seguridad</h3>
          <button className="text-red-700 font-semibold mb-2 block">Cambiar contraseña</button>
          <button className="text-red-700 font-semibold block">Activar 2FA</button>
        </div>
      </div>
    </>
  );
}
