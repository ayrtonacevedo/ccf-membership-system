import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

const FindMember = () => {
  const [dni, setDni] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Función para formatear la fecha
  const formatDate = (timestamp) => {
    const date = timestamp.toDate(); // Convierte el Timestamp a un objeto Date
    return date.toLocaleDateString(); // Devuelve la fecha en formato legible
  };

  // Función para obtener el estado de la membresía
  const getMembershipStatus = (membershipEndDate) => {
    const today = new Date();
    const endDate = membershipEndDate.toDate();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return diffDays <= 3 ? "expiring" : "active";
    } else {
      return "expired";
    }
  };

  // Manejo del cambio en el campo de búsqueda
  const handleDniChange = (e) => {
    setDni(e.target.value);
  };

  // Función para buscar socios
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const membersCollection = collection(db, "socios");
      const q = query(membersCollection, where("dni", "==", Number(dni)));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("No se encontraron socios con ese DNI.");
        setResults([]);
      } else {
        const foundMembers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResults(foundMembers);
      }
    } catch (error) {
      console.error("Error al buscar socios: ", error);
      alert("Hubo un problema al buscar el socio.");
    }
  };

  return (
    <div className="container">
      <h2>Find Member</h2>
      <form onSubmit={handleSearch}>
        <div className="mb-3">
          <label className="form-label">Search by DNI</label>
          <input
            type="number"
            className="form-control"
            value={dni}
            onChange={handleDniChange}
            placeholder="Enter member DNI"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
      {results.length > 0 && (
        <table className="table table-dark table-hover mt-3">
          <thead>
            <tr>
              <th>Socio</th>
              <th>Fecha vencimiento</th>
              <th>Membresia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {results.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{formatDate(member.membershipEndDate)}</td>
                <td>
                  {(() => {
                    const status = getMembershipStatus(
                      member.membershipEndDate
                    );
                    if (status === "active") {
                      return <span className="badge bg-success">Activa</span>;
                    } else if (status === "expiring") {
                      return (
                        <span className="badge bg-warning">
                          Por vencer en 3 días
                        </span>
                      );
                    } else {
                      return <span className="badge bg-danger">Expirada</span>;
                    }
                  })()}
                </td>
                <td>
                  <button
                    className="btn btn-light"
                    onClick={() => navigate(`/edit/${member.id}`)}
                  >
                    <i className="fa-solid fa-user-pen"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FindMember;
