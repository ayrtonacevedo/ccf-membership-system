import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal, Button } from "react-bootstrap";

import "./findMember.css";

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
    <div className="bg-image">
      <button
        className="btn-close btn-css"
        onClick={() => navigate("/dashboard")}
      ></button>
      <div className="container-findMember">
        <h1 className="h1-ingresoCCf">Ingreso CCF</h1>
        <form onSubmit={handleSearch}>
          <div className="mb-3">
            {/* <label className="form-label">Ingrese su DNI</label> */}
            <input
              type="text"
              className="form-control input-buscar"
              value={dni}
              onChange={handleDniChange}
              placeholder="Ingrese su DNI"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-buscarSocio">
            Buscar
          </button>
        </form>

        {selectedMember && (
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Detalles del Socio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <h5>Estado de la Membresía</h5>
                <div
                  className={`alert ${
                    getMembershipStatus(selectedMember.membershipEndDate) ===
                    "active"
                      ? "alert-success"
                      : getMembershipStatus(
                          selectedMember.membershipEndDate
                        ) === "expiring"
                      ? "alert-warning"
                      : "alert-danger"
                  }`}
                >
                  {getMembershipStatus(selectedMember.membershipEndDate) ===
                    "active" && <span>¡Tu membresía está activa!</span>}
                  {getMembershipStatus(selectedMember.membershipEndDate) ===
                    "expiring" && (
                    <span>
                      Atención: tu membresía está por vencer en{" "}
                      {Math.ceil(
                        (selectedMember.membershipEndDate.toDate() -
                          new Date()) /
                          (1000 * 60 * 60 * 24)
                      )}
                      días.
                    </span>
                  )}
                  {getMembershipStatus(selectedMember.membershipEndDate) ===
                    "expired" && <span>Tu membresía ha expirado.</span>}
                </div>

                <h5>{selectedMember.name}</h5>
                <img src={selectedMember.img} alt="imgprofile" />
                <p>DNI: {selectedMember.dni}</p>
                <p>Teléfono: {selectedMember.phone}</p>
                <p>Observaciones: {selectedMember.observaciones}</p>
                <p>
                  Fecha de Inicio de Membresía:{" "}
                  {formatDate(selectedMember.membershipStartDate)}
                </p>
                <p>
                  Fecha de Vencimiento de Membresía:{" "}
                  {formatDate(selectedMember.membershipEndDate)}
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate(`/edit/${selectedMember.id}`)}
              >
                Editar
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default FindMember;
