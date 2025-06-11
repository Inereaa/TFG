
import { useEffect, useState } from "react";

/**
 * Componente que muestra la información de un viaje y permite al usuario unirse, cancelar su plaza o, si es el organizador,
 * cancelar el viaje completo.
 *
 * @param {Object} props
 * @param {Object} props.viaje - Objeto con la información del viaje.
 * @param {number} props.viaje.id - ID único del viaje.
 * @param {string} props.viaje.destino - Destino del viaje.
 * @param {string} props.viaje.fechaInicio - Fecha de inicio del viaje (formato ISO).
 * @param {string} props.viaje.fechaFin - Fecha de fin del viaje (formato ISO).
 * @param {number} props.viaje.presupuestoMinimo - Presupuesto mínimo necesario para el viaje.
 * @param {number} props.viaje.minPersonas - Número mínimo de personas para el viaje.
 * @param {number} props.viaje.maxPersonas - Número máximo de personas para el viaje.
 * @param {Object} props.viaje.usuarioOrganizador - Información del usuario organizador.
 * @param {number} props.viaje.usuarioOrganizador.id - ID del organizador.
 * @param {string} props.viaje.usuarioOrganizador.nombre - Nombre o email del organizador.
 * 
 * @component
 * 
 * @returns {JSX.Element} Una tarjeta con detalles del viaje y opciones para interactuar según el estado del usuario.
 */
export default function TarjetaViaje({ viaje }) {
    const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
    const [misViajes, setMisViajes] = useState([]);
    const [numParticipantes, setNumParticipantes] = useState(0);
    const [userId, setUserId] = useState(null);
  
    useEffect(() => {
        const token = localStorage.getItem("token");
        setUsuarioAutenticado(!!token);

        fetch("https://tripwme.work.gd:8080/api/me", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setUserId(data.id))
        .catch(err => console.error("Error al obtener usuario:", err));

        fetch("https://tripwme.work.gd:8080/api/mis-viajes", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(async (res) => {
            if (!res.ok) {
            const text = await res.text();
            console.error("Error en mis-viajes:", text);
            throw new Error("Error al obtener mis viajes");
            }
            return res.json();
        })
        .then((data) => setMisViajes(data))
        .catch((err) => console.error(err));

        fetch(`https://tripwme.work.gd:8080/api/viajes/${viaje.id}/participantes`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text();
                console.error("Error en participantes:", text);
                throw new Error("Error al obtener participantes");
            }
            return res.json();
        })
        .then((data) => {
            setNumParticipantes(data.total);
        });
    }, [viaje.id]);
  
    const yaInscrito = misViajes.some((v) => Number(v.viajeId) === Number(viaje.id));
    const viajeLleno = numParticipantes >= viaje.maxPersonas;
    const esOrganizador = userId === viaje.usuarioOrganizador.id;
  
    const unirse = async () => {
        console.log("Intentando unirse al viaje:", viaje.id);
        
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        const res = await fetch(`https://tripwme.work.gd:8080/api/unirse/${viaje.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        if (res.ok) {
            alert("¡Te uniste con éxito!");
            window.location.reload();
        } else {
            alert(data.error || "Error al unirte");
        }
    };    
  
    const cancelar = async () => {
        const usuarioViaje = misViajes.find((v) => v.viajeId === viaje.id);
        const token = localStorage.getItem("token");
        const res = await fetch(`https://tripwme.work.gd:8080/api/cancelar-plaza/${usuarioViaje.id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        const data = await res.json();
        if (res.ok) {
            alert("Plaza cancelada");
            setMisViajes((prev) => prev.filter((v) => v.id !== usuarioViaje.id));
            setNumParticipantes((prev) => prev - 1);
        } else {
            alert(data.error || "Error al cancelar");
        }
    };

    const handleCancelarPlaza = async () => {
        const confirmar = confirm("¿Estás seguro de que quieres cancelar tu plaza?");
        if (!confirmar) return;
        await cancelar();
    };

    const handleCancelarViaje = async () => {
        const confirmar = confirm("⚠️ Estás a punto de cancelar este viaje y eliminar a todos los participantes. ¿Estás seguro?");
        if (!confirmar) return;

        const token = localStorage.getItem("token");
        const res = await fetch(`https://tripwme.work.gd:8080/api/cancelar-viaje/${viaje.id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        if (res.ok) {
            alert("Viaje cancelado con éxito");
            window.location.reload();
        } else {
            alert(data.error || "Error al cancelar el viaje");
        }
    };

    const renderBoton = () => {
        if (!usuarioAutenticado) {
            return <p className="text-sm italic mt-2">Inicia sesión para saber más</p>;
        }

        if (esOrganizador) {
            return (
                <button
                    onClick={handleCancelarViaje}
                    className="bg-black text-white px-4 py-2 mt-2 rounded-xl font-bold hover:bg-gray-800 transition duration-300 cursor-pointer"
                >
                    Cancelar viaje
                </button>
            );
        }

        if (yaInscrito) {
            return (
                <>
                    <button
                        onClick={handleCancelarPlaza}
                        className="bg-yellow-600 text-white px-4 py-2 mt-2 rounded-xl font-bold hover:bg-yellow-700 transition duration-300 cursor-pointer"
                    >
                        Cancelar plaza
                    </button>
                    <small className="mt-2 opacity-60">¡Ya te has unido a este viaje!</small>
                </>
            );
        }

        if (viajeLleno) {
            return <p className="text-sm font-bold text-red-600 mt-2">¡Este viaje ya está lleno!</p>;
        }

        return (
            <>
                <button
                    onClick={unirse}
                    className="bg-red-500 text-white px-4 py-2 mt-2 rounded-xl font-bold cursor-pointer hover:bg-red-700 transition duration-300"
                >
                    Unirme
                </button>
                <small className="mt-2 opacity-60"><i>¿Te interesa? ¡Pues únete! ^</i></small>
            </>
        );
    };

    const continentePorDestino = {
        Europa: [
            "España", "Francia", "Italia", "Alemania", "Grecia"
        ],
        Asia: [
            "Japón", "China", "Corea del Sur"
        ],
        América: [
            "Estados Unidos", "México", "Brasil", "Argentina", "Colombia"
        ],
        África: [
            "Marruecos", "Egipto"
        ],
        Oceanía: [
            "Australia"
        ]
    };

    let continente = "Otros";
    Object.keys(continentePorDestino).forEach((key) => {
        if (continentePorDestino[key].includes(viaje.destino)) {
            continente = key;
        }
    });

    const fechaActual = new Date();
    const fechaInicio = new Date(viaje.fechaInicio);
    const diferenciaDias = Math.ceil((fechaInicio - fechaActual) / (1000 * 60 * 60 * 24));

    let tarjetaColor = "";
    let diasRestantesColor = "";

    switch (continente) {
        case "Europa":
            tarjetaColor = "bg-blue-100";
            diasRestantesColor = "bg-blue-200";
            break;
        case "Asia":
            tarjetaColor = "bg-red-100";
            diasRestantesColor = "bg-red-200";
            break;
        case "Oceanía":
            tarjetaColor = "bg-green-100";
            diasRestantesColor = "bg-green-200";
            break;
        case "África":
            tarjetaColor = "bg-brown-100";
            diasRestantesColor = "bg-brown-200";
            break;
        case "América":
            tarjetaColor = "bg-purple-100";
            diasRestantesColor = "bg-purple-200";
            break;
        default:
            tarjetaColor = "bg-gray-100";
            diasRestantesColor = "bg-gray-200";
            break;
    }

    return (
        <div className={`flex p-6 md:py-6 md:px-8 xl:p-8 rounded-4xl shadow-md items-center ${tarjetaColor} relative`}>
          <img src={`/img/${viaje.destino.toLowerCase()}.jpg`} alt="destino" className="h-30 w-30 md:w-40 md:h-40 xl:w-50 xl:h-50 object-cover rounded-2xl mr-10" />
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-2xl mb-2 xl:mb-6">{viaje.destino}</h2>
            <p>📅 {viaje.fechaInicio} // {viaje.fechaFin}</p>
            <p>💶<span className="hidden xl:inline"> Presupuesto mínimo: </span> {viaje.presupuestoMinimo} €</p>
            <p>👥<span className="hidden xl:inline"> Nº de personas: </span> {viaje.minPersonas} - {viaje.maxPersonas}</p>
            <p><i className="hidden xl:inline">🧑‍💼 Email de contacto:<span className="font-semibold"> {viaje.usuarioOrganizador.nombre}</span></i></p>
          </div>
          <div className="absolute xl:top-6 xl:right-10 text-center bottom-4 right-4 flex flex-col">
            <div className={`flex flex-col items-center ${diasRestantesColor} rounded-3xl p-4 mb-4 hidden xl:block`}>
              <p className="text-6xl font-bold text-gray-800">{diferenciaDias}</p>
              <p className="text-lg font-bold">día/s restante/s</p>
            </div>
            {renderBoton()}
          </div>
        </div>
    );
}
