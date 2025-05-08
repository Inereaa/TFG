
import { useLocation } from "react-router";

export default function Resultados() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const destino = queryParams.get('destino');

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold">Resultados para: {destino}</h1>
        </div>
    );
}
