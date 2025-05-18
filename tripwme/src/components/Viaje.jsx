
import { useEffect, useState } from "react";

export default function TarjetaViaje({ viaje }) {
    const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
    const [misViajes, setMisViajes] = useState([]);
    const [numParticipantes, setNumParticipantes] = useState(0);
  
    useEffect(() => {
        const token = localStorage.getItem("token");
        setUsuarioAutenticado(!!token);

        fetch("http://localhost:8000/api/mis-viajes", {
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

        fetch(`http://localhost:8000/api/viajes/${viaje.id}/participantes`, {
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
        .then((data) => setNumParticipantes(data.count || 0))
    }, [viaje.id]);
  
    const yaInscrito = misViajes.some((v) => Number(v.viajeId) === Number(viaje.id));
    const viajeLleno = numParticipantes >= viaje.maxPersonas;
  
    const unirse = async () => {
        console.log("Intentando unirse al viaje:", viaje.id);
        
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        const res = await fetch(`http://localhost:8000/api/unirse/${viaje.id}`, {
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
        const res = await fetch(`/cancelar-plaza/${usuarioViaje.id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        const data = await res.json();
        if (res.ok) {
            alert("Plaza cancelada");
            setMisViajes((prev) => prev.filter((v) => v.id !== usuarioViaje.id));
        } else {
            alert(data.error || "Error al cancelar");
        }
    };

    const renderBoton = () => {
        if (!usuarioAutenticado) {
            return <p className="text-sm italic mt-2">Inicia sesión para saber más</p>;
        }

        if (yaInscrito) {
            return (
                <>
                    <button
                        onClick={cancelar}
                        className="bg-yellow-600 text-white px-4 py-2 mt-2 rounded-xl font-bold hover:bg-yellow-700 transition duration-300 cursor-pointer"
                    >
                        Cancelar plaza
                    </button>
                    <small className="mt-2 opacity-60">¡Ya te has unido a este viaje!</small>
                </>
            );
        }

        if (viajeLleno) {
            return <p className="text-sm font-bold text-red-600 mt-2">¡Este viaje ya está cerrado!</p>;
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
    }

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
        <div className={`flex p-8 rounded-4xl shadow-md items-center ${tarjetaColor} relative`}>
          <img src={`/img/${viaje.destino.toLowerCase()}.jpg`} alt="destino" className="w-50 h-50 object-cover rounded-2xl mr-10" />
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-2xl mb-6">{viaje.destino}</h2>
            <p>📅 {viaje.fechaInicio} // {viaje.fechaFin}</p>
            <p>💶 Presupuesto mínimo: {viaje.presupuestoMinimo} €</p>
            <p>👥 Nº de personas: {viaje.minPersonas} - {viaje.maxPersonas}</p>
            <p><i>🧑‍💼 Email de contacto: <span className="font-semibold">{viaje.usuarioOrganizador.nombre}</span></i></p>
          </div>
          <div className="absolute top-6 right-10 text-right flex flex-col">
            <div className={`flex flex-col items-center ${diasRestantesColor} rounded-3xl p-4 mb-4`}>
              <p className="text-6xl font-bold text-gray-800">{diferenciaDias}</p>
              <p className="text-lg font-bold">día/s restante/s</p>
            </div>
            {renderBoton()}
          </div>
        </div>
      );
}
