// import React from "react";

// const UserProfile = () => {
//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Esta es la vista del perfil de usuario</h2>
//     </div>
//   );
// };

// export default UserProfile;

import React, { useEffect, useState } from "react";

const UserProfileCard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/users/1")
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
