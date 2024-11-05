import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal, Button } from "react-bootstrap";
import {
  getMembershipStatus,
  formatTimestampToLocaleDate,
} from "../../utils/helpers";

import "./findMember.css";

const FindMember = () => {
  const navigate = useNavigate();
  const [dni, setDni] = useState("");
  const [member, setMember] = useState(null); // Cambiado a null para representar "sin resultados"
  const [showModal, setShowModal] = useState(false);

  const handleDniChange = (e) => {
    setDni(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const membersCollection = collection(db, "socios");
      const q = query(membersCollection, where("dni", "==", Number(dni)));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("No se encontraron socios con ese DNI.");
        setMember(null); // Cambiado para indicar "sin resultados"
        setShowModal(false);
      } else {
        const foundMembers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMember(foundMembers);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error al buscar socios: ", error);
      alert("Hubo un problema al buscar el socio.");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setDni(""); // Limpiar el campo de búsqueda
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

        {member && member.length > 0 && (
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Detalles del Socio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <h5>Estado de la Membresía</h5>
                {member[0].membershipEndDate && (
                  <div
                    className={`alert ${
                      getMembershipStatus(member[0].membershipEndDate)
                        .status === "active"
                        ? "alert-success"
                        : getMembershipStatus(member[0].membershipEndDate)
                            .status === "expiring"
                        ? "alert-warning"
                        : "alert-danger"
                    }`}
                  >
                    {getMembershipStatus(member[0].membershipEndDate).status ===
                      "active" && <span>Tu membresia esta activa!</span>}
                    {getMembershipStatus(member[0].membershipEndDate).status ===
                      "expiring" && (
                      <span>
                        Atención: tu membresía está por vencer en{" "}
                        {
                          getMembershipStatus(member[0].membershipEndDate)
                            .daysRemaining
                        }{" "}
                        días.
                      </span>
                    )}
                    {getMembershipStatus(member[0].membershipEndDate).status ===
                      "expired" && <span>Tu membresía ha expirado.</span>}
                  </div>
                )}
                <h5>{member[0].name}</h5>
                <img
                  src={member[0].img}
                  alt="imgprofile"
                  className="img-fluid"
                />
                <p>DNI: {member[0].dni}</p>
                <p>Teléfono: {member[0].phone}</p>
                <p>Observaciones: {member[0].observaciones}</p>
                <p>
                  Fecha Inicio:{" "}
                  {formatTimestampToLocaleDate(member[0].membershipStartDate)}
                </p>
                <p>
                  Fecha Vencimiento:{" "}
                  {formatTimestampToLocaleDate(member[0].membershipEndDate)}
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate(`/edit/${member[0].id}`)}
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
