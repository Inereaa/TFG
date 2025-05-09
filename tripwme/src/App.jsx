
import { useState } from "react";
import Principal from "./pages/Principal";
import { BrowserRouter, Routes, Route } from "react-router";
// import Carrito from "./pages/Carrito";
// import Detalles from "./pages/Detalles";
import Resultados from "./pages/Resultados";
import Viajes from "./pages/Viajes";
import CrearViaje from "./pages/CrearViaje";
import Login from "./pages/Login";
import Cuenta from "./pages/Cuenta";

export default function App() {
  const [carrito, setCarrito] = useState([])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Principal/> } />
          <Route path="/resultados" element={ <Resultados /> } />
          {/* <Route path="/carrito" element={ <Carrito setCarrito={setCarrito} carrito={carrito} /> } /> */}
          {/* <Route path="/detalle/:id" element={ <Detalles /> } /> */}

          <Route path="/viajes" element={ <Viajes /> } />
          <Route path="/crearviaje" element={ <CrearViaje /> } />
          <Route path="/reventas" element="" />

          <Route path="/cuenta" element={ <Cuenta /> } />
          <Route path="/login" element={ <Login /> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}
