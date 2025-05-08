
import { useNavigate } from "react-router";

export default function Buscar() {

    const navigate = useNavigate()

    return (
      <>
        <input 
            type="text" 
            placeholder="Destino..."
            onChange={(e) => {
                navigate('/?name=' + e.target.value)
            }}
        />
      </>
    );
}
