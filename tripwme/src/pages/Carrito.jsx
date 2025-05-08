
import Navegacion from "../components/Navegacion";

export default function Carrito({ setCarrito, carrito }) {

    // const agregarAlCarrito = (producto) => {
    //   const existe = carrito.find(item => item.id === producto.id);
  
    //   if (existe) {
    //       setCarrito(carrito.map(item =>
    //           item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
    //       ));
    //   } else {
    //       setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    //   }
    // };

    const agregarAlCarrito = (producto) => {
      setCarrito([...carrito, producto])
    }

    const eliminarDelCarrito = (producto) => {
      setCarrito(carrito.filter(item => item.id !== producto.id));
    }

    return (
      <>
        <Navegacion/>
        <h2>CARRITO</h2>
        {carrito.map((producto) => (
            <div key={producto.id}>
                <h2>{producto.title}</h2>
                <p>{producto.price} €</p>
                <button onClick={() => agregarAlCarrito(producto)}>+</button>
                <button onClick={() => eliminarDelCarrito(producto)}>-</button>
            </div>
        ))}
      </>
    );
}

