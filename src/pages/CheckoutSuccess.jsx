import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, []);

  return <h1>Pago exitoso. Redirigiendo...</h1>;
}
