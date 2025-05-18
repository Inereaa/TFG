
import Principal from "./pages/Principal";
import { BrowserRouter, Routes, Route } from "react-router";
import Viajes from "./pages/Viajes";
import CrearViaje from "./pages/CrearViaje";
import Login from "./pages/Login";
import Cuenta from "./pages/Cuenta";
import Actividades from "./pages/Actividades";

export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Principal/> } />

          <Route path="/viajes" element={ <Viajes /> } />
          <Route path="/crearviaje" element={ <CrearViaje /> } />
          <Route path="/actividades" element={ <Actividades /> } />

          <Route path="/cuenta" element={ <Cuenta /> } />
          <Route path="/login" element={ <Login /> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}
