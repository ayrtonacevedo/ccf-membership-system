import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal, Button } from "react-bootstrap";
import {
  getMembershipStatus,
  formatTimestampToLocaleDate,
} from "../../utils/helpers";
import Spinner from "react-bootstrap/Spinner";
import "./findMember.css";
import ImgProfile from "../../resources/profileCCf.png";

const FindMember = () => {
  const navigate = useNavigate();
  const [dni, setDni] = useState("");
  const [member, setMember] = useState([]); // Cambiado a null para representar "sin resultados"
  const [showModal, setShowModal] = useState(false);
  const { status, daysRemaining } =
    member && member.length > 0
      ? getMembershipStatus(member[0].membershipEndDate)
      : { status: "inactive", daysRemaining: 0 }; // Valor por defecto si no hay miembro
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDniChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d{0,8}$/.test(inputValue)) {
      setDni(inputValue);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (dni.length !== 8) {
      setErrorMessage(
        "Por favor, asegúrate de ingresar un DNI válido de 8 dígitos."
      );
      return;
    }
    setLoading(true);
    setShowModal(true);
    setErrorMessage(null);
    try {
      const membersCollection = collection(db, "socios");
      const q = query(membersCollection, where("dni", "==", Number(dni)));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setErrorMessage("No encontramos ningún socio con ese DNI.");
        setMember([]); // Cambiado para indicar "sin resultados"
        setDni(""); // Limpiar el campo de búsqueda
        setShowModal(false);
      } else {
        const foundMembers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMember(foundMembers);
      }
    } catch (error) {
      console.error("Error al buscar socios: ", error);
      setErrorMessage(
        "Hubo un problema al buscar el socio. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setDni(""); // Limpiar el campo de búsqueda
  };
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter" && showModal) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [showModal]);

  return (
    <div className="bg-image">
      <button
        className="btn-close btn-css"
        onClick={() => navigate("/")}
      ></button>
      <div className="container-findMember">
        <h1 className="h1-ingresoCCf">Membership System</h1>
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
          <button
            type="submit"
            className="btn btn-primary btn-buscarSocio"
            disabled={loading}
          >
            Buscar
          </button>
        </form>
        {errorMessage && (
          <div className="custom-alert-warning" role="alert">
            <i
              class="bi bi-exclamation-octagon-fill fs-1 "
              style={{ color: "white" }}
            ></i>

            <span className="statusMembership">{errorMessage}</span>
          </div>
        )}
        {member && member.length > 0 && (
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header className="custom-modal-header" closeButton>
              <Modal.Title>Detalles Socio</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center spinner-container">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Buscando...</span>
                  </Spinner>
                  <span className="ms-3">Buscando socio...</span>{" "}
                  {/* Mensaje de carga */}
                </div>
              ) : (
                <div className="modalIngreso">
                  <div className="row">
                    <div className="col-md-6">
                      <img
                        src={
                          member && member[0] && member[0].img
                            ? member[0].img
                            : ImgProfile
                        }
                        alt="imgprofile"
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="nameDate">
                        <strong>Nombre</strong>

                        <p>{member[0].name}</p>
                      </div>

                      <div className="nameDate">
                        <strong>DNI</strong>

                        <p>{member[0].dni}</p>
                      </div>

                      <div className="nameDate">
                        <strong>Teléfono</strong>

                        <p>{member[0].phone}</p>
                      </div>

                      <div className="nameDate">
                        <strong>Observaciones</strong>

                        <p>{member[0].observaciones}</p>
                      </div>

                      <div className="nameDate">
                        <strong>Vencimiento</strong>

                        <p>
                          {formatTimestampToLocaleDate(
                            member[0].membershipEndDate
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {member[0].membershipEndDate && (
                      <div
                        className={`alert  ${
                          status === "active"
                            ? "alert-success"
                            : status === "expiring"
                            ? "alert-warning"
                            : "alert-danger"
                        }`}
                      >
                        {status === "active" && (
                          <span className="statusMembership">
                            Tu membresía está activa!
                          </span>
                        )}
                        {status === "expiring" && daysRemaining > 0 && (
                          <span className="statusMembership">
                            Tu membresía está por vencer en {daysRemaining}{" "}
                            {daysRemaining === 1 ? "día" : "días"}!
                          </span>
                        )}
                        {status === "expiring" && daysRemaining === 0 && (
                          <span className="statusMembership">
                            ¡Tu membresía expira hoy!
                          </span>
                        )}
                        {status === "expired" && (
                          <span className="statusMembership">
                            Tu membresía ha expirado!
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
              <Button
                variant="success"
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
