
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [usuario, setUsuario] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await fetch("http://localhost:8000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });
  
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        alert("Inicio de sesión exitoso.");
        localStorage.setItem("token", loginData.token);
        navigate("/viajes");
  
      } else if (loginResponse.status === 401) {
        const crearUsuario = {
          email: usuario.email,
          password: usuario.password,
          username: usuario.email,
        };
  
        const crearResponse = await fetch("http://localhost:8000/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(crearUsuario),
        });
  
        if (crearResponse.ok) {
          alert("Usuario creado correctamente.");
  
          const nuevoLoginResponse = await fetch("http://localhost:8000/api/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario),
          });
  
          if (nuevoLoginResponse.ok) {
            const nuevoLoginData = await nuevoLoginResponse.json();
            localStorage.setItem("token", nuevoLoginData.token);
            navigate("/viajes");
          } else {
            alert("Usuario creado pero no se pudo iniciar sesión.");
          }
  
        } else {
          const errorData = await crearResponse.json();
          console.error("Error al crear usuario:", errorData);
          alert("No se pudo crear el usuario.");
        }
  
      } else {
        const text = await loginResponse.text();
        console.error("Respuesta inesperada del login:", loginResponse.status, text);
        alert(`Error inesperado al iniciar sesión. Código: ${loginResponse.status}`);
      }
  
    } catch (error) {
      console.error("Error en el proceso:", error);
      alert("Error inesperado en el proceso.");
    }
  };
  

  return (
    <div className="min-h-screen bg-[#f6fbf0] flex flex-col">
      <nav className="flex justify-center items-center px-6 py-4 bg-[#bad0bb] shadow-md">
        <Link to="/">
          <img
            src="/img/imagen_2025-04-02_110941347-removebg-preview.png"
            alt="logo"
            className="h-14 mr-200 cursor-pointer hover:scale-105 transform duration-300"
          />
        </Link>

        <div className="relative group flex items-center justify-center">
          <button className="text-[#5c3838] text-sm hover:underline hover:text-[#c36c6c] transition cursor-pointer">
            ¿Ayuda?
          </button>
          <div className="absolute gap-1 flex flex-col items-center top-full mt-2 w-64 bg-white border border-gray-200 shadow-md rounded-md p-3 text-sm text-gray-700 z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 left-1/2 -translate-x-1/2">
            ¿Necesitas ayuda? Contáctanos:<br />
            <strong className="text-[#163e15]">helptripwme@gmail.com</strong>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-center text-[#6e3e3e]">¡Inicia sesión o crea una cuenta nueva!</h2>
          <p className="text-center text-sm text-gray-700">Puedes iniciar sesión con tu cuenta de tripWme o crear una nueva para acceder a nuestros servicios</p>

          <div>
            <label className="block text-gray-800 font-semibold mb-1" htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Indica tu dirección email"
              value={usuario.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e07e7e]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-1" htmlFor="password">Contraseña</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="•••••••••"
              value={usuario.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e07e7e]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#e07e7e] hover:bg-[#c36c6c] text-white font-semibold py-2 px-4 rounded-md transition duration-300 cursor-pointer"
          >
            Continuar con email
          </button>

          <div className="text-center">
            <Link to="/" className="text-[#5c3838] text-sm hover:underline hover:text-[#c36c6c] transition duration-200">
              ← Volver al inicio
            </Link>
          </div>
          <hr className="opacity-20" />
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs opacity-50 text-center w-80">Al iniciar sesión o al crear una cuenta, aceptas nuestros <span className="text-[#761515] cursor-pointer hover:underline">Términos y condiciones</span> y la <span className="text-[#761515] cursor-pointer hover:underline">Política de privacidad</span>.</p>
            <div>
              <p className="text-xs opacity-50 text-center w-80">Todos los derechos reservados.</p>
              <p className="text-xs opacity-50 text-center w-80">&copy; 2024 - 2025 tripWme.</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
