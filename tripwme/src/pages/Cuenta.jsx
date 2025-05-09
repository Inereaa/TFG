
import Navegacion from "../components/Navegacion";
import React, { useEffect, useState } from "react";

export default function Cuenta() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8000/api/cuenta", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Respuesta con error:", errorText);
          throw new Error(`Error al obtener la cuenta: ${res.status}`);
        }
    
        const data = await res.json();
        setUsuario(data);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };
    

    fetchPerfil();
  }, []);

  if (!usuario) {
    return <p>Cargando cuenta...</p>;
  }
  
    return (
      <>
        <Navegacion />
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center bg-white rounded-2xl shadow p-6 mb-8">
            <img
              src={usuario.foto}
              alt="Foto perfil"
              className="w-24 h-24 rounded-full mr-6 border-2 border-blue-500"
            />
            <div>
              <h2 className="text-2xl font-bold mb-1">Hola, {usuario.username}</h2>
              <p className="text-blue-600 font-semibold">Nivel: {usuario.nivel}</p>
              <p className="text-gray-600">Has realizado {usuario.viajes_realizados} viajes</p>
            </div>
          </div>

        {/* Datos Personales */}
        <Section title="Datos Personales">
          <Data label="Nombre de usuario" value={usuario.username} />
          <Data label="Email" value={usuario.email} />
          <Data label="Teléfono" value={usuario.telefono} />
          <button className="mt-2 text-blue-600 font-semibold">Editar</button>
        </Section>

        {/* Seguridad */}
        <Section title="Seguridad">
          <button className="text-blue-600 font-semibold mb-2">Cambiar contraseña</button>
          <button className="text-blue-600 font-semibold">Activar 2FA</button>
        </Section>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-8">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Data({ label, value }) {
  return (
    <div className="mb-2">
      <span className="font-semibold">{label}: </span>
      <span>{value}</span>
    </div>
    );
}
