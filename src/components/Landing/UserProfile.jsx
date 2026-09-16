
import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const UserProfileCard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/users/1`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error cargando perfil:", err));
  }, []);

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div>
      <p>
        <strong>Nombre:</strong> {user.first_name} {user.last_name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Teléfono:</strong> {user.phone}
      </p>
      <p>
        <strong>Dirección:</strong> {user.adress}
      </p>
      <p>
        <strong>Usuario:</strong> {user.username}
      </p>
    </div>
  );
};

export default UserProfileCard;
