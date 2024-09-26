import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal, Button } from "react-bootstrap";

const FindMember = () => {
  const [dni, setDni] = useState("");
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
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
        setShowModal(false);
      } else {
        const foundMembers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResults(foundMembers);
        setSelectedMember(foundMembers[0]); // Mostrar el primer socio encontrado
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error al buscar socios: ", error);
      alert("Hubo un problema al buscar el socio.");
    }
  };

  // Función para cerrar el modal
  const handleClose = () => {
    setShowModal(false);
    setDni(""); // Limpiar el campo de búsqueda
    setSelectedMember(null); // Limpiar el socio seleccionado
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

      {selectedMember && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Member Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h5>Name: {selectedMember.name}</h5>
              <p>DNI: {selectedMember.dni}</p>
              <p>Phone: {selectedMember.phone}</p>
              <p>Observations: {selectedMember.observaciones}</p>
              <p>
                Membership Start Date:{" "}
                {formatDate(selectedMember.membershipStartDate)}
              </p>
              <p>
                Membership End Date:{" "}
                {formatDate(selectedMember.membershipEndDate)}
              </p>
              <p>
                Status: {getMembershipStatus(selectedMember.membershipEndDate)}
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(`/edit/${selectedMember.id}`)}
            >
              Edit
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default FindMember;
